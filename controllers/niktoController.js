const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');


const resultatnikto = (req, res, next) => {
  const url = req.body.url;
  console.log(`URL received: ${url}`);

  exec(`./helpers/scriptnikto.sh ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.status(500).send("Server Error");
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      res.status(500).send("Server Error");
      return;
    }

    console.log(`Script output: ${stdout}`);

    // Vérifiez si le fichier resultatnikto.html existe
    const resultPath = path.resolve(__dirname, "..", "DocsHtml", "resultatnikto.html");
    console.log(`Result file path: ${resultPath}`);

    // Attendre 1 minute avant de vérifier et envoyer le fichier
    
      fs.access(resultPath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error(`File not found: ${resultPath}`);
          res.status(500).send("Result file not found");
        } else {
          res.sendFile(resultPath);
        }
      });
   
  });
};


const generateniktoPdf = async (req, res) => {
  const htmlFilePath = path.join(__dirname, '../DocsHtml/resultatnikto.html');
  const pdfFilePath = path.join(__dirname, '../DocsPdf/nikto.pdf');

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
      res.download(pdfFilePath, 'nikto.pdf', (err) => {
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


const renderSendEmailForme = (req, res) => {
  res.render("SendEmail", { title: "Send Email" });
};


const SendEmail = async (req, res) => {
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
        filename: 'nikto.pdf',
        path: path.join(__dirname, '../DocsPdf/nikto.pdf')
      },
      // {
      //   filename: 'rapport.pdf',
      //   path: path.join(__dirname, '../DocsRapport/rapport.pdf')
      // }
    ]
  };

  try {
    await transporter.SendEmail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
};
module.exports = {
  resultatnikto,
  generateniktoPdf,
  renderSendEmailForme,
  SendEmail,

};
