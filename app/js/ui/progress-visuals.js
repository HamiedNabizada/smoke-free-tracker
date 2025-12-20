// Progress Visualizations (Tree, Piggy Bank, Cemetery)

import { getCurrentGoals } from './progress-goals.js';

export function updateProgressVisuals(stats) {
    updateTreeVisualization(stats);
    updatePiggyVisualization(stats);
    updateCemeteryVisualization(stats);
}

function updateTreeVisualization(stats) {
    const days = Math.floor(stats.totalDays);
    const goals = getCurrentGoals();
    const targetDays = goals.days;

    // Update values
    document.getElementById('treeDaysValue').textContent = days;

    // Tree growth based on days (0-target)
    const progress = Math.min(days / targetDays, 1) * 100;

    // Show tree elements progressively
    const leaves1 = document.getElementById('leaves1');
    const leaves2Left = document.getElementById('leaves2-left');
    const leaves2Right = document.getElementById('leaves2-right');
    const leaves3 = document.getElementById('leaves3');
    const branch1 = document.getElementById('branch1');
    const branch2 = document.getElementById('branch2');
    const branch3 = document.getElementById('branch3');
    const branch4 = document.getElementById('branch4');

    // Calculate stage thresholds based on target (percentages of goal)
    const stage1 = targetDays * 0.02;  // 2% (was 7 days for 365)
    const stage2 = targetDays * 0.08;  // 8% (was 30 days)
    const stage3 = targetDays * 0.25;  // 25% (was 90 days)
    const stage4 = targetDays * 0.50;  // 50% (was 180 days)

    // Stage 1: 0-2% - just trunk
    if (days < stage1) {
        leaves1.style.opacity = '0';
        leaves2Left.style.opacity = '0';
        leaves2Right.style.opacity = '0';
        leaves3.style.opacity = '0';
        branch1.style.opacity = '0';
        branch2.style.opacity = '0';
        branch3.style.opacity = '0';
        branch4.style.opacity = '0';
    }
    // Stage 2: 2%-8% - small branches appear
    else if (days < stage2) {
        const branchProgress = (days - stage1) / (stage2 - stage1);
        branch1.style.opacity = branchProgress;
        branch2.style.opacity = branchProgress;
        leaves1.style.opacity = '0';
        leaves2Left.style.opacity = '0';
        leaves2Right.style.opacity = '0';
        leaves3.style.opacity = '0';
        branch3.style.opacity = '0';
        branch4.style.opacity = '0';
    }
    // Stage 3: 8%-25% - first layer of leaves
    else if (days < stage3) {
        branch1.style.opacity = '1';
        branch2.style.opacity = '1';
        const leafProgress = (days - stage2) / (stage3 - stage2);
        leaves1.style.opacity = leafProgress;
        leaves2Left.style.opacity = '0';
        leaves2Right.style.opacity = '0';
        leaves3.style.opacity = '0';
        branch3.style.opacity = leafProgress * 0.5;
        branch4.style.opacity = leafProgress * 0.5;
    }
    // Stage 4: 25%-50% - second layer of leaves
    else if (days < stage4) {
        branch1.style.opacity = '1';
        branch2.style.opacity = '1';
        branch3.style.opacity = '1';
        branch4.style.opacity = '1';
        leaves1.style.opacity = '1';
        const leafProgress = (days - stage3) / (stage4 - stage3);
        leaves2Left.style.opacity = leafProgress;
        leaves2Right.style.opacity = leafProgress;
        leaves3.style.opacity = '0';
    }
    // Stage 5: 50%+ - full tree with top leaves
    else {
        branch1.style.opacity = '1';
        branch2.style.opacity = '1';
        branch3.style.opacity = '1';
        branch4.style.opacity = '1';
        leaves1.style.opacity = '1';
        leaves2Left.style.opacity = '1';
        leaves2Right.style.opacity = '1';
        const leafProgress = Math.min((days - stage4) / (targetDays - stage4), 1);
        leaves3.style.opacity = leafProgress;
    }
}

function updatePiggyVisualization(stats) {
    const money = Math.floor(stats.money);
    const goals = getCurrentGoals();
    const targetMoney = goals.money;

    // Update values
    document.getElementById('piggyMoneyValue').textContent = money + '€';

    // Fill piggy bank based on money saved (0-target)
    const fillProgress = Math.min(money / targetMoney, 1);

    const moneyFill = document.getElementById('moneyFill');
    const maxHeight = 45; // Maximum fill height
    const fillHeight = fillProgress * maxHeight;

    // Animate fill from bottom up
    moneyFill.setAttribute('height', fillHeight);
    moneyFill.setAttribute('y', 150 - fillHeight);

    // Show coins at milestones (10% of target)
    const coins = document.getElementById('coins');
    const coinsThreshold = targetMoney * 0.1;
    if (money >= coinsThreshold) {
        coins.style.opacity = '1';

        // Trigger coin animation at specific milestones
        const milestone = targetMoney * 0.1; // Every 10%
        if (money % milestone < 5) {
            coins.style.animation = 'coins-sparkle 1.5s ease-in-out infinite';
        }
    } else {
        coins.style.opacity = '0';
    }
}

function updateCemeteryVisualization(stats) {
    const cigarettes = stats.cigarettes;
    const goals = getCurrentGoals();
    const targetCigarettes = goals.cigarettes;

    // Update values
    document.getElementById('cemeteryCigarettesValue').textContent = cigarettes;

    // Show cemetery elements progressively
    const smallGraves = document.getElementById('smallGraves');
    const mediumGraves = document.getElementById('mediumGraves');
    const largeGraves = document.getElementById('largeGraves');
    const epicGraves = document.getElementById('epicGraves');
    const fallingCigarettes = document.getElementById('fallingCigarettes');

    // Calculate stage thresholds based on target (percentages of goal)
    const stage1 = targetCigarettes * 0.10;  // 10% (was 100 for 1000)
    const stage2 = targetCigarettes * 0.50;  // 50% (was 500 for 1000)
    const stage3 = targetCigarettes * 1.00;  // 100% (was 1000)

    // Stage 1: 0-10% - small graves
    if (cigarettes < stage1) {
        const progress = cigarettes / stage1;
        smallGraves.style.opacity = progress;
        mediumGraves.style.opacity = '0';
        largeGraves.style.opacity = '0';
        epicGraves.style.opacity = '0';
        fallingCigarettes.style.opacity = '0';
    }
    // Stage 2: 10%-50% - medium gravestones
    else if (cigarettes < stage2) {
        smallGraves.style.opacity = '1';
        const progress = (cigarettes - stage1) / (stage2 - stage1);
        mediumGraves.style.opacity = progress;
        largeGraves.style.opacity = '0';
        epicGraves.style.opacity = '0';
        fallingCigarettes.style.opacity = progress * 0.3;
    }
    // Stage 3: 50%-100% - large cemetery
    else if (cigarettes < stage3) {
        smallGraves.style.opacity = '1';
        mediumGraves.style.opacity = '1';
        const progress = (cigarettes - stage2) / (stage3 - stage2);
        largeGraves.style.opacity = progress;
        epicGraves.style.opacity = '0';
        fallingCigarettes.style.opacity = progress * 0.5;
    }
    // Stage 4: 100%+ - epic cemetery scene
    else {
        smallGraves.style.opacity = '1';
        mediumGraves.style.opacity = '1';
        largeGraves.style.opacity = '1';
        const progress = Math.min((cigarettes - stage3) / targetCigarettes, 1);
        epicGraves.style.opacity = progress;
        fallingCigarettes.style.opacity = '0.8';
    }
}
