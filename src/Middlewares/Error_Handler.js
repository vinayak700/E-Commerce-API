const errorHandler = (err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error" });
};

export { errorHandler };
