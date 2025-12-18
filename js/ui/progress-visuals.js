// Progress Visualizations (Tree, Piggy Bank, Cemetery)

export function updateProgressVisuals(stats) {
    updateTreeVisualization(stats);
    updatePiggyVisualization(stats);
    updateCemeteryVisualization(stats);
}

function updateTreeVisualization(stats) {
    const days = Math.floor(stats.totalDays);

    // Update values
    document.getElementById('treeDaysValue').textContent = days;

    // Tree growth based on days (0-365)
    const progress = Math.min(days / 365, 1) * 100;

    // Show tree elements progressively
    const leaves1 = document.getElementById('leaves1');
    const leaves2Left = document.getElementById('leaves2-left');
    const leaves2Right = document.getElementById('leaves2-right');
    const leaves3 = document.getElementById('leaves3');
    const branch1 = document.getElementById('branch1');
    const branch2 = document.getElementById('branch2');
    const branch3 = document.getElementById('branch3');
    const branch4 = document.getElementById('branch4');

    // Stage 1: 0-7 days - just trunk
    if (days < 7) {
        leaves1.style.opacity = '0';
        leaves2Left.style.opacity = '0';
        leaves2Right.style.opacity = '0';
        leaves3.style.opacity = '0';
        branch1.style.opacity = '0';
        branch2.style.opacity = '0';
        branch3.style.opacity = '0';
        branch4.style.opacity = '0';
    }
    // Stage 2: 7-30 days - small branches appear
    else if (days < 30) {
        const branchProgress = (days - 7) / 23;
        branch1.style.opacity = branchProgress;
        branch2.style.opacity = branchProgress;
        leaves1.style.opacity = '0';
        leaves2Left.style.opacity = '0';
        leaves2Right.style.opacity = '0';
        leaves3.style.opacity = '0';
        branch3.style.opacity = '0';
        branch4.style.opacity = '0';
    }
    // Stage 3: 30-90 days - first layer of leaves
    else if (days < 90) {
        branch1.style.opacity = '1';
        branch2.style.opacity = '1';
        const leafProgress = (days - 30) / 60;
        leaves1.style.opacity = leafProgress;
        leaves2Left.style.opacity = '0';
        leaves2Right.style.opacity = '0';
        leaves3.style.opacity = '0';
        branch3.style.opacity = leafProgress * 0.5;
        branch4.style.opacity = leafProgress * 0.5;
    }
    // Stage 4: 90-180 days - second layer of leaves
    else if (days < 180) {
        branch1.style.opacity = '1';
        branch2.style.opacity = '1';
        branch3.style.opacity = '1';
        branch4.style.opacity = '1';
        leaves1.style.opacity = '1';
        const leafProgress = (days - 90) / 90;
        leaves2Left.style.opacity = leafProgress;
        leaves2Right.style.opacity = leafProgress;
        leaves3.style.opacity = '0';
    }
    // Stage 5: 180+ days - full tree with top leaves
    else {
        branch1.style.opacity = '1';
        branch2.style.opacity = '1';
        branch3.style.opacity = '1';
        branch4.style.opacity = '1';
        leaves1.style.opacity = '1';
        leaves2Left.style.opacity = '1';
        leaves2Right.style.opacity = '1';
        const leafProgress = Math.min((days - 180) / 185, 1);
        leaves3.style.opacity = leafProgress;
    }
}

function updatePiggyVisualization(stats) {
    const money = Math.floor(stats.money);

    // Update values
    document.getElementById('piggyMoneyValue').textContent = money + '€';

    // Fill piggy bank based on money saved (0-1000€)
    const maxMoney = 1000;
    const fillProgress = Math.min(money / maxMoney, 1);

    const moneyFill = document.getElementById('moneyFill');
    const maxHeight = 45; // Maximum fill height
    const fillHeight = fillProgress * maxHeight;

    // Animate fill from bottom up
    moneyFill.setAttribute('height', fillHeight);
    moneyFill.setAttribute('y', 150 - fillHeight);

    // Show coins at milestones
    const coins = document.getElementById('coins');
    if (money >= 100) {
        coins.style.opacity = '1';

        // Trigger coin animation at specific milestones
        if (money % 100 < 5) { // Show animation briefly after each 100€
            coins.style.animation = 'coins-sparkle 1.5s ease-in-out infinite';
        }
    } else {
        coins.style.opacity = '0';
    }
}

function updateCemeteryVisualization(stats) {
    const cigarettes = stats.cigarettes;

    // Update values
    document.getElementById('cemeteryCigarettesValue').textContent = cigarettes;

    // Show cemetery elements progressively
    const smallGraves = document.getElementById('smallGraves');
    const mediumGraves = document.getElementById('mediumGraves');
    const largeGraves = document.getElementById('largeGraves');
    const epicGraves = document.getElementById('epicGraves');
    const fallingCigarettes = document.getElementById('fallingCigarettes');

    // Stage 1: 0-100 cigarettes - small graves
    if (cigarettes < 100) {
        const progress = cigarettes / 100;
        smallGraves.style.opacity = progress;
        mediumGraves.style.opacity = '0';
        largeGraves.style.opacity = '0';
        epicGraves.style.opacity = '0';
        fallingCigarettes.style.opacity = '0';
    }
    // Stage 2: 100-500 cigarettes - medium gravestones
    else if (cigarettes < 500) {
        smallGraves.style.opacity = '1';
        const progress = (cigarettes - 100) / 400;
        mediumGraves.style.opacity = progress;
        largeGraves.style.opacity = '0';
        epicGraves.style.opacity = '0';
        fallingCigarettes.style.opacity = progress * 0.3;
    }
    // Stage 3: 500-1000 cigarettes - large cemetery
    else if (cigarettes < 1000) {
        smallGraves.style.opacity = '1';
        mediumGraves.style.opacity = '1';
        const progress = (cigarettes - 500) / 500;
        largeGraves.style.opacity = progress;
        epicGraves.style.opacity = '0';
        fallingCigarettes.style.opacity = progress * 0.5;
    }
    // Stage 4: 1000+ cigarettes - epic cemetery scene
    else {
        smallGraves.style.opacity = '1';
        mediumGraves.style.opacity = '1';
        largeGraves.style.opacity = '1';
        const progress = Math.min((cigarettes - 1000) / 1000, 1);
        epicGraves.style.opacity = progress;
        fallingCigarettes.style.opacity = '0.8';
    }
}
