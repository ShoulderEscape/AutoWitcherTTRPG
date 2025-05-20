import { Component } from '@angular/core';
import { CombatComponent } from "../pages/combat/combat.component";
import { CommonModule } from '@angular/common';
import { IngredientsComponent } from "../pages/ingredients/ingredients.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, CombatComponent, IngredientsComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  selectedTab: 'combat' | 'ingredients' = 'combat';

  selectTab(tab: 'combat' | 'ingredients') {
    this.selectedTab = tab;
    console.log(this.selectTab)
  }

  isCombatSelected(): boolean {
    return this.selectedTab === 'combat';
  }

  isIngredientsSelected(): boolean {
    return this.selectedTab === 'ingredients';
  }
}
