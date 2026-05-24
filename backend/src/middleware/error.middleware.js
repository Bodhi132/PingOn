/**
 * Express 5 error-handling middleware (4-arg).
 */
// eslint-disable-next-line no-unused-vars -- Express requires unused `next`
export function errorHandler(err, req, res, next) {
  const status = Number(err.status ?? err.statusCode ?? 500);
  const message =
    status >= 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  if (status >= 500) {
    console.error("[api]", err);
  }

  res.status(Number.isFinite(status) ? status : 500).json({ error: message });
}
