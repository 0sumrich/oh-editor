const { Pool } = require('pg')

module.exports = async (req, res) =>{
    try {
        const pool = new Pool()
        const query = pool.query('select * from opening_hours;')
        res.json(query.rows)
    } catch (e) {
        throw e
   }
}