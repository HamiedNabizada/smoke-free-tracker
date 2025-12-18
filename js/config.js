// User configuration (can be customized)
export const userData = {
    quitDate: '2025-11-29T10:00:00', // 29.11.2025 um 10:00 Uhr
    cigarettesPerDay: 12,
    pricePerPack: 10,
    cigarettesPerPack: 20
};

// Global chart instance
export let chart = null;

// Function to set chart (needed because we can't reassign imported variables from outside)
export function setChart(newChart) {
    chart = newChart;
}
