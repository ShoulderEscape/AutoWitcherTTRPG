import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CombatComponent } from '../pages/combat/combat.component';
import { MenuComponent } from "../menu/menu.component";

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, CombatComponent, MenuComponent], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] 
})
export class AppComponent {
  title = 'AutoWitcherTTRPG';
}
