// User configuration (loaded from Firebase)
export let userData = {
    quitDate: null,
    cigarettesPerDay: 12,
    pricePerPack: 10,
    cigarettesPerPack: 20
};

// Function to set user data (called after loading from Firebase)
export function setUserData(data) {
    userData.quitDate = data.quit_date;
    userData.cigarettesPerDay = data.cigarettes_per_day;
    userData.pricePerPack = data.price_per_pack;
    userData.cigarettesPerPack = data.cigarettes_per_pack;
}

// Global chart instance
export let chart = null;

// Function to set chart (needed because we can't reassign imported variables from outside)
export function setChart(newChart) {
    chart = newChart;
}
