
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../db')

const router = express.Router()

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, password } = req.body

    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name, email and password.'
      })
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [normalizedEmail]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [full_name.trim(), normalizedEmail, passwordHash]
    )

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      user: result.rows[0]
    })
  } catch (error) {
    console.error('Registration error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Something went wrong while creating your account.'
    })
  }
})

// Log in an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email and password.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [normalizedEmail]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    )

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Login error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Something went wrong while logging in.'
    })
  }
})

module.exports = router
