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
export class AppComponent {
  title = 'ToDoアプリ';
}
