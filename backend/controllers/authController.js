import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all the fields' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    })

    const token = generateToken(newUser._id)

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token
    })

  } catch (err) {
    console.log('error in register:', err.message)
    res.status(500).json({ message: 'Something went wrong while registering user' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    })

  } catch (err) {
    console.log('error in login:', err.message)
    res.status(500).json({ message: 'Something went wrong while logging in' })
  }
}