import { Request, Response } from "express";
import nodemailer, { Transporter} from "nodemailer";
import { check, validationResult } from "express-validator";
import { google } from "googleapis";
import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";
dotenv.config();

const OAuth2 = google.auth.OAuth2

interface EmailTypes {
    host: string;
    port: number;
    secure: boolean;
    auth: { user: string; pass: string; }
}


class EmailController {
  async enviarEmails(req: Request, res: Response) {

    const oauth2client = new OAuth2(
        process.env.MAIL_CLIENT_ID,
        process.env.MAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    )

    oauth2client.setCredentials({
        refresh_token: process.env.MAIL_REFRESH_TOKEN
    })

    const accessToken = await new Promise((resolve, reject) => {
        oauth2client.getAccessToken((err, token) => {
          if (err) {
            reject("Failed to create access token :(");
          }
          resolve(token);
        });
    });

    check("name").not().isEmpty();
    check("subject").not().isEmpty();
    check("description").not().isEmpty();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const { name, subject, description } = req.body;

    const sender = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        accessToken: accessToken,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    } as SMTPTransport.Options);

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
