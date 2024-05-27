console.clear();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const homeRoutes = require('./routes/home-routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Servir le dossier public statiquement
app.use(express.static(path.join(__dirname, 'public')));

// Servir le dossier DocsHtml statiquement
app.use('/DocsHtml', express.static(path.join(__dirname, 'DocsHtml')));

app.set('layout', 'layout');
app.set('layout_result', 'layout_result');
app.set('layout_resultnikto', 'layout_resultnikto');
app.use(homeRoutes.routes);

app.listen(5000, () => console.log('App is listening on url http://localhost:5000'));
