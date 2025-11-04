import { insertUser, selectUserByEmail } from '../models/User.js'
import { ApiError } from '../helper/errors.js'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

const { sign } = jwt

const signUp = async (req, res, next) => {
  const { user } = req.body

  if (!user || !user.email || !user.password) {
    return next(new ApiError('Email and password are required', 400))
  }

  try {
    const hashedPassword = await hash(user.password, 10)
    const result = await insertUser(user.email, hashedPassword)

    return res.status(201).json({
      id: result.rows[0].id,
      email: result.rows[0].email
    })
  } catch (error) {
    return next(error)
  }
}

const signIn = async (req, res, next) => {
  const { user } = req.body

  if (!user || !user.email || !user.password) {
    return next(new ApiError('Email and password are required', 400))
  }

  try {
    const result = await selectUserByEmail(user.email)

    if (result.rows.length === 0) {
      return next(new ApiError('User not found', 404))
    }

    const dbUser = result.rows[0]
    const isMatch = await compare(user.password, dbUser.password)

    if (!isMatch) {
      return next(new ApiError('Invalid password', 401))
    }

    const token = sign({ user: dbUser.email }, process.env.JWT_SECRET)

    return res.status(200).json({
      id: dbUser.id,
      email: dbUser.email,
      token
    })
  } catch (error) {
    return next(error)
  }
}

export { signUp, signIn }
