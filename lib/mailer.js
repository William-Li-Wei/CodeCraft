/**
 * Created by william on 28.06.15.
 */
var nodemailer = require("nodemailer");
var config = require("../config");

// create reusable transport method (opens pool of SMTP connections)

module.exports = {
    smtpTransport: nodemailer.createTransport("SMTP",{
        host: "smtp.gmail.com", // hostname
        secureConnection: true, // use SSL
        port: 465,              // port for secure SMTP
        auth: {
            user: config.mail.emailAddress,
            pass: config.mail.emailPassword
        }
    })
};