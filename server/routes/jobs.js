
const express = require('express')
const router = express.Router()

// Temporary test vacancies
const jobs = [
  {
    id: 1,
    title: 'Junior Software Developer',
    company: 'Example Technology',
    location: 'Pretoria, Gauteng',
    type: 'Full-time',
    category: 'Entry-level',
    experience: 'No experience required',
    description: 'An opportunity for an aspiring software developer.',
    source: 'KAZI test data',
    applyUrl: null
  },
  {
    id: 2,
    title: 'IT Support Intern',
    company: 'Example Digital',
    location: 'Johannesburg, Gauteng',
    type: 'Internship',
    category: 'Internship',
    experience: 'No experience required',
    description: 'Gain practical experience in IT support.',
    source: 'KAZI test data',
    applyUrl: null
  },
  {
    id: 3,
    title: 'Graduate Trainee',
    company: 'Example Business Group',
    location: 'Cape Town, Western Cape',
    type: 'Graduate Programme',
    category: 'Graduate',
    experience: 'Graduate opportunity',
    description: 'Develop your professional skills through a graduate programme.',
    source: 'KAZI test data',
    applyUrl: null
  }
]

// Get all jobs
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: jobs.length,
    jobs
  })
})

module.exports = router
