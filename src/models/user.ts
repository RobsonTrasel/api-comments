import client from "../data/connections/database.config";
import { validatePassword } from '../helper/validatePassword';

export class User {
    static async findByEmail(email: string) {
        const result = await client.query(`SELECT * FROM users WHERE email = '${email}'`)    
        return result.rows[0]
    }

    static async findByEmailAndPassword(email: string, password: string) {
        const user = await User.findByEmail(email)
        if(!user) return null

        const isPasswordValid = await validatePassword(password, user.password)

        return user
    }

}