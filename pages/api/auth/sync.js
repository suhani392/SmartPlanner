import { supabase } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id, email, username } = req.body;

    try {
        const { data, error } = await supabase
            .from('users')
            .upsert({ id, email, username }, { onConflict: 'id' });

        if (error) throw error;

        return res.status(200).json({ message: 'User synced successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
