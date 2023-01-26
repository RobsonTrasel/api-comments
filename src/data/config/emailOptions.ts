export const createMailOptions = (name: string, subject: string, description: string) => {
    return {
        from: process.env.MAIL_USER,
        to: "robson.trasel@gmail.com",
        subject,
        text: description,
        html: `
            <p> Nome: ${name} </p>
            <p> Assunto: ${subject} </p>
            <p> Descrição: ${description} </p>
        `
    }
}