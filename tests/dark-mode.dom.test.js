/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
let mockStorage = {};
const localStorageMock = {
    getItem: vi.fn((key) => mockStorage[key] || null),
    setItem: vi.fn((key, value) => { mockStorage[key] = value; }),
    removeItem: vi.fn((key) => { delete mockStorage[key]; }),
    clear: vi.fn(() => { mockStorage = {}; })
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Setup DOM elements - creates fresh body each time
function setupDOM() {
    document.body.className = ''; // Clear all classes
    document.body.innerHTML = `<button id="darkModeToggle">🌙</button>`;
}

// Pure logic functions from dark-mode.js
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedMode = localStorage.getItem('darkMode');

    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });
}

describe('Dark Mode - Initialization', () => {
    beforeEach(() => {
        mockStorage = {};
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        localStorageMock.getItem.mockImplementation((key) => mockStorage[key] || null);
        setupDOM();
    });

    it('should start in light mode by default', () => {
        initializeDarkMode();

        expect(document.body.classList.contains('dark-mode')).toBe(false);
        expect(document.getElementById('darkModeToggle').textContent).toBe('🌙');
    });

    it('should restore dark mode from localStorage', () => {
        mockStorage['darkMode'] = 'enabled';

        initializeDarkMode();

        expect(document.body.classList.contains('dark-mode')).toBe(true);
        expect(document.getElementById('darkModeToggle').textContent).toBe('☀️');
    });

    it('should stay in light mode if localStorage says disabled', () => {
        mockStorage['darkMode'] = 'disabled';

        initializeDarkMode();

        expect(document.body.classList.contains('dark-mode')).toBe(false);
    });
});

describe('Dark Mode - Toggle', () => {
    beforeEach(() => {
        mockStorage = {};
        localStorageMock.getItem.mockClear();
        localStorageMock.setItem.mockClear();
        localStorageMock.getItem.mockImplementation((key) => mockStorage[key] || null);
        setupDOM();
        initializeDarkMode();
    });

    it('should enable dark mode on click', () => {
        const toggle = document.getElementById('darkModeToggle');

        toggle.click();

        expect(document.body.classList.contains('dark-mode')).toBe(true);
        expect(toggle.textContent).toBe('☀️');
    });

    it('should disable dark mode on second click', () => {
        const toggle = document.getElementById('darkModeToggle');

        toggle.click(); // Enable
        toggle.click(); // Disable

        expect(document.body.classList.contains('dark-mode')).toBe(false);
        expect(toggle.textContent).toBe('🌙');
    });

    it('should save enabled state to localStorage', () => {
        const toggle = document.getElementById('darkModeToggle');

        toggle.click();

        expect(localStorageMock.setItem).toHaveBeenCalledWith('darkMode', 'enabled');
    });

    it('should save disabled state to localStorage', () => {
        const toggle = document.getElementById('darkModeToggle');

        toggle.click(); // Enable
        toggle.click(); // Disable

        expect(localStorageMock.setItem).toHaveBeenLastCalledWith('darkMode', 'disabled');
    });

    it('should toggle multiple times correctly', () => {
        const toggle = document.getElementById('darkModeToggle');

        toggle.click(); // 1: dark
        expect(document.body.classList.contains('dark-mode')).toBe(true);

        toggle.click(); // 2: light
        expect(document.body.classList.contains('dark-mode')).toBe(false);

        toggle.click(); // 3: dark
        expect(document.body.classList.contains('dark-mode')).toBe(true);

        toggle.click(); // 4: light
        expect(document.body.classList.contains('dark-mode')).toBe(false);
    });
});

describe('Dark Mode - Icon Updates', () => {
    beforeEach(() => {
        mockStorage = {};
        localStorageMock.getItem.mockClear();
        localStorageMock.getItem.mockImplementation((key) => mockStorage[key] || null);
        setupDOM();
        initializeDarkMode();
    });

    it('should show moon icon in light mode', () => {
        expect(document.getElementById('darkModeToggle').textContent).toBe('🌙');
    });

    it('should show sun icon in dark mode', () => {
        document.getElementById('darkModeToggle').click();

        expect(document.getElementById('darkModeToggle').textContent).toBe('☀️');
    });
});
