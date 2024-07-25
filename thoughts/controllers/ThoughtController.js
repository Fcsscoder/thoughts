const Thought = require('../models/Thought');
const User = require('../models/User');

const { Op } = require('sequelize');

module.exports = class ThoughtController {

    // get da home

    static async showThoughts(req, res) {
        let search = ''

        if(req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const thoughtsData = await Thought.findAll({ 
            include: User, 
            where: {
                 title: { [Op.like]: `%${search}%` }
            },
            order: [['createdAt', order]]
        })

        const thoughts = thoughtsData.map((result) => result.get({ plain: true }))

        let thoughtsQty = thoughts.length

        if(thoughtsQty === 0) {
            thoughtsQty = false
        }

        res.render('thoughts/home', { thoughts, search, thoughtsQty })
    }

    // dashboard

    static async dashboard(req, res) {
        
        const user = await User.findOne({
            where: { id: req.session.userid },
            include: Thought,
            plain: true
        })

        if(!user) {
            req.flash('messageError', "Por favor, primeiro faça o login")
            res.redirect('/login')
        }

        const thoughts = user.Thoughts.map(result => result.dataValues)

        let emptyThoughts = false

        if(thoughts.length === 0) {
            emptyThoughts = true
        }

        res.render('thoughts/dashboard', { thoughts, emptyThoughts })
    }

    // adicionar pensamento

    static createThought(req, res) {
        res.render('thoughts/create')
    }

    static async createThoughtSave(req, res) {
        const thought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Thought.create(thought)

            req.flash('messageSucess', "Pensamento criado com sucesso!")

            req.session.save(() => {
                res.redirect('/pensamentos/dashboard')
            })
        } catch(err) {
            console.log(err)
        }
    }

    // remover pensamento 

    static async removeThought(req, res) {
        const id = req.body.id
        const UserId = req.session.userid

        try {
            await Thought.destroy({where: {id: id, UserId: UserId}})

            req.flash("messageSucess", "Pensamento removido com sucesso!")

            req.session.save(() => {
                res.redirect('/pensamentos/dashboard')
            })
        } catch(err) {
            console.log("Erro na remoção do pensamento: " + err)
        }
    }

    // editar pensamento

    static async updateThought(req, res) {
        const id = req.params.id

        const thought = await Thought.findOne({ where: { id: id }, raw: true })

        res.render('thoughts/edit', { thought })
    }

    static async updateThoughtPost(req, res) {
        const { id, title } = req.body

        const thought = {
            title
        }

        try {
            await Thought.update(thought, { where: { id: id } })

            req.flash("messageSucess", "Pensamento atualizado com sucesso!")

            req.session.save(() => {
            res.redirect('/pensamentos/dashboard')
        })
        } catch (error) {
            console.log("Erro na atualização: " + error)
        }
    }
}