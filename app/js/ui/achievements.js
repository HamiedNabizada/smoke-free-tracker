import { achievements } from '../data/achievements.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Get achievement text with i18n fallback
function getAchievementText(achievement, field) {
    if (isInitialized()) {
        const translated = t(`achievements.${achievement.id}.${field}`);
        if (translated !== `achievements.${achievement.id}.${field}`) {
            return translated;
        }
    }
    return achievement[field] || '';
}

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

        const title = getAchievementText(achievement, 'title');
        const description = getAchievementText(achievement, 'description');

        div.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-title">${title}</div>
            <div class="achievement-description">${description}</div>
        `;

        container.appendChild(div);
    });
}
