const db = require('../config/db');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username || email.split('@')[0], email, password]
        );
        res.status(201).json({ id: result.insertId, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            res.json({ id: rows[0].id, email: rows[0].email, username: rows[0].username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
