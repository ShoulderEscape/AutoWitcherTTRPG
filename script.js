function roll() {
    const baseInput = parseInt(document.getElementById("base").value);
    const targetInput = document.getElementById("targets").value;
    const baseDamage = parseInt(document.getElementById("basedamage").value) || 0;
    const damageDice = parseInt(document.getElementById("damagedice").value);

    const damageMultipliers = {
        Head: 3.0,
        Torso: 1.0,
        RArm: 0.5,
        LArm: 0.5,
        RLeg: 0.5,
        LLeg: 0.5
    };

    let adjustedBase = baseInput;
    switch (targetInput) {
        case "Head": adjustedBase -= 6; break;
        case "Torso": adjustedBase -= 1; break;
        case "RArm":
        case "LArm": adjustedBase -= 3; break;
        case "RLeg":
        case "LLeg": adjustedBase -= 2; break;
    }

    const finalTarget = targetInput === "Random" ? getRandomTarget() : targetInput;

    const { result: accuracyResult, rolls: accuracyRolls } = rollToHit(adjustedBase);
    const { result: damageResult, rolls: damageRolls } = rollDamage(damageDice);

    const totalDamage = (baseDamage + damageResult) * damageMultipliers[finalTarget];

    document.getElementById("result-hit").textContent = accuracyResult;
    document.getElementById("result-accuracy").textContent = accuracyRolls.join(" | ");
    document.getElementById("result-rolled").textContent = damageRolls.join(" | ");
    document.getElementById("result-total").textContent = totalDamage + accuracyResult;
    document.getElementById("result-target").textContent = finalTarget;
}

function rollDie(sides) {
    return result = Math.floor(Math.random() * sides) + 1;
}

function rollToHit(base) {
    const rolls = [];
    let hit = rollDie(10);
    rolls.push(hit);
    let modifier = 1;

    if (hit === 1) {
        modifier = -1;
        hit = rollDie(10);
        base -= hit;
        rolls.push(hit);
    } else {
        base += hit;
    }

    while (hit === 10) {
        hit = rollDie(10);
        rolls.push(hit);
        base += modifier * hit;
    }

    return { result: base, rolls };
}

function rollDamage(numDice) {
    const rolls = [];
    let total = 0;

    for (let i = 0; i < numDice; i++) {
        const roll = rollDie(6);
        rolls.push(roll);
        total += roll;
    }

    return { result: total, rolls };
}

function getRandomTarget() {
    const roll = rollDie(10);
    if (roll === 1) return "Head";
    if (roll >= 2 && roll <= 4) return "Torso";
    if (roll === 5) return "RArm";
    if (roll === 6) return "LArm";
    if (roll === 7 || roll === 8) return "RLeg";
    return "LLeg";
}
