/**
 * Demo Mode - Read-only demo account
 * Allows users to explore the app without registration
 */

export const DEMO_CREDENTIALS = {
    email: 'demo@byebyesmoke.app',
    password: 'demo123456',
    username: 'Demo-Benutzer'
};

export const DEMO_USER_DATA = {
    quit_date: getDemoQuitDate(), // 30 days ago
    cigarettes_per_day: 15,
    price_per_pack: 8,
    cigarettes_per_pack: 20,
    notifications_enabled: false,
    milestones_enabled: false,
    daily_motivation_enabled: false
};

/**
 * Get quit date for demo (30 days ago)
 */
function getDemoQuitDate() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString();
}

/**
 * Check if current user is demo account
 */
export function isDemoMode() {
    const user = firebase.auth().currentUser;
    if (!user) return false;
    return user.email === DEMO_CREDENTIALS.email;
}

/**
 * Login to demo account
 */
export async function loginDemo() {
    try {
        // Try to login with demo account
        await firebase.auth().signInWithEmailAndPassword(
            DEMO_CREDENTIALS.email,
            DEMO_CREDENTIALS.password
        );

        console.log('[Demo] Demo account logged in');
        return true;
    } catch (error) {
        console.error('[Demo] Login failed:', error);

        // If account doesn't exist, show error
        if (error.code === 'auth/user-not-found') {
            alert('Demo-Account ist noch nicht eingerichtet. Bitte kontaktiere den Support.');
        } else {
            alert('Fehler beim Demo-Login: ' + error.message);
        }

        return false;
    }
}

/**
 * Block write operations in demo mode
 */
export function blockDemoWrite(operation = 'Diese Aktion') {
    if (isDemoMode()) {
        alert(`${operation} ist im Test-Modus nicht möglich.\n\nRegistriere dich kostenlos, um alle Funktionen zu nutzen!`);
        return true;
    }
    return false;
}

/**
 * Show demo banner
 */
export function showDemoBanner() {
    if (!isDemoMode()) return;

    const banner = document.createElement('div');
    banner.className = 'demo-banner';
    banner.innerHTML = `
        <div class="demo-banner-content">
            <span class="demo-banner-icon">👀</span>
            <span class="demo-banner-text">Du siehst die App im Test-Modus. <a href="register.html" class="demo-banner-link">Jetzt kostenlos registrieren</a> um deine eigenen Daten zu tracken!</span>
        </div>
    `;

    document.body.prepend(banner);
}

/**
 * Get demo craving events (some sample data)
 */
export function getDemoCravingEvents() {
    return [
        { date: getDateDaysAgo(1), count: 3 },
        { date: getDateDaysAgo(2), count: 5 },
        { date: getDateDaysAgo(3), count: 2 },
        { date: getDateDaysAgo(5), count: 4 },
        { date: getDateDaysAgo(7), count: 6 },
        { date: getDateDaysAgo(10), count: 3 },
        { date: getDateDaysAgo(14), count: 2 },
        { date: getDateDaysAgo(21), count: 1 }
    ];
}

function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
}
