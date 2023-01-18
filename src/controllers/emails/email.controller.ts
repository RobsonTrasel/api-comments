import { Request, Response } from "express";
import nodemailer from 'nodemailer'
import { check, validationResult } from "express-validator";
import dotenv from 'dotenv'
import SMTPTransport from "nodemailer/lib/smtp-transport";
dotenv.config()

interface EmailType {

}


class EmailController {
    async enviarEmails(req: Request, res: Response) {
        check('name').not().isEmpty()
        check('subject').not().isEmpty()
        check('description').not().isEmpty()
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            })
        }

        const {
            name, 
            subject,
            description
        } = req.body

        const sender = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                type: 'oauth2',
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.MAIL_CLIENT_ID,
                clientSecret: process.env.MAIL_CLIENT_SECRET,
                accessToken: process.env.MAIL_ACCESS_TOKEN,
                expires: 3600
            }
        } as SMTPTransport.Options)

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: 'robson.trasel@gmail.com',
            subject,
            text: description,
            html: `
            <p> Nome: ${name} </p>
            <p> Assunto: ${subject} </p>
            <p> Descrição: ${description} </p>
            `
        }

        try {
            await sender.sendMail(mailOptions)
            res.status(200).json({
                message: 'Email enviado'
            })
        } catch(err) {
            console.error(err)
            res.status(500).json({
                message: 'Erro ao enviar email'
            })
        }
    }
}

export default new EmailController