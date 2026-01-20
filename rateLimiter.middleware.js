const requests = new Map();
const LIMIT = 15;
const WINDOW = 60 * 1000; // 1 minute

module.exports = function rateLimiter(req, res, next) {
  const ip = req.ip;
  const currentTime = Date.now();

  if (!requests.has(ip)) {
    requests.set(ip, []);
  }

  const timestamps = requests.get(ip).filter(time => currentTime - time < WINDOW);
  timestamps.push(currentTime);
  requests.set(ip, timestamps);

  if (timestamps.length > LIMIT) {
    return res.status(429).json({
      error: "Too many requests, please try again later",
    });
  }

  next();
};
