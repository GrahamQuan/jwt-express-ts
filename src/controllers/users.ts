import express from 'express'
import { prisma } from '../db'

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const usersList = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
      },
    })

    return res.status(200).json(usersList)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!id || !username) {
      return res.sendStatus(400)
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        username,
      },
    })

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    })

    // expire cookie
    res.cookie('EXPRESS-AUTH', '', { expires: new Date(0) })

    return res.sendStatus(200)
  } catch (error) {
    console.log(error)
    return res.sendStatus(400)
  }
}
