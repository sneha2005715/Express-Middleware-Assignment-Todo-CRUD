module.exports = function validateTodo(req, res, next) {
  const body = req.body;

  // Must have only one key: title
  if (!body.title || typeof body.title !== "string" || Object.keys(body).length !== 1) {
    return res.status(400).json({
      error: "Invalid request body. Only 'title' is allowed",
    });
  }

  next();
};
