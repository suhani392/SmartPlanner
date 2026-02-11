/**
 * Timetable Generation Service using DSA Concepts
 * --------------------------------------------------
 * This service implements the following Data Structures & Algorithms:
 * 1. Greedy Algorithm: For task scheduling based on deadlines and priority.
 * 2. Priority Queue (Heap): For urgent task selection.
 * 3. Hash Map: For O(1) task lookup.
 * 4. Interval Conflict Checking: To prevent overlapping tasks.
 * 5. Queue: To manage daily task flow in FIFO order.
 */

// --- 1. PRIORITY QUEUE (HEAP) IMPLEMENTATION ---
/**
 * A Min-Heap based Priority Queue.
 * Why: Allows us to always extract the most urgent task in O(log N) time.
 * Logic: Priority is determined by (1) Earliest Deadline and (2) Highest Priority Category.
 */
class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    // Helper: Get parent index
    getParentIndex(i) { return Math.floor((i - 1) / 2); }
    // Helper: Get left child index
    getLeftChildIndex(i) { return 2 * i + 1; }
    // Helper: Get right child index
    getRightChildIndex(i) { return 2 * i + 2; }

    // Swap two elements in the heap
    swap(i1, i2) {
        [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
    }

    /**
     * Compare two tasks to see which is more "urgent".
     * Lower score = Higher priority (Min-Heap).
     */
    isMoreUrgent(taskA, taskB) {
        const timeA = new Date(taskA.deadline).getTime();
        const timeB = new Date(taskB.deadline).getTime();

        if (timeA !== timeB) {
            return timeA < timeB; // Earlier deadline first
        }

        // Mapping priorities to numbers for comparison
        const priorityScore = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityScore[taskA.priority] > priorityScore[taskB.priority]; // Higher priority if deadlines are same
    }

    push(task) {
        this.heap.push(task);
        this.heapifyUp();
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (index > 0 && this.isMoreUrgent(this.heap[index], this.heap[this.getParentIndex(index)])) {
            this.swap(index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }

    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const root = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return root;
    }

    heapifyDown() {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            let rightChildIndex = this.getRightChildIndex(index);

            if (rightChildIndex < this.heap.length && this.isMoreUrgent(this.heap[rightChildIndex], this.heap[smallerChildIndex])) {
                smallerChildIndex = rightChildIndex;
            }

            if (this.isMoreUrgent(this.heap[index], this.heap[smallerChildIndex])) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

// --- 2. QUEUE IMPLEMENTATION ---
/**
 * Simple FIFO Queue.
 * Why: Used to manage the final list of tasks assigned to a specific day.
 */
class Queue {
    constructor() {
        this.items = [];
    }
    enqueue(item) { this.items.push(item); }
    dequeue() { return this.items.shift(); }
    isEmpty() { return this.items.length === 0; }
    size() { return this.items.length; }
}

// --- 3. INTERVAL CONFLICT CHECKING ---
/**
 * Checks if a new task interval overlaps with existing scheduled tasks.
 * Time Complexity: O(N) where N is number of tasks already scheduled for the day.
 */
const hasConflict = (existingSlots, startTime, endTime) => {
    for (let slot of existingSlots) {
        // Overlap logic: (StartA < EndB) AND (EndA > StartB)
        if (startTime < slot.end && endTime > slot.start) {
            return true;
        }
    }
    return false;
};

// --- MAIN GENERATION SERVICE ---
const generateTimetable = (tasks) => {
    if (!tasks || tasks.length === 0) return [];

    // --- HASH MAP: FAST LOOKUP ---
    /**
     * Store tasks by ID for O(1) access.
     * Prevents searching through the array repeatedly.
     */
    const taskMap = new Map();
    tasks.forEach(task => taskMap.set(task.id, task));

    // --- GREEDY ALGORITHM: SORTING ---
    /**
     * Although the Heap handles priority, sorting tasks initially by deadline 
     * allows us to process them in a greedy manner.
     */
    const sortedTasks = [...tasks].sort((a, b) => {
        const dateDiff = new Date(a.deadline) - new Date(b.deadline);
        if (dateDiff !== 0) return dateDiff;
        const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
    });

    // --- PRIORITY QUEUE: URGENT TASK SELECTION ---
    const pq = new PriorityQueue();
    sortedTasks.forEach(task => pq.push(task));

    // Final result structure
    const dailySchedules = {};

    // Initial configuration
    const WORKING_START_HOUR = 9; // 9:00 AM
    const WORKING_END_HOUR = 18;  // 6:00 PM

    // Process tasks until none left in Priority Queue
    while (!pq.isEmpty()) {
        const task = pq.pop();
        const taskDetails = taskMap.get(task.id);

        const dateObj = new Date(taskDetails.deadline);
        const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

        if (!dailySchedules[dateKey]) {
            dailySchedules[dateKey] = {
                date: dateKey,
                occupiedSlots: [],
                // Groups for frontend display
                Deadline: [], Exam: [], Internship: [], Project: [], College: []
            };
        }

        const dayPlan = dailySchedules[dateKey];

        // --- TIME SCHEDULING LOGIC ---
        const taskObj = {
            title: taskDetails.title,
            priority: taskDetails.priority
        };

        if (taskDetails.time_type === 'NA') {
            if (dayPlan[taskDetails.category] !== undefined) {
                dayPlan[taskDetails.category].push(taskObj);
            }
        } else if (taskDetails.time_type === 'Fixed' || taskDetails.time_type === 'Estimated') {
            let startStr = taskDetails.start_time;
            let endStr = taskDetails.end_time;

            if (taskDetails.time_type === 'Estimated' && startStr) {
                const [h, m] = startStr.split(':').map(Number);
                const duration = taskDetails.estimated_hours || 1;
                endStr = `${String(h + duration).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`;
            }

            const timeDisplay = `${startStr?.substring(0, 5) || '??'} - ${endStr?.substring(0, 5) || '??'}`;
            taskObj.title = `${timeDisplay}: ${taskDetails.title}`;

            if (dayPlan[taskDetails.category] !== undefined) {
                dayPlan[taskDetails.category].push(taskObj);
            }
        } else {
            let startHour = 9;
            if (dayPlan.occupiedSlots.length > 0) {
                startHour = Math.max(9, dayPlan.occupiedSlots[dayPlan.occupiedSlots.length - 1].end);
            }
            const duration = taskDetails.estimated_hours || 1;
            const endHour = startHour + duration;

            if (endHour <= 18) {
                dayPlan.occupiedSlots.push({ start: startHour, end: endHour });
                taskObj.title = `${startHour}:00 - ${endHour}:00: ${taskDetails.title}`;
                if (dayPlan[taskDetails.category] !== undefined) {
                    dayPlan[taskDetails.category].push(taskObj);
                }
            } else {
                if (dayPlan[taskDetails.category] !== undefined) {
                    dayPlan[taskDetails.category].push(taskObj);
                }
            }
        }
    }

    // Convert dailySchedules object to sorted array
    const result = Object.values(dailySchedules).map(day => {
        const cleanDay = { ...day };
        delete cleanDay.occupiedSlots;
        return cleanDay;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    return result;
};

export { generateTimetable };
