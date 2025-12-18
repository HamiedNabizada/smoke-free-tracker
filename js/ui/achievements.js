import { achievements } from '../data/achievements.js';

export function updateAchievements(stats) {
    const container = document.getElementById('achievements');
    container.innerHTML = '';

    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'achievement';

        let unlocked = false;

        if (achievement.type === 'money') {
            unlocked = stats.money >= achievement.threshold;
        } else if (achievement.type === 'cigarettes') {
            unlocked = stats.cigarettes >= achievement.threshold;
        } else {
            unlocked = stats.days >= achievement.days;
        }

        if (unlocked) {
            div.classList.add('unlocked');
        } else {
            div.classList.add('locked');
        }

        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${achievement.title}</div>
            <div class="achievement-description">${achievement.description}</div>
        `;

        container.appendChild(div);
    });
}
