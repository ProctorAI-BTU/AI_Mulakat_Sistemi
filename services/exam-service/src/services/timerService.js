const timers = new Map();

function startTimer(sessionId, durationMinutes) {
  const durationMs = Number(durationMinutes || 0) * 60 * 1000;
  const startedAt = new Date();
  const expiresAt = new Date(Date.now() + durationMs);

  timers.set(sessionId, {
    sessionId,
    startedAt,
    expiresAt,
    durationMinutes: Number(durationMinutes || 0),
  });

  return timers.get(sessionId);
}

function getTimer(sessionId) {
  return timers.get(sessionId) || null;
}

function getRemainingSeconds(sessionId) {
  const timer = timers.get(sessionId);

  if (!timer) {
    return 0;
  }

  return Math.max(0, Math.floor((timer.expiresAt.getTime() - Date.now()) / 1000));
}

function clearTimer(sessionId) {
  timers.delete(sessionId);
}

module.exports = {
  startTimer,
  getTimer,
  getRemainingSeconds,
  clearTimer,
};