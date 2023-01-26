import { Request, Response } from "express";
import nodemailer, { Transport, TransportOptions} from "nodemailer";
import { google } from "googleapis";

const oauth2client = new google.auth.OAuth2(
  process.env.MAIL_CLIENT_ID,
  process.env.MAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
)

oauth2client.setCredentials({
  refresh_token: process.env.MAIL_REFRESH_TOKEN
})

class EmailController {
  /**
   * @function sendMails - Send email method
   * @async
   * @param {Request} req - Express request object
   * @param {Response} req - Express response object
   * @description This function is responsible for sending an email using the nodemailer library and the gmail service
   * It gets the access token from the oauth2client object, creates a transport object and sets the necessary options   for sending the email.
   * The function then sends the email with the provided options and sends a response with a message indicating that the email was sent.
   * @throws Will throw an error if any of the required environment variables (MAIL_HOST, MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_USER, MAIL_PASSWORD) are missing or if any error occurs during the sending of the email.
   */
  async sendMails(req: Request, res: Response) {
    const accessToken = await oauth2client.getAccessToken()

    const { name, subject, description } = req.body;
    const sender = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        accessToken,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      }
    } as TransportOptions | Transport<unknown> );

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: "robson.trasel@gmail.com",
      subject,
      text: description,
      html: `
            <p> Nome: ${name} </p>
            <p> Assunto: ${subject} </p>
            <p> Descrição: ${description} </p>
            `,
    };
    await sender.sendMail(mailOptions);
    res.status(200).json({
      message: "Email enviado",
    });
  }
}

export default new EmailController();
