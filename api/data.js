const { Pool } = require('pg')

module.exports = async (req, res) =>{
    try {
        const pool = new Pool()
        const query = pool.query('select * from opening_hours;')
        res.json(res.rows)
    } catch (e) {
        throw e
   } finally {
       await pool.end()
   }
}