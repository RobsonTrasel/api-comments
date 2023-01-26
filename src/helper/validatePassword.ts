import bcrypt from 'bcrypt'

export const validatePassword = async (password: string, hashedPassword: string): Promise<Boolean> => {
    return await bcrypt.compare(password, hashedPassword)
}