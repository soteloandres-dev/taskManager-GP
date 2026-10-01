import pool from '../config/db.ts'

try {
    const result = await pool.query(
        'SELECT current_database() AS database, current_user AS user, NOW() AS current_time'
    )

    console.log(result.rows[0])
} catch (error) {
    console.error('Database connection failed:', error)
} finally {
    await pool.end()
}