
const pool = require('./db')

async function testDatabase() {
  try {
    const result = await pool.query('SELECT NOW()')

    console.log('Database connection successful!')
    console.log('PostgreSQL server time:', result.rows[0].now)
  } catch (error) {
    console.error('Database connection failed:', error.message)
  } finally {
    await pool.end()
  }
}

testDatabase()
