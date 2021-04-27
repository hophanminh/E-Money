const nodemailer = require("nodemailer");
const util = require('util');
const config = require("../config/default.json");

module.exports = {
  send: async (receiver, description, title) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.EMAIL.EMAIL,
        pass: config.EMAIL.PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      pool: true
    });

    const mailOptions = {
      from: `E-Money HCMUS <${config.EMAIL.EMAIL}>`,
      to: receiver,
      subject: title,
      html: description
    };

    const result = await transporter.sendMail(mailOptions);

    return result;
  }
}