const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    // login

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        const user = await User.findOne({ where: { email: email } })

        if(!user) {
            req.flash('messageError', 'Email inválido! Tente novamente.')
            res.render('auth/login')

            return
        }

        const passwordVerify = bcrypt.compareSync(password, user.password)

        if(!passwordVerify) {
            req.flash('messageError', "Senha incorreta! Tente novamente.")
            res.render('auth/login')

            return
        }

        req.session.userid = user.id

        if(req.session.userid) {
            req.flash('messageSucess', `Login realizado com sucesso!`)
            req.session.save(() => {
                res.redirect('/')
            })
        } else {
            req.flash('messageError', "Problema no session!")
        }
    }

    // register

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {
        const { name, email, password, confirmpassword } = req.body

        if(password != confirmpassword) {
            req.flash('messageError', "As senhas não conferem! Tente novamente.")
            res.render('auth/register')

            return
        }

       const checkIfUserExists = await User.findOne({ where: { email: email }})

       if(checkIfUserExists) {
            req.flash('messageError', "O email já está em uso! Tente novamente.")
            res.render('auth/register')

            return
       }

       const salt = bcrypt.genSaltSync(10)
       const hashedPassword = bcrypt.hashSync(password, salt)

       const user = { name, email, password: hashedPassword }

       try {
        const createdUser = await User.create(user)

        req.session.userid = createdUser.id

        req.session.save(() => {
            res.redirect('/')
        })

        req.flash('messageSucess', "Cadastro realizado com sucesso!")

       } catch(err) {
            console.log(err)
       }
    }

    // logout

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/entrar')
    }
}