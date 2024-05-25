const express = require('express');
const { homeview, resultatnmap , generatePdf, generateReport, renderSendEmailForm, sendEmail } = require('../controllers/homeController');

const router = express.Router();

// router.get('/', homeview);
router.get('/', homeview,(req, res) => {
    res.render('home', { title: 'Home', layout: 'layout' });
});
// router.post('/result', resultatnmap);
router.post('/result', resultatnmap, (req, res) => {
    res.render('result', { title: 'Result', layout: 'layout_result' });
});
router.get('/generate-pdf', generatePdf);  
router.get('/generateReport', generateReport); 
router.get('/sendEmail', renderSendEmailForm); // Nouvelle route pour rendre le formulaire
router.post('/send-email', sendEmail); // Nouvelle route pour gérer l'envoi d'email


// Route pour Nikto
router.get('/Nikto', (req, res) => {
  res.render('nikto', { title: 'Nikto' });
});
module.exports = {
  routes: router
};