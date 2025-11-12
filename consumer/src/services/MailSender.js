import nodemailer from "nodemailer";
import "dotenv/config";

class MailSender {
  constructor() {
    this._transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: "OpenMusic API <no-reply@openmusic.com>",
      to: targetEmail,
      subject: "Ekspor Lagu Playlist",
      text: "Terlampir adalah hasil ekspor lagu dari playlist Anda.",
      attachments: [
        {
          filename: "playlist.json",
          content,
          contentType: "application/json",
        },
      ],
    };

    return this._transport.sendMail(message);
  }
}

export default MailSender;
