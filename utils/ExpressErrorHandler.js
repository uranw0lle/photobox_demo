//We extend the regular Error class to wrap it>
//around our own functions
class ExpressErrorHandler extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = ExpressErrorHandler;