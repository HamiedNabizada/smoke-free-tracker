// Authentication Module
export async function checkAuth() {
    try {
        const response = await fetch('/api/auth.php?action=check');
        const data = await response.json();

        if (!data.logged_in) {
            // Redirect to login if not logged in
            window.location.href = '/login.html';
            return null;
        }

        return {
            userId: data.user_id,
            username: data.username
        };
    } catch (error) {
        console.error('Auth check failed:', error);
        window.location.href = '/login.html';
        return null;
    }
}

export async function logout() {
    try {
        await fetch('/api/auth.php?action=logout');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Logout failed:', error);
        window.location.href = '/login.html';
    }
}

export async function loadUserData() {
    try {
        const response = await fetch('/api/user-data.php?action=get');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to load user data');
        }

        return data.data;
    } catch (error) {
        console.error('Failed to load user data:', error);
        throw error;
    }
}

export async function updateUserData(updates) {
    try {
        const response = await fetch('/api/user-data.php?action=update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to update user data');
        }

        return true;
    } catch (error) {
        console.error('Failed to update user data:', error);
        throw error;
    }
}

export async function deleteAccount() {
    if (!confirm('Bist du sicher, dass du deinen Account löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden!')) {
        return false;
    }

    try {
        const response = await fetch('/api/user-data.php?action=delete', {
            method: 'POST'
        });

        const data = await response.json();

        if (data.success) {
            alert('Account erfolgreich gelöscht');
            window.location.href = '/login.html';
            return true;
        } else {
            throw new Error(data.error || 'Failed to delete account');
        }
    } catch (error) {
        console.error('Failed to delete account:', error);
        alert('Fehler beim Löschen des Accounts: ' + error.message);
        return false;
    }
}

export async function recordCraving() {
    try {
        const response = await fetch('/api/user-data.php?action=craving', {
            method: 'POST'
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to record craving');
        }

        return data.count;
    } catch (error) {
        console.error('Failed to record craving:', error);
        throw error;
    }
}

export async function getCravingCount() {
    try {
        const response = await fetch('/api/user-data.php?action=craving-count');
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Failed to get craving count');
        }

        return {
            count: data.count,
            date: data.date
        };
    } catch (error) {
        console.error('Failed to get craving count:', error);
        return { count: 0, date: new Date().toISOString().split('T')[0] };
    }
}
