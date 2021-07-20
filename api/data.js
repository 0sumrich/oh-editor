const { Pool } = require('pg')

module.exports = async (req, res) =>{
    try {
        const pool = new Pool()
        const query = await pool.query('select * from opening_hours;')
        await pool.end()
        res.json(query.rows)
    } catch (e) {
        throw e
   }
}