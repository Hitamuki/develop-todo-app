import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 *
 */
@Component({
  selector: 'app-side-navigation',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss',
})
export class SideNavigationComponent {
  opened = true;

  /**
   *
   */
  toggleSidenav() {
    this.opened = !this.opened;
  }
}
