import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SideNavigationComponent } from '../side-navigation/side-navigation.component';
import { FooterComponent } from '../footer/footer.component';
/**
 *
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SideNavigationComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column flex-grow-1 h-100">
      <app-header />
      <div class="d-flex flex-column">
        <app-side-navigation>
          <router-outlet />
        </app-side-navigation>
      </div>
      <app-footer />
    </div>
  `,
})
export class LayoutComponent {}
