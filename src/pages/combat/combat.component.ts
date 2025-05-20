import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-combat',
  templateUrl: './combat.component.html',
  styleUrls: ['./combat.component.scss']
})
export class CombatComponent implements OnInit {

  @ViewChild('base') baseInput!: ElementRef;
  @ViewChild('targets') targetInput!: ElementRef;
  @ViewChild('basedamage') baseDamageInput!: ElementRef;
  @ViewChild('damagedice') damageDiceInput!: ElementRef;
  @ViewChild('heavyAttack') heavyAttackInput!: ElementRef;

  results = {
    hitsRolled: '',
    hits: '',
    target: '',
    damageRolled: '',
    totalDamage: '',
    critRolled: '',
    critTotal: '',
    critTarget: '',
    critDamage: ''
  };

  ngOnInit(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        this.roll();
      }
    });
  }

  roll(): void {
    const base = parseInt(this.baseInput.nativeElement.value) || 0;
    const target = this.targetInput.nativeElement.value;
    const baseDamage = parseInt(this.baseDamageInput.nativeElement.value) || 0;
    const damageDice = parseInt(this.damageDiceInput.nativeElement.value) || 0;
    const isHeavyAttack = this.heavyAttackInput.nativeElement.checked;

    const damageMultipliers: Record<string, number> = {
      Head: 3.0,
      Torso: 1.0,
      RArm: 0.5,
      LArm: 0.5,
      RLeg: 0.5,
      LLeg: 0.5
    };

    let adjustedBase = base;
    switch (target) {
      case 'Head': adjustedBase -= 6; break;
      case 'Torso': adjustedBase -= 1; break;
      case 'RArm':
      case 'LArm': adjustedBase -= 3; break;
      case 'RLeg':
      case 'LLeg': adjustedBase -= 2; break;
    }

    const { result: accuracyResult, rolls: accuracyRolls } = this.rollToHit();
    const { result: damageResult, rolls: damageRolls } = this.rollDamage(damageDice);
    let { result: critResult, rolls: critRolls } = this.rollCrit();

    let finalTarget = target;
    let critTarget = target;

    if (target === 'Random') {
      finalTarget = this.getRandomTarget();
      critTarget = this.getCritTarget(critResult);
    } else {
      let tempCritTarget = '';
      while (tempCritTarget !== critTarget) {
        ({ result: critResult, rolls: critRolls } = this.rollCrit());
        tempCritTarget = this.getCritTarget(critResult);
      }
    }

    let totalDamage = (damageResult + baseDamage) * damageMultipliers[finalTarget];
    let critDamage = (damageResult + baseDamage) * damageMultipliers[critTarget];

    if (isHeavyAttack) {
      totalDamage *= 2;
      critDamage *= 2;
      adjustedBase -= 3;
    }

    this.results = {
      hits: (accuracyResult + adjustedBase).toString(),
      hitsRolled: accuracyRolls.join(' | '),
      damageRolled: damageRolls.join(' | '),
      totalDamage: Math.floor(totalDamage).toString(),
      target: finalTarget,
      critRolled: critRolls.join(' | '),
      critTotal: critResult.toString(),
      critTarget: critTarget,
      critDamage: Math.floor(critDamage).toString()
    };
  }

  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }

  private rollCrit(): { result: number; rolls: number[] } {
    const roll1 = this.rollDie(6);
    const roll2 = this.rollDie(6);
    return { result: roll1 + roll2, rolls: [roll1, roll2] };
  }

  private rollToHit(): { result: number; rolls: number[] } {
    const rolls: number[] = [];
    let total = 0;
    let hit = this.rollDie(10);
    rolls.push(hit);
    let modifier = 1;

    if (hit === 1) {
      modifier = -1;
      hit = this.rollDie(10);
      total -= hit;
      rolls.push(hit);
    } else {
      total += hit;
    }

    while (hit === 10) {
      hit = this.rollDie(10);
      rolls.push(hit);
      total += modifier * hit;
    }

    return { result: total, rolls };
  }

  private rollDamage(numDice: number): { result: number; rolls: number[] } {
    const rolls: number[] = [];
    let total = 0;
    for (let i = 0; i < numDice; i++) {
      const roll = this.rollDie(6);
      rolls.push(roll);
      total += roll;
    }
    return { result: total, rolls };
  }

  private getRandomTarget(): string {
    const roll = this.rollDie(10);
    if (roll === 1) return 'Head';
    if (roll >= 2 && roll <= 4) return 'Torso';
    if (roll === 5) return 'RArm';
    if (roll === 6) return 'LArm';
    if (roll === 7 || roll === 8) return 'RLeg';
    return 'LLeg';
  }

  private getCritTarget(dieResult: number): string {
    if (dieResult === 11 || dieResult === 12) return 'Head';
    if (dieResult >= 6 && dieResult <= 10) return 'Torso';
    if (dieResult === 4 || dieResult === 5) return this.randomOrientation() + 'Arm';
    if (dieResult === 2 || dieResult === 3) return this.randomOrientation() + 'Leg';
    return 'Torso';
  }

  private randomOrientation(): 'R' | 'L' {
    return this.rollDie(2) === 1 ? 'R' : 'L';
  }
}
