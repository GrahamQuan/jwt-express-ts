import express from 'express'
import { get, merge } from 'lodash'
import { prisma } from '../db'

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies['EXPRESS-AUTH']
    if (!sessionToken) {
      return res.sendStatus(403)
    }

    const expirationTime = new Date(sessionToken.expires)
    if (expirationTime > new Date()) {
      return res.sendStatus(403)
    }

    const user = await prisma.user.findFirst({
      where: {
        sessionToken,
      },
    })

    if (!user) {
      return res.sendStatus(400)
    }

    merge(req, { identity: user })

    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params
    const currentUserId = get(req, 'identity.id') as unknown as string

    if (!currentUserId) {
      return res.sendStatus(400)
    }

    if (currentUserId.toString() !== id) {
      return res.sendStatus(403)
    }

    next()
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
