import { Request, Response } from "express";
import nodemailer, { Transport, TransportOptions} from "nodemailer";
import { createMailOptions } from "../../data/config/emailOptions";
class EmailController {
  /**
   * This function is responsible for sending an email using the nodemailer library and the gmail service
   * It creates a transport object and sets the necessary options for sending the email.
   * The function then sends the email with the provided options and sends a response with a message indicating that the email was sent.
   * @throws Will throw an error if any of the required environment variables (MAIL_HOST, MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_USER, MAIL_PASSWORD) are missing or if any error occurs during the sending of the email.
   */
  async sendMails(req: Request, res: Response) {
    const { name, subject, description } = req.body;
    const sender = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    } as TransportOptions | Transport<unknown> );

    const mailOptions = createMailOptions(name, subject, description)
    await sender.sendMail(mailOptions);
    res.status(200).json({
      message: "Email enviado",
    });
  }
}

export default new EmailController();
