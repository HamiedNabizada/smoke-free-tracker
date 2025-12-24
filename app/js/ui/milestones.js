import { healthMilestones } from '../data/milestones.js';
import { calculateTimeRemaining } from '../utils/calculations.js';
import { t, isInitialized } from '../i18n/i18n.js';

// Get milestone text with i18n fallback
function getMilestoneText(milestone, field) {
    if (isInitialized()) {
        const translated = t(`milestones.${milestone.id}.${field}`);
        // Check if translation was found (not returning the key)
        if (translated !== `milestones.${milestone.id}.${field}`) {
            return translated;
        }
    }
    return milestone[field] || '';
}

export function updateHealthMilestones(daysPassed) {
    const container = document.getElementById('healthMilestones');
    container.innerHTML = '';

    healthMilestones.forEach((milestone, index) => {
        const div = document.createElement('div');
        div.className = 'milestone';

        const achieved = daysPassed >= milestone.days;
        if (achieved) {
            div.classList.add('achieved');
        } else {
            div.classList.add('locked');
        }

        const timeRemaining = !achieved ? calculateTimeRemaining(milestone.days - daysPassed) : '';

        const title = getMilestoneText(milestone, 'title');
        const description = getMilestoneText(milestone, 'description');
        const detailedInfo = getMilestoneText(milestone, 'detailedInfo');
        const achievedText = t('milestonesSection.reached') !== 'milestonesSection.reached'
            ? t('milestonesSection.reached')
            : 'Erreicht';

        div.innerHTML = `
            <div class="milestone-header">
                <div class="milestone-icon">${milestone.icon}</div>
                <div class="milestone-content">
                    <div class="milestone-title">${title}</div>
                    <div class="milestone-description">${description}</div>
                </div>
                ${!achieved ? `<div class="milestone-time">in ${timeRemaining}</div>` : `<div class="milestone-time">✓ ${achievedText}</div>`}
                <div class="milestone-expand-icon">ℹ️</div>
            </div>
            <div class="milestone-details">
                <p>${detailedInfo}</p>
            </div>
        `;

        // Add click event to toggle details
        div.addEventListener('click', () => {
            div.classList.toggle('expanded');
        });

        container.appendChild(div);
    });
}
