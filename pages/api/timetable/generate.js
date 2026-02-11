import { getServiceSupabase } from '../../../lib/supabaseClient';
import { generateTimetable } from '../../../lib/timetableService';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    const supabaseService = getServiceSupabase();

    try {
        // 1. Fetch user tasks
        const { data: tasks, error: fetchError } = await supabaseService
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .neq('status', 'Completed');

        if (fetchError) throw fetchError;

        // 2. Generate timetable data grouped by day
        const groupedData = generateTimetable(tasks);

        // 3. Save to database (Overwrites previous plan)
        const jsonData = JSON.stringify(groupedData);

        const { data: existingPlan } = await supabaseService
            .from('generated_plans')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (existingPlan) {
            await supabaseService
                .from('generated_plans')
                .update({ plan_data: jsonData })
                .eq('id', existingPlan.id);
        } else {
            await supabaseService
                .from('generated_plans')
                .insert({ user_id: userId, plan_data: jsonData });
        }

        return res.status(200).json({
            user_id: userId,
            slots: groupedData
        });
    } catch (error) {
        console.error("[API ERROR]", error);
        return res.status(500).json({ error: error.message });
    }
}
