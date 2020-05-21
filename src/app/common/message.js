export default function (
  res,
  status = 401,
  message = 'Resource not found',
  error = true
) {
  return !error
    ? res.status(status).json({ message })
    : res.status(status).json({ error: message });
}
