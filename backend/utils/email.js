const nodemailer = require("nodemailer");

module.exports = {
  send: (receiver, description, title) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'superuser4058@gmail.com',
        pass: 'admin123!'
      },
      tls: {
        rejectUnauthorized: false
      },
      pool: true
    });

    const mailOptions = {
      from: 'NHÓM QUẢN LÝ CHI TIÊU HCMUS',
      to: receiver,
      subject: title,
      html: description
    };

    return transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}