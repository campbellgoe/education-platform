

import { createTransport } from "nodemailer";

export const makeForwardEmailNetTransporter = (user: string = "", pass: string = "") => createTransport({
  // host: 'smtp.forwardemail.net',
  // port: 465,
  // secure: true,
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user,
    pass
  }
});