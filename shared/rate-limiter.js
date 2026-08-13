const rateLimits = new Map();

function rateLimit({ windowMs, max, keyGenerator }) {
  return (req, res, next) => {
    const key = keyGenerator ? keyGenerator(req) : req.ip || 'anonymous';
    const limitKey = `${req.method}:${req.path}:${key}`;
    const now = Date.now();

    const record = rateLimits.get(limitKey) || { count: 0, resetAt: now + windowMs };

    if (now > record.resetAt) {
      record.count = 1;
      record.resetAt = now + windowMs;
      rateLimits.set(limitKey, record);
      return next();
    }

    record.count += 1;
    rateLimits.set(limitKey, record);

    if (record.count > max) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    next();
  };
}

function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (now > record.resetAt) {
      rateLimits.delete(key);
    }
  }
}

setInterval(cleanupRateLimits, 60000);

module.exports = {
  rateLimit,
  cleanupRateLimits
};
