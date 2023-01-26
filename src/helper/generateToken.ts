import jwt from 'jsonwebtoken'

export const generateToken = (userId: number) => {
    if(process.env.JWT_SECRET)
    return jwt.sign({ userId }, process.env.JWT_SECRET , { expiresIn: '1d'})
}