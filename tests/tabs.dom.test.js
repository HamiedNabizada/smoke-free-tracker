/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const TAB_ORDER = ['overview', 'milestones', 'achievements', 'statistics', 'help'];

// Setup DOM
function setupDOM() {
    document.body.innerHTML = `
        <div id="dashboard">
            <nav class="tabs">
                <button class="tab-button active" data-tab="overview" aria-selected="true">Übersicht</button>
                <button class="tab-button" data-tab="milestones" aria-selected="false">Meilensteine</button>
                <button class="tab-button" data-tab="achievements" aria-selected="false">Erfolge</button>
                <button class="tab-button" data-tab="statistics" aria-selected="false">Statistik</button>
                <button class="tab-button" data-tab="help" aria-selected="false">SOS</button>
            </nav>
            <div class="tab-panel active" data-panel="overview">Overview Content</div>
            <div class="tab-panel" data-panel="milestones">Milestones Content</div>
            <div class="tab-panel" data-panel="achievements">Achievements Content</div>
            <div class="tab-panel" data-panel="statistics">Statistics Content</div>
            <div class="tab-panel" data-panel="help">Help Content</div>
        </div>
    `;
}

// Simplified tab initialization for testing
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            tabPanels.forEach(panel => panel.classList.remove('active'));

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const targetPanel = document.querySelector(`[data-panel="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });

        button.addEventListener('keydown', (e) => {
            let newIndex;
            const currentIndex = TAB_ORDER.indexOf(button.dataset.tab);

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                newIndex = (currentIndex + 1) % TAB_ORDER.length;
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                newIndex = (currentIndex - 1 + TAB_ORDER.length) % TAB_ORDER.length;
            } else if (e.key === 'Home') {
                e.preventDefault();
                newIndex = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                newIndex = TAB_ORDER.length - 1;
            }

            if (newIndex !== undefined) {
                const newButton = document.querySelector(`.tab-button[data-tab="${TAB_ORDER[newIndex]}"]`);
                if (newButton) {
                    newButton.focus();
                    newButton.click();
                }
            }
        });
    });
}

describe('Tabs - Initialization', () => {
    beforeEach(() => {
        setupDOM();
        initializeTabs();
    });

    it('should have overview tab active by default', () => {
        const overviewButton = document.querySelector('[data-tab="overview"]');
        expect(overviewButton.classList.contains('active')).toBe(true);
    });

    it('should have overview panel visible by default', () => {
        const overviewPanel = document.querySelector('[data-panel="overview"]');
        expect(overviewPanel.classList.contains('active')).toBe(true);
    });

    it('should have 5 tabs', () => {
        const tabs = document.querySelectorAll('.tab-button');
        expect(tabs.length).toBe(5);
    });

    it('should have 5 panels', () => {
        const panels = document.querySelectorAll('.tab-panel');
        expect(panels.length).toBe(5);
    });
});

describe('Tabs - Click Navigation', () => {
    beforeEach(() => {
        setupDOM();
        initializeTabs();
    });

    it('should switch to milestones tab on click', () => {
        const milestonesButton = document.querySelector('[data-tab="milestones"]');
        milestonesButton.click();

        expect(milestonesButton.classList.contains('active')).toBe(true);
        expect(document.querySelector('[data-panel="milestones"]').classList.contains('active')).toBe(true);
    });

    it('should deactivate previous tab on switch', () => {
        const overviewButton = document.querySelector('[data-tab="overview"]');
        const milestonesButton = document.querySelector('[data-tab="milestones"]');

        milestonesButton.click();

        expect(overviewButton.classList.contains('active')).toBe(false);
        expect(document.querySelector('[data-panel="overview"]').classList.contains('active')).toBe(false);
    });

    it('should update aria-selected attribute', () => {
        const overviewButton = document.querySelector('[data-tab="overview"]');
        const milestonesButton = document.querySelector('[data-tab="milestones"]');

        milestonesButton.click();

        expect(overviewButton.getAttribute('aria-selected')).toBe('false');
        expect(milestonesButton.getAttribute('aria-selected')).toBe('true');
    });

    it('should switch through all tabs correctly', () => {
        TAB_ORDER.forEach(tabName => {
            const button = document.querySelector(`[data-tab="${tabName}"]`);
            button.click();

            expect(button.classList.contains('active')).toBe(true);
            expect(document.querySelector(`[data-panel="${tabName}"]`).classList.contains('active')).toBe(true);
        });
    });
});

describe('Tabs - Keyboard Navigation', () => {
    beforeEach(() => {
        setupDOM();
        initializeTabs();
    });

    it('should navigate to next tab with ArrowRight', () => {
        const overviewButton = document.querySelector('[data-tab="overview"]');
        overviewButton.focus();

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
        overviewButton.dispatchEvent(event);

        const milestonesButton = document.querySelector('[data-tab="milestones"]');
        expect(milestonesButton.classList.contains('active')).toBe(true);
    });

    it('should navigate to previous tab with ArrowLeft', () => {
        const milestonesButton = document.querySelector('[data-tab="milestones"]');
        milestonesButton.click();
        milestonesButton.focus();

        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
        milestonesButton.dispatchEvent(event);

        const overviewButton = document.querySelector('[data-tab="overview"]');
        expect(overviewButton.classList.contains('active')).toBe(true);
    });

    it('should wrap around from last to first tab', () => {
        const helpButton = document.querySelector('[data-tab="help"]');
        helpButton.click();
        helpButton.focus();

        const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
        helpButton.dispatchEvent(event);

        const overviewButton = document.querySelector('[data-tab="overview"]');
        expect(overviewButton.classList.contains('active')).toBe(true);
    });

    it('should wrap around from first to last tab', () => {
        const overviewButton = document.querySelector('[data-tab="overview"]');
        overviewButton.focus();

        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
        overviewButton.dispatchEvent(event);

        const helpButton = document.querySelector('[data-tab="help"]');
        expect(helpButton.classList.contains('active')).toBe(true);
    });

    it('should go to first tab with Home key', () => {
        const helpButton = document.querySelector('[data-tab="help"]');
        helpButton.click();
        helpButton.focus();

        const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
        helpButton.dispatchEvent(event);

        const overviewButton = document.querySelector('[data-tab="overview"]');
        expect(overviewButton.classList.contains('active')).toBe(true);
    });

    it('should go to last tab with End key', () => {
        const overviewButton = document.querySelector('[data-tab="overview"]');
        overviewButton.focus();

        const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
        overviewButton.dispatchEvent(event);

        const helpButton = document.querySelector('[data-tab="help"]');
        expect(helpButton.classList.contains('active')).toBe(true);
    });
});

describe('Tabs - Only One Active', () => {
    beforeEach(() => {
        setupDOM();
        initializeTabs();
    });

    it('should only have one active button at a time', () => {
        TAB_ORDER.forEach(tabName => {
            const button = document.querySelector(`[data-tab="${tabName}"]`);
            button.click();

            const activeButtons = document.querySelectorAll('.tab-button.active');
            expect(activeButtons.length).toBe(1);
        });
    });

    it('should only have one active panel at a time', () => {
        TAB_ORDER.forEach(tabName => {
            const button = document.querySelector(`[data-tab="${tabName}"]`);
            button.click();

            const activePanels = document.querySelectorAll('.tab-panel.active');
            expect(activePanels.length).toBe(1);
        });
    });
});
