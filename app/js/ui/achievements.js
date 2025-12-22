import { achievements } from '../data/achievements.js';

export function updateAchievements(stats) {
    const container = document.getElementById('achievements');
    container.innerHTML = '';

    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'achievement';

        let unlocked = false;

        switch (achievement.type) {
            case 'money':
                unlocked = stats.money >= achievement.threshold;
                break;
            case 'cigarettes':
                unlocked = stats.cigarettes >= achievement.threshold;
                break;
            case 'lifeHours':
                unlocked = stats.lifeGained.totalHours >= achievement.threshold;
                break;
            case 'lungHealth':
                unlocked = stats.lungHealth >= achievement.threshold;
                break;
            case 'water':
                unlocked = stats.waterSaved >= achievement.threshold;
                break;
            case 'co2':
                unlocked = stats.co2Avoided >= achievement.threshold;
                break;
            case 'timeSaved':
                unlocked = stats.timeSaved.totalHours >= achievement.threshold;
                break;
            default:
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
