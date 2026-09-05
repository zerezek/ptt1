// POST /api/reading
// Single model-call path for both product and admin prompt validation.
// During Run 1 this endpoint is admin-token protected to prevent public spend.

const { assemble, splitCrisisMarker, PROMPT_VERSION } = require("../lib/prompt.js");

const REQUESTED_MODEL_ID = process.env.MODEL_ID || "claude-sonnet-4-6";
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);
const MAX_IMAGES = 4;
// Keep the JSON request body comfortably below common serverless limits.
// This is a total base64-character budget across all images, not per image.
const MAX_TOTAL_IMAGE_BASE64_CHARS = 3_000_000;
const CRISIS_FALLBACK_TEXT =
  "What you wrote sounds heavier than anything a cup can hold. Please talk to someone you trust about how you are feeling, or reach a local support service where someone can help you directly. You do not have to carry this on your own.";

function parseBody(req) {
  if (typeof req.body === "string") return JSON.parse(req.body);
  return req.body || {};
}

function validateImages(images) {
  if (images == null) return [];
  if (!Array.isArray(images)) throw new Error("images must be an array.");
  if (images.length > MAX_IMAGES) throw new Error(`Maximum ${MAX_IMAGES} images per reading.`);

  let totalBase64Chars = 0;
  const clean = images.map((img, i) => {
    if (!img || !ALLOWED_IMAGE_TYPES.has(img.media_type)) {
      throw new Error(`Image ${i + 1} has an unsupported media_type.`);
    }
    if (typeof img.data !== "string" || !img.data.length) {
      throw new Error(`Image ${i + 1} is missing base64 data.`);
    }
    totalBase64Chars += img.data.length;
    return { media_type: img.media_type, data: img.data };
  });

  if (totalBase64Chars > MAX_TOTAL_IMAGE_BASE64_CHARS) {
    throw new Error("Images are too large in total. Keep the combined upload under about 3 MB after compression.");
  }
  return clean;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST." });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const adminToken = process.env.ADMIN_TOKEN;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set on the server." });
  if (!adminToken) return res.status(500).json({ error: "ADMIN_TOKEN is not set on the server." });

  const suppliedAdminToken = req.headers["x-admin-token"] || "";
  const isAdmin = Boolean(adminToken && suppliedAdminToken === adminToken);

  // Protect the model call itself during validation. Keeping `isAdmin` separate
  // also ensures debug fields remain explicitly gated if the public product path
  // is opened later.
  if (!isAdmin) {
    return res.status(401).json({ error: "Invalid admin token." });
  }

  let input;
  try {
    input = parseBody(req);
  } catch {
    return res.status(400).json({ error: "Body is not valid JSON." });
  }

  let images;
  try {
    images = validateImages(input.images);
    if (input.readingType === "own_cup" && images.length === 0) {
      return res.status(400).json({ error: "Own-cup readings require at least one image." });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  let prompt;
  try {
    prompt = assemble(input);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  const content = [];
  for (const img of images) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: img.media_type, data: img.data },
    });
  }
  content.push({ type: "text", text: prompt.user });

  const started = Date.now();
  let data;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: REQUESTED_MODEL_ID,
        max_tokens: 900,
        system: prompt.system,
        messages: [{ role: "user", content }],
      }),
    });
    data = await response.json();
    if (!response.ok) {
      return res.status(502).json({
        error: "The model call failed.",
        detail: data && data.error ? data.error.message : "No detail returned.",
      });
    }
  } catch (e) {
    return res.status(502).json({ error: "Could not reach the model.", detail: e.message });
  }

  const raw = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");

  const parsed = splitCrisisMarker(raw);
  const usedFallback = Boolean(parsed.crisis && !parsed.text);
  const text = usedFallback ? CRISIS_FALLBACK_TEXT : parsed.text;
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const resolvedModelId = data.model || null;

  const payload = {
    text,
    crisis: parsed.crisis,
    marker: parsed.marker,
    contractViolation: parsed.contractViolation,
    usedFallback,
    words,
    promptVersion: PROMPT_VERSION,
    requestedModelId: REQUESTED_MODEL_ID,
    resolvedModelId,
    chargeAllowance: !parsed.crisis,
    saveToHistory: !parsed.crisis,
    showShareCard: !parsed.crisis,
    showDonation: !parsed.crisis,
    latencyMs: Date.now() - started,
  };

  // Debug-only fields are never part of a non-admin response, even if this
  // endpoint is later reused by the public product flow.
  if (isAdmin) {
    payload.raw = raw;
    payload.systemPrompt = prompt.system;
    payload.userPrompt = prompt.user;
  }

  return res.status(200).json(payload);
};
