import { pool } from '../helper/db.js'

const insertUser = (email, hashedPassword) =>
  pool.query(
    'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
    [email, hashedPassword]
  )

const selectUserByEmail = (email) =>
  pool.query('SELECT * FROM account WHERE email = $1', [email])

export { insertUser, selectUserByEmail }
