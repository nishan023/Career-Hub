import { PrismaClient } from "@prisma/client";
import { compare, hash,genSalt } from "bcrypt";
import { AppError } from "../utils/error";
import { createAccessToken, createRefreshToken } from "../utils/token.utils";
import { ILoginBody, ISignupBody, UserJWTPayload } from "../types";

const prisma = new PrismaClient();

///User login
export const login = async (userData:ILoginBody) => {
    const {email,password}=userData;
    const user = await prisma.user.findFirst({
        where: { email },
    })

    if (!user) {
        throw new AppError('User not found', 404)
    }

    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
        throw new AppError('Invalid password', 401)
    }

    const payload: UserJWTPayload = {
        userId: user.id,
        email: user.email,
        isAdmin: false,
    }

    const accessToken = createAccessToken(payload)
    const refreshToken = createRefreshToken(payload)

    return { accessToken, refreshToken }
}

// User signup -
export const signup = async (userData: ISignupBody) => {
    const { email, password, username } = userData;

    const userExists = await prisma.user.findFirst({
        where: { email },
    })

    if (userExists) {
        throw new AppError('User with this email already exists', 409)
    }
    const genSalts= await genSalt(10);
    const hashedPassword = await hash(password, genSalts)

    const newUser = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
        },
    })

    return {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
    }
}

//get user profile
export const getUserProfile = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
        },
    })

    if (!user) {
        throw new AppError('User not found', 404)
    }

    return user
}