import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * アプリケーションのルートコンポーネント
 * ルーティングのみを担当し、レイアウトはレイアウトコンポーネントに委譲
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ToDoアプリ';
  showLayout = true;
  private routerSubscription!: Subscription;

  /**
   *
   * @param router
   */
  constructor(private router: Router) {}

  /**
   *
   */
  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showLayout = !(event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/register');
        }
      });
  }

  /**
   *
   */
  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
