import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock localStorage with proper reset
let mockStore = {};

const localStorageMock = {
    getItem: (key) => mockStore[key] || null,
    setItem: (key, value) => { mockStore[key] = value; },
    removeItem: (key) => { delete mockStore[key]; },
    clear: () => { mockStore = {}; }
};

// Pure functions extracted from offline-queue.js for testing
const QUEUE_KEY = 'byebyesmoke_offline_queue';

function getQueue() {
    try {
        const data = localStorageMock.getItem(QUEUE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return [];
    }
}

function saveQueue(queue) {
    try {
        localStorageMock.setItem(QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
        console.error('Error saving queue:', error);
    }
}

function addToQueue(operation) {
    const queue = getQueue();
    const item = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...operation
    };
    queue.push(item);
    saveQueue(queue);
    return item.id;
}

function removeFromQueue(id) {
    const queue = getQueue();
    const filtered = queue.filter(item => item.id !== id);
    saveQueue(filtered);
}

function isItemTooOld(timestamp, maxDays = 7) {
    const itemDate = new Date(timestamp);
    const daysDiff = (Date.now() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff > maxDays;
}

describe('Offline Queue - Storage', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should return empty array when queue is empty', () => {
        expect(getQueue()).toEqual([]);
    });

    it('should add item to queue', () => {
        const id = addToQueue({ type: 'test', data: { foo: 'bar' } });

        expect(id).toBeDefined();
        expect(getQueue().length).toBe(1);
    });

    it('should preserve item data', () => {
        addToQueue({ type: 'update_goals', data: { days: 30, money: 100 } });

        const queue = getQueue();
        expect(queue[0].type).toBe('update_goals');
        expect(queue[0].data.days).toBe(30);
        expect(queue[0].data.money).toBe(100);
    });

    it('should add timestamp to items', () => {
        addToQueue({ type: 'test' });

        const queue = getQueue();
        expect(queue[0].timestamp).toBeDefined();
        expect(new Date(queue[0].timestamp)).toBeInstanceOf(Date);
    });

    it('should add unique IDs to items', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));
        const id1 = addToQueue({ type: 'test1' });

        vi.setSystemTime(new Date('2024-06-15T10:00:01'));
        const id2 = addToQueue({ type: 'test2' });
        vi.useRealTimers();

        expect(id1).not.toBe(id2);
    });

    it('should handle multiple items', () => {
        addToQueue({ type: 'item1' });
        addToQueue({ type: 'item2' });
        addToQueue({ type: 'item3' });

        expect(getQueue().length).toBe(3);
    });
});

describe('Offline Queue - Removal', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should remove item by ID', () => {
        const id = addToQueue({ type: 'test' });
        expect(getQueue().length).toBe(1);

        removeFromQueue(id);
        expect(getQueue().length).toBe(0);
    });

    it('should only remove specified item', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));
        const id1 = addToQueue({ type: 'item1' });

        vi.setSystemTime(new Date('2024-06-15T10:00:01'));
        addToQueue({ type: 'item2' });
        vi.useRealTimers();

        removeFromQueue(id1);

        const queue = getQueue();
        expect(queue.length).toBe(1);
        expect(queue[0].type).toBe('item2');
    });

    it('should handle removing non-existent ID', () => {
        addToQueue({ type: 'test' });

        removeFromQueue('non-existent-id');

        expect(getQueue().length).toBe(1);
    });
});

describe('Offline Queue - Age Check', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should not flag recent items as too old', () => {
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));
        const timestamp = new Date().toISOString();

        vi.setSystemTime(new Date('2024-06-16T10:00:00')); // 1 day later
        expect(isItemTooOld(timestamp)).toBe(false);
    });

    it('should flag items older than 7 days', () => {
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));
        const timestamp = new Date().toISOString();

        vi.setSystemTime(new Date('2024-06-23T10:00:00')); // 8 days later
        expect(isItemTooOld(timestamp)).toBe(true);
    });

    it('should not flag items at exactly 7 days', () => {
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));
        const timestamp = new Date().toISOString();

        vi.setSystemTime(new Date('2024-06-22T10:00:00')); // Exactly 7 days
        expect(isItemTooOld(timestamp)).toBe(false);
    });

    it('should respect custom max days parameter', () => {
        vi.setSystemTime(new Date('2024-06-15T10:00:00'));
        const timestamp = new Date().toISOString();

        vi.setSystemTime(new Date('2024-06-18T10:00:00')); // 3 days later
        expect(isItemTooOld(timestamp, 2)).toBe(true);
        expect(isItemTooOld(timestamp, 5)).toBe(false);
    });
});

describe('Offline Queue - Item Types', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should store update_goals type', () => {
        addToQueue({
            type: 'update_goals',
            data: { days: 30, money: 100 }
        });

        const queue = getQueue();
        expect(queue[0].type).toBe('update_goals');
    });

    it('should store record_craving type', () => {
        addToQueue({
            type: 'record_craving',
            data: { date: '2024-06-15', hour: 10, dayOfWeek: 6 }
        });

        const queue = getQueue();
        expect(queue[0].type).toBe('record_craving');
        expect(queue[0].data.date).toBe('2024-06-15');
        expect(queue[0].data.hour).toBe(10);
    });

    it('should store update_settings type', () => {
        addToQueue({
            type: 'update_settings',
            data: { notification_enabled: true }
        });

        const queue = getQueue();
        expect(queue[0].type).toBe('update_settings');
    });
});

describe('Offline Queue - Error Handling', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should return empty array on parse error', () => {
        // Directly set invalid JSON in the mock store
        mockStore[QUEUE_KEY] = 'invalid json{{{';

        expect(getQueue()).toEqual([]);
    });

    it('should handle null/empty localStorage value', () => {
        // Empty store returns null from getItem
        expect(getQueue()).toEqual([]);
    });
});
