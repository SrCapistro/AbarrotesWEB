const nodemailer = require('nodemailer');




transporter.verify().then(()=>{
    console.log('Ready for send emails');
})
