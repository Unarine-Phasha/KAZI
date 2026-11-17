
const express = require('express')
const router = express.Router()
const pool = require('../db')
const authenticateToken = require('../middleware/auth')

// Get the logged-in user's profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.user.userId]
    )

    res.json({
      success: true,
      profile: result.rows[0] || null
    })
  } catch (error) {
    console.error('Profile retrieval error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve your profile.'
    })
  }
})

// Create or update the logged-in user's profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const {
      phone,
      province,
      city,
      highest_qualification,
      field_of_study,
      skills,
      experience_level
    } = req.body

    const result = await pool.query(
      `INSERT INTO user_profiles (
        user_id,
        phone,
        province,
        city,
        highest_qualification,
        field_of_study,
        skills,
        experience_level,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id)
      DO UPDATE SET
        phone = EXCLUDED.phone,
        province = EXCLUDED.province,
        city = EXCLUDED.city,
        highest_qualification = EXCLUDED.highest_qualification,
        field_of_study = EXCLUDED.field_of_study,
        skills = EXCLUDED.skills,
        experience_level = EXCLUDED.experience_level,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        req.user.userId,
        phone || null,
        province || null,
        city || null,
        highest_qualification || null,
        field_of_study || null,
        skills || null,
        experience_level || null
      ]
    )

    res.json({
      success: true,
      message: 'Profile saved successfully.',
      profile: result.rows[0]
    })
  } catch (error) {
    console.error('Profile update error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to save your profile.'
    })
  }
})

module.exports = router
