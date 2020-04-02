const nodemailer = require('nodemailer');

async function sendMail(emails, payload) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, 
            port: process.env.SMTP_PORT,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.SMTP_USER, // generated ethereal user
              pass: process.env.SMTP_PASS // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            textEncoding: "quoted-printable",
            headers: {
            "Content-Transfer-Encoding": "quoted-printable"
            },
            from: process.env.SMTP_FROM || 'as.uquip@gmail.com', // sender address
            to: emails.join(), // list of receivers
            subject: payload.subject, // Subject line
            text: payload.text, // plain text body
            html: payload.body // html body
        };
        await transporter.sendMail(mailOptions);
        return 1;
    } catch (error) {
        throw error;
    }
};

function constructMailPayload(username, type, meta) {

    if (type == 'CREATE_USER') {
        let payload_obj = {
            subject: `Document Sharer - OTP [Dont Share this OTP with Anyone]`,
            text: [
              `Dear ${username},`,
              `Greetings from Document Sharer`,
              `your one time passsword for your Account is ${meta.otp.otp}.`,
              `Please Enter this OTP to complete your regestration.`,
              `This OTP valids upto 15 minutes.`,
              `This is Secret, Please Dont share with others.`,
              `Thank You!`
            ].join("\n")
          };
          return payload_obj;
    } else {
        return {};
    }
};

module.exports = {
    sendMail,
    constructMailPayload
};

// "host": "smtp.gmail.com",
// "port": "465",
// "ssl": true,
// "user": "autonest.jas@gmail.com",
// "name": "Autonest",
// "from": "autonest.jas@gmail.com",
// "pass": "esupogu1979"