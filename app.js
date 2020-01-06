const express = require('express');
const bodyParser = require('body-parser');
const exphndl = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.port || 4000;

// view engine 
app.engine('handlebars', exphndl())
app.set('view engine', 'handlebars')

// static folder 
app.use('/public', express.static(path.join(__dirname, 'public')))
app.locals.layout = false; 

// body parser 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// api
app.get('/', (req, res) => {
    res.render('formdata')
})

app.post('/submit', (req, res) => {
    console.log('abcd ', req.body)
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Hosehold Income: ${req.body.householdIncome}</li>
      <li>First Name: ${req.body.firstName}</li>
      <li>First Name: ${req.body.lastName}</li>
      <li>Minimum Deposit: ${req.body.minimumDeposit}</li>
      <li>Company: ${req.body.company}</li> 
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
      <li>Note: ${req.body.note}</li>
      <li>Status: ${req.body.status}</li>
      <li>Current Rent: ${req.body.range}</li>
      <li>Month: ${req.body.month}</li>
    </ul>
  `;

//   <h3>Message</h3>
//   <p>${req.body.message}</p>

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'apikey', // generated ethereal user
            pass: 'enter your key'  // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: true
    });

    // // setup email data with unicode symbols
    let mailOptions = {
        from: '"Abc Company" <abc@gmail.com>', // sender address
        to: 'abcd@gmail.com', // list of receivers
        subject: 'Abc Company Register Interest', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('abc ',error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
})

app.listen(PORT, () => {
    console.log('server started at....', PORT)
})
