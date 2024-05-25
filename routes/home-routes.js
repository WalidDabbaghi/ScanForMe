const express = require('express');
const { homeview, resultatnmap } = require('../controllers/homeController');

const router = express.Router();


router.get('/', homeview, (req, res) => {
    res.render('home', { title: 'Home', layout: 'layout' });
});

router.post('/result', resultatnmap,(req, res) => {
    res.render('result', { title: 'Result', layout: 'layout_result' });
});
module.exports = {
  routes: router
};