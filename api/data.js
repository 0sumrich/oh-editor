const { Pool } = require('pg')
const pool = new Pool()

module.exports = async (req, res) =>{
    try {
        const query = pool.query('select * from opening_hours;')
        res.json(res.rows)
    } catch (e) {
        throw e
   } finally {
       await pool.end()
   }
}