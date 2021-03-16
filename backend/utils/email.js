const nodemailer = require("nodemailer");
const util = require('util');
const emailAddress = 'superuser4058@gmail.com'
module.exports = {
  send: async (receiver, description, title) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailAddress,
        pass: 'admin123!'
      },
      tls: {
        rejectUnauthorized: false
      },
      pool: true
    });

    const mailOptions = {
      from: `E-Money HCMUS <${emailAddress}>`,
      to: receiver,
      subject: title,
      html: description
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  }
}