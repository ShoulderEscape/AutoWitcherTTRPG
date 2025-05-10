window.onload = function() {
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      roll();
    }
  });
};


function roll() {
  const baseInput = parseInt(document.getElementById("base").value) || 0;
  const targetInput = document.getElementById("targets").value;
  const baseDamage = parseInt(document.getElementById("basedamage").value) || 0;
  const damageDice = parseInt(document.getElementById("damagedice").value) || 0;
  const isHeavyAttack = document.getElementById("heavyAttack").checked; 

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

  const { result: accuracyResult, rolls: accuracyRolls } = rollToHit();
  const { result: damageResult, rolls: damageRolls } = rollDamage(damageDice);

  let totalDamage = (damageResult + baseDamage) * damageMultipliers[finalTarget];

  if (isHeavyAttack) {
    totalDamage *= 2;
    adjustedBase -= 3;
  }

  document.getElementById("result-hits").textContent = accuracyResult + adjustedBase;
  document.getElementById("result-hits-rolled").textContent = accuracyRolls.join(" | ");
  document.getElementById("result-damage-rolled").textContent = damageRolls.join(" | ");
  document.getElementById("result-total").textContent = totalDamage;
  document.getElementById("result-target").textContent = finalTarget;
}


function rollDie(sides) {
  return result = Math.floor(Math.random() * sides) + 1;
}

function rollToHit() {
  const rolls = [];
  let total = 0;
  let hit = rollDie(10);
  rolls.push(hit);
  let modifier = 1;

  if (hit === 1) {
    modifier = -1;
    hit = rollDie(10);
    total -= hit;
    rolls.push(hit);
  } else {
    total += hit;
  }

  while (hit === 10) {
    hit = rollDie(10);
    rolls.push(hit);
    total += modifier * hit;
  }

  return { result: total, rolls };
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
