const exec = require('child_process').exec; // Assuming you're using child_process
const path = require("path");
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { JSDOM } = require('jsdom');
const { parseStringPromise } = require('xml2js');

const homeview = (req, res, next) => {
  res.render("home", { title: "Home" });
};



const resultatnmap = (req, res, next) => {
  const url = req.body.url;

  exec(`./helpers/script.sh ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      res.status(500).send("Error scanning host. Check server logs for details.");
      return;
    }

    if (stderr) {
      console.error(`Nmap error output: ${stderr}`);
      res.status(500).send("Error during Nmap scan. Check server logs for details.");
      return;
    }

    console.log(`Script output: ${stdout}`);
    res.render("result", { title: "Scan Result" }); // Assuming you have a "result.ejs" or similar template
  });
};
const generatePdf = async (req, res) => {
  const htmlFilePath = path.join(__dirname, '../DocsHtml/resultat.html');
  const pdfFilePath = path.join(__dirname, '../DocsPdf/nmap.pdf');

  try {
      const browser = await puppeteer.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      const page = await browser.newPage();
      
      // Chargement du fichier HTML
      await page.goto(`file://${htmlFilePath}`, { waitUntil: 'networkidle0' });
      
      // Génération du PDF
      await page.pdf({ path: pdfFilePath, format: 'A4' });

      await browser.close();
      
      // Envoi du fichier PDF en réponse
      res.download(pdfFilePath, 'nmap.pdf', (err) => {
          if (err) {
              console.error('Error downloading the PDF:', err);
              res.status(500).send('Error generating PDF');
          }
      });
  } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
  }
};

 const  generateReport = async (req, res) => {
  try {
    // Lire le fichier XML
    const xmlData = fs.readFileSync('./DocsXml/resultat.xml', 'utf8');
    const xmlDoc = await parseStringPromise(xmlData);

    // Extraire les données du fichier XML
    const startstr = xmlDoc.nmaprun.$.startstr;
    const addr = xmlDoc.nmaprun.host[0].address[0].$.addr;
    const name = xmlDoc.nmaprun.host[0].hostnames[0].hostname[0].$.name;
    const protocol = xmlDoc.nmaprun.host[0].ports[0].port[0].$.protocol;
    const portid = xmlDoc.nmaprun.host[0].ports[0].port[0].$.portid;
    const protocol1 = xmlDoc.nmaprun.host[0].ports[0].port[1].$.protocol;
    const portid1 = xmlDoc.nmaprun.host[0].ports[0].port[1].$.portid;
    const state = xmlDoc.nmaprun.host[0].ports[0].port[0].state[0].$.state;

    // Lire le modèle HTML
    const templateHtml = fs.readFileSync(path.resolve(__dirname, '../views/template.html'), 'utf8');
    
    // Utiliser JSDOM pour manipuler le HTML
    const dom = new JSDOM(templateHtml);
    const document = dom.window.document;

    // Injecter les données dans le HTML
    document.querySelectorAll('.time').forEach(el => el.textContent = startstr);
    document.querySelectorAll('.adresse').forEach(el => el.textContent = addr);
    document.querySelectorAll('.nomHote').forEach(el => el.textContent = name);
    document.querySelectorAll('.protocole').forEach(el => el.textContent = protocol);
    document.querySelectorAll('.port').forEach(el => el.textContent = portid);
    document.querySelectorAll('.protocole1').forEach(el => el.textContent = protocol1);
    document.querySelectorAll('.port1').forEach(el => el.textContent = portid1);
    document.querySelectorAll('.etatPort').forEach(el => el.textContent = state);

    // Convertir le HTML modifié en PDF avec Puppeteer
    const updatedHtml = dom.serialize();
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(updatedHtml);

    const options = {
      path: './DocsRapport/rapport.pdf', // Chemin de sortie du PDF
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '2mm',
        right: '2mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <style>
          .header {
            font-size: 12px;
            width: 100%;
            text-align: center;
            margin: 0 auto;
            padding: 5px 0;
          }
          .header table {
            width: 100%;
          }
        </style>
        <div class="header">
          <table>
            <tr>
              <td style="text-align: left;">Dabbaghi Walid</td>
              <td style="text-align: right;">Vulnerability Scan Report</td>
            </tr>
          </table>
        </div>`,
      footerTemplate: `
        <style>
          .footer {
            font-size: 10px;
            width: 100%;
            text-align: center;
            padding: 5px 0;
          }
        </style>
        <div class="footer">
          <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>`,
      printBackground: true
    };

    await page.pdf(options);
    await browser.close();
    console.log('Le rapport a été généré avec succès en tant que rapport.pdf');

    const pdfFilePath = path.resolve(__dirname, '../DocsRapport/rapport.pdf');
    res.sendFile(pdfFilePath);
  } catch (error) { 
    console.error('Erreur lors de la génération du rapport:', error);
    res.status(500).send('Erreur lors de la génération du rapport');
  }
};

const renderSendEmailForm = (req, res) => {
  res.render("sendEmail", { title: "Send Email" });
};


const sendEmail = async (req, res) => {
  const email = req.body.email;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
        auth: {
          user: 'dabbaghi.walid1@gmail.com', // Remplacez par votre adresse email Gmail
          pass: 'izsm ytap wocy uzmq' // Remplacez par votre mot de passe Gmail
        }
  });

  const mailOptions = {
    from: 'dabbaghi.walid1@gmail.com',
    to: email,
    subject: 'Vulnerability Scan Reports',
    text: 'Please find the attached vulnerability scan reports.',
    attachments: [
      {
        filename: 'nmap.pdf',
        path: path.join(__dirname, '../DocsPdf/nmap.pdf')
      },
      {
        filename: 'rapport.pdf',
        path: path.join(__dirname, '../DocsRapport/rapport.pdf')
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
};
module.exports = {
  homeview,
  resultatnmap,
  generatePdf,
  generateReport,
  renderSendEmailForm,
  sendEmail,

};
