import { healthMilestones } from '../data/milestones.js';
import { calculateTimeRemaining } from '../utils/calculations.js';

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

        div.innerHTML = `
            <div class="milestone-header">
                <div class="milestone-icon">${milestone.icon}</div>
                <div class="milestone-content">
                    <div class="milestone-title">${milestone.title}</div>
                    <div class="milestone-description">${milestone.description}</div>
                </div>
                ${!achieved ? `<div class="milestone-time">in ${timeRemaining}</div>` : '<div class="milestone-time">✓ Erreicht</div>'}
                <div class="milestone-expand-icon">ℹ️</div>
            </div>
            <div class="milestone-details">
                <p>${milestone.detailedInfo}</p>
            </div>
        `;

        // Add click event to toggle details
        div.addEventListener('click', () => {
            div.classList.toggle('expanded');
        });

        container.appendChild(div);
    });
}
