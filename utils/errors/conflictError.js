const { statusCodes } = require("../constants");

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.CONFLICT;
  }
}

module.exports = ConflictError;
