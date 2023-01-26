import { Request, Response } from "express";
import { User } from "../../models/user";
import { generateToken } from '../../helper/generateToken';

class AuthController {
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