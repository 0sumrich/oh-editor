const { Pool } = require('pg')

module.exports = async (req, res) => {
    const pool = new Pool()
    const text = 'INSERT INTO opening_hours(day, finish, library, opening_type, start, updated) VALUES($1, $2, $3, $4, $5, CURRENT_DATE)'
    for (const { day, finish, library, opening_type, start } of req.body) {
        const values = [day, finish, library, opening_type, start]
        const query = { text, values }
        try {
            await pool.query(query)
        } catch (e) {
            console.log(e)
        }
    }
    await pool.end()
    res.json({ status: 'ok', added: req.body.length })
}