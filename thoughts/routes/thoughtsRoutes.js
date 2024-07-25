const express = require('express');
const router = express.Router();

// controller

const ThoughtController = require('../controllers/ThoughtController');

// helper

const checkAuth = require('../helpers/auth').checkAuth;

// home

router.get('/', ThoughtController.showThoughts)

// dashboard

router.get('/dashboard', checkAuth, ThoughtController.dashboard)

// criação do pensamento

router.get('/criar', checkAuth, ThoughtController.createThought)
router.post('/criar', checkAuth, ThoughtController.createThoughtSave)

// remoção do pensamento

router.post('/remove', checkAuth, ThoughtController.removeThought)

// edição do pensamento

router.get('/edit/:id', checkAuth, ThoughtController.updateThought)
router.post('/edit', checkAuth, ThoughtController.updateThoughtPost)

module.exports = router