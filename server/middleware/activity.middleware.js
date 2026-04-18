const UserActivity = require("../models/userActivity.models");

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pickUserInput(req) {
  const body = req && req.body && typeof req.body === "object" ? req.body : {};
  const candidates = [body.url, body.repoUrl, body.input, body.profileUrl, body.username];
  for (const value of candidates) {
    if (isNonEmptyString(value)) return String(value).trim();
  }
  return "";
}

function extractRepoSlug(value) {
  if (!isNonEmptyString(value)) return null;
  const raw = String(value).trim();

  if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(raw)) {
    return raw.replace(/\.git$/i, "");
  }

  const stripped = raw.replace(/^https?:\/\/github\.com\//i, "").replace(/^github\.com\//i, "");
  const parts = stripped.split("/").filter(Boolean);
  if (parts.length < 2) return null;

  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/i, "");
  if (!owner || !repo) return null;
  return `${owner}/${repo}`;
}

function logRepoActivity(action) {
  return (req, res, next) => {
    const startedAt = Date.now();

    res.once("finish", () => {
      if (!req.user) return;

      const inputValue = pickUserInput(req);
      const repoSlug = extractRepoSlug(inputValue);
      const cacheHeader = String(res.getHeader("X-RepoSmart-Cache") || "").toUpperCase();

      const doc = {
        userId: req.user,
        action: isNonEmptyString(action) ? action : "REPO_ACTION",
        endpoint: req.originalUrl || req.path || "",
        repoUrl: isNonEmptyString(inputValue) ? inputValue : null,
        repoSlug,
        statusCode: Number.isFinite(res.statusCode) ? res.statusCode : 500,
        durationMs: Math.max(0, Date.now() - startedAt),
        fromCache: cacheHeader === "HIT",
      };

      UserActivity.create(doc).catch(() => {
        // Activity logging is best effort and must never break API responses.
      });
    });

    next();
  };
}

module.exports = {
  logRepoActivity,
};
