import { Request, Response } from "express";
import { User } from "../../models/user";
import { generateToken } from '../../helper/generateToken';

class AuthController {
    /**
     * @function login - Auth the user in dashboard admin
     * @async
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @description This function handles the login process for a user. It takes in the email and password from the request body, and attempts to find a user with those credentials. If a user is found, it generates a JSON Web Token (JWT) with the user's ID and sends it back as the response. If no user is found, it sends a 401 Unauthorized response with an error message.
     */
    async login(req: Request, res: Response) {
        const { email, password } = req.body
        const user = await User.findByEmailAndPassword(email, password)

        if(!user) {
            return res.status(401).json({ error: 'Credencias invalidas' });
        }

        const token = generateToken(user.id)
        return res.status(200).json({
            token
        })
    }
}

export default new AuthController()