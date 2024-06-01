const express = require('express');
const { homeview, resultatnmap , generatePdf, generateReport, renderSendEmailForm, sendEmail } = require('../controllers/homeController');
const {homevieww,resultatnikto, generateniktoPdf, renderSendEEmailForm, sendEmailnikto}= require('../controllers/niktoController');
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

router.get('/Nikto',homevieww,(req, res) => {
  res.render('nikto', { title: 'nikto' , layout: 'layout' });
});

// router.get('/nikto', homevieww,(req, res) => {
//   res.render('home', { title: 'Home', layout: 'layout' });
// });

router.post('/RsultNikto', resultatnikto, (req, res) => {
  res.render('/resultnikto', { title: 'nikto' , layout: 'layout_resultnikto' });
  // res.render('resultnikto', { title: 'Nikto Scan Result', layout: 'layout_resultnikto' });
});

router.get('/generatenikto-pdf', generateniktoPdf);  
// router.get('/generateReportnikto', generateReportnikto); 
router.get('/sendEmailnikto', renderSendEEmailForm); // Nouvelle route pour rendre le formulaire
router.post('/send-emaill', sendEmailnikto); // Nouvelle route pour gérer l'envoi d'email

module.exports = {
  routes: router
};