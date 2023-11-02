const createId = require("./createId");
const messages = require("./messages");
const logger = require("./logger");
const errorHOC = require("./errorHOC");
const getGoogleAuthTokens = require("./getGoogleAuthTokens");
const { clearTokens, generateTokens, setCookies } = require("./cookie");

module.exports = {
  messages,
  logger,
  errorHOC,
  getGoogleAuthTokens,
  createId,
  clearTokens,
  generateTokens,
  setCookies,
};
