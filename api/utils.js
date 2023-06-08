function requireUser(req, res, next) {
    if (!req.user) {
        next({
            name: "MissingUserError",
            message: "You gotta log in first!"
        })
    }
    next();
}
module.exports = { requireUser }