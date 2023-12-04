import express from 'express'
import { authentication, random } from '../helpers'
import { prisma } from '../db'

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.sendStatus(400)
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })
    if (!user) {
      return res.sendStatus(400)
    }

    const expectedHash = authentication(user.salt as string, password)
    if (user.password !== expectedHash.toString()) {
      return res.sendStatus(403)
    }

    const salt = random()
    const sessionToken = authentication(salt, user.id.toString())
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        sessionToken: sessionToken.toString(),
      },
    })

    res.cookie('EXPRESS-AUTH', updatedUser.sessionToken, {
      domain: 'localhost',
      path: '/',
    })

    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.sendStatus(400)
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    })
    if (existingUser) {
      return res.sendStatus(400)
    }

    const salt = random()
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: authentication(salt, password).toString(),
        salt,
      },
    })

    return res.status(201).json({
      email: user.email,
      username: user.username,
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
