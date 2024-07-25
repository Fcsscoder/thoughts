module.exports.checkAuth = function (req, res, next) {
    const userId = req.session.userid

    if(!userId) {
        req.flash('messageError', "Por favor, primeiro faça o login.")
        res.redirect('/entrar')

        return
    }

    next()
}