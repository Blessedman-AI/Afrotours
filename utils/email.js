const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const textVersion = require('textVersionJs');
// const testAccount = nodemailer.createTestAccount();
const dotenv = require('dotenv');
const { token } = require('morgan');
dotenv.config();

// new Email(user, url).sendWelcome()
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Blessedman Igbedion <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // const testAccount = await nodemailer.createTestAccount();

    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        host: process.env.MAILJET_HOST,
        port: process.env.MAILJET_PORT,
        secure: false,
        auth: {
          user: process.env.MAILJET_USER,
          pass: process.env.MAILJET_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      debug: true,
    });
  }
  //Send the actual email
  async send(template, subject) {
    //1)Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //2) Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: textVersion(html),
    };

    //3) Create a transport and send email
    // const sendNow = await this.newTransport();
    // await sendNow.sendMail(mailOptions);
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10  minutes)',
    );
  }
};

// const sendEmail = async (options) => {
//   try {
//     // Testing Account
//     // const testAccount = await nodemailer.createTestAccount();

//     //2 Define the email options

//     return await new Promise((resolve, reject) => {
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log('Error:', error);
//           reject(error);
//         } else {
//           resolve(info);
//         }
//       });
//     });
//   } catch (err) {
//     throw err; // Throw the error to be caught in the calling code
//   }
// };

// module.exports = sendEmail;

// const sendEmail = async (options) => {
//   //Testing Account
//   const testAccount = await nodemailer.createTestAccount();

//   // 1) Create  transporter
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false,
//     auth: {
//       user: testAccount.user,
//       pass: testAccount.pass,
//       // user: 'mediaklick71@gmail.com',
//       // pass: 'dY67%kH23',
//     },
//   });

//   const mailOptions = {
//     from: '"Fred Foo 👻" <foo@example.com>',
//     to: 'bar@example.com, baz@example.com',
//     subject: options.subject,
//     text: options.message,
//   };

//   // const transporter = nodemailer.createTransport({
//   //   host: process.env.EMAIL_HOST,
//   //   port: process.env.EMAIL_PORT,
//   //   auth: {
//   //     user: process.env.EMAIL_USERNAME,
//   //     pass: process.env.EMAIL_PASSWORD,
//   //   },
//   // });

//   // //3) Actually send the email
//   // await transporter.sendMail(mailOptions);

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error:', error);
//     } else {
//       console.log('Email sent:', info.response);
//       console.log('Message ID:', info.messageId);
//       console.log('Preview:', nodemailer.getTestMessageUrl(info));
//     }
//   });
// };

// module.exports = sendEmail;
