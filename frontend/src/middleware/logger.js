const logEvent = (eventType, message, meta = {}) => {
  const timestamp = new Date().toISOString();

  const logEntry = {
    timestamp,
    eventType,
    message,
    meta,
  };

  window.__CUSTOM_LOGGER__ = window.__CUSTOM_LOGGER__ || [];
  window.__CUSTOM_LOGGER__.push(logEntry);

  const styledMessage = `%c[${eventType}] %c${message}`;
  const styles = ["color: blue; font-weight: bold;", "color: black;"];

  if (eventType === "ERROR") {
    console.error(styledMessage, ...styles);
    console.error("Details:", logEntry);
  } else if (eventType === "WARN") {
    console.warn(styledMessage, ...styles);
    console.warn("Details:", logEntry);
  } else {
    console.info(styledMessage, ...styles);
    console.debug("Details:", logEntry);
  }
};

const logger = {
  info: (msg, meta) => logEvent("INFO", msg, meta),
  warn: (msg, meta) => logEvent("WARN", msg, meta),
  error: (msg, meta) => logEvent("ERROR", msg, meta),
  debug: (msg, meta) => logEvent("DEBUG", msg, meta),
};

export default logger;
