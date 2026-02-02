const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Helper to mimic mysql2's [rows] destructuring for SELECT queries
// Note: This only works for queries that return rows. 
// For INSERT/UPDATE, pg returns a result object.
module.exports = {
    execute: async (text, params) => {
        const res = await pool.query(text, params);
        // If it's an INSERT/UPDATE/DELETE, we might need different return values
        // but to minimize controller changes, we'll return [res.rows, res]
        return [res.rows, res];
    },
    query: (text, params) => pool.query(text, params)
};
