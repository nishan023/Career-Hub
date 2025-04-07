import { PrismaClient } from '@prisma/client'
import { compare, hash } from 'bcrypt'
import { AppError } from '../utils/error'
import { createAccessToken, createRefreshToken } from '../utils/token.utils'
import { ILoginBody, ISignupBody, UserJWTPayload } from '../types'

const prisma = new PrismaClient()
//Admin login
export const login = async (userData:ILoginBody) => {
    const {email,password}=userData;
    const admin = await prisma.admin.findFirst({
        where: { email },
    })

    if (!admin) {
        throw new AppError('Admin not found', 404)
    }

    const isPasswordValid = await compare(password, admin.password)
    if (!isPasswordValid) {
        throw new AppError('Invalid password', 401)
    }

    const payload: UserJWTPayload = {
        userId: admin.id,
        email: admin.email,
        isAdmin: true,
    }

    const accessToken = createAccessToken(payload)
    const refreshToken = createRefreshToken(payload)

    return { accessToken, refreshToken }
}

// Admin signup - 
export const signup = async (adminData: ISignupBody) => {
    const { email, password, username } = adminData

    const adminExists = await prisma.admin.findFirst({
        where: { email },
    })

    if (adminExists) {
        throw new AppError('Admin with this email already exists', 409)
    }

    const hashedPassword = await hash(password, 10)

    const newAdmin = await prisma.admin.create({
        data: {
            email,
            userName: username,
            password: hashedPassword,
        },
    })

    return {
        id: newAdmin.id,
        email: newAdmin.email,
        userName: newAdmin.userName
    }
}