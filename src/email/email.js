const sgMail = require("@sendgrid/mail");

const SENDGRID_API_KEY =
  "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";

sgMail.setApiKey(SENDGRID_API_KEY);

const sendEmailtoUser = (email, name) => {
  sgMail.send({
    to: "suyogbhosale12@gmai.com", //email
    from: "suyogbhosale12",
    subject: "welcome to myApp",
    text: `hello ${name} let start learing !!`,
  });
};
const sendDEletaccoint = (email, name) => {
  sgMail.send({
    to: "suyogbhosale12@gmai.com", //email
    from: "suyogbhosale12",
    subject: ` Goood bye ${name}`,
    text: `Hope to see you back ${name} let start learing !!`,
  });
};

module.exports = {
  sendEmailtoUser,
  sendDEletaccoint,
};
