const db = require('../config/db');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const [rows] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username || email.split('@')[0], email, password]
        );
        res.status(201).json({ id: rows[0].id, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (rows.length > 0) {
            res.json({ id: rows[0].id, email: rows[0].email, username: rows[0].username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.syncUser = async (req, res) => {
    const { id, email, username } = req.body;
    try {
        await db.execute(
            'INSERT INTO users (id, email, username) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, email = EXCLUDED.email',
            [id, email, username]
        );
        res.json({ message: 'User synced successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
