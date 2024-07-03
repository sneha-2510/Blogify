const { validateToken } = require("../utils/authentication");

function checkForAuthenticateCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if (!tokenCookieValue) {
            return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue); // validate the token
            // Attach the user payload to the request object
            req.user = userPayload;
        } catch (error) {
            console.error('Token validation error:', error.message);
        }

        return next();
    }
}

module.exports = {
    checkForAuthenticateCookie
}