import { pool } from '../helper/db.js'
import { auth } from '../helper/auth.js'
import { Router } from 'express'

const router = Router()

router.get('/', (req, res, next) => {
    pool.query('SELECT * FROM task', (err, result) => {
        if (err) {
            return next (err)
        }
        res.status(200).json(result.rows || [])
    })
})

router.post('/create', auth, (req, res, next) => {
    const { task } = req.body

    if (!task) return res.status(400).json({ error: 'Task is required' })

    pool.query(
        'INSERT INTO task (description) VALUES ($1) RETURNING *',
        [task],
        (err, result) => {
            if (err) return next(err)
            res.status(201).json(result.rows[0])
        }
    )
})

router.delete('/delete/:id', auth, (req, res, next) => {
    const { id } = req.params

    pool.query('delete from task WHERE id = $1',
        [id],
        (err, result) => {
        if (err) {
            return next (err)
        }
        if (result.rowCount === 0) {
            const error = new Error('Task not found')
            error.status = 404
            return next(error)
        }
        return res.status(200).json({id:id})
    })
})

export default router