const { clearTokens, messages, logger } = require("@utils");

// General error handling middleware
const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case "YupValidationError":
      logger.error(error.message, {
        metadata: error,
        stack: error.stack,
        name: error.name,
      });
      return res.status(400).json({ message: error.message, type: error.name });
    case "TokenExpiredError":
      //check if route is logout then clear cookies
      const { path } = req.route;
      if (path === "/api/v1/auth/logout") {
        clearTokens(res);
      }
      logger.error(error.message, {
        metadata: error,
        stack: error.stack,
        name: error.name,
      });
      return res.status(401).json({ message: messages.tokenExpired });

    case "RefreshTokenExpiredError":
      logger.error(error.message, {
        metadata: error,
        stack: error.stack,
        name: error.name,
      });
      return res.status(401).json({ message: messages.refreshTokenExpired });
    default:
      logger.error(error.message, {
        metadata: error,
        stack: error.stack,
        name: error.name,
      });
      return res.status(500).json({ message: messages.serverError });
  }
};

module.exports = errorHandler;
