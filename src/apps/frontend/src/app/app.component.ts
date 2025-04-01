import { Component } from '@angular/core';
import { TaskListComponent } from './pages/task-list/task-list.component';

/**
 *
 */
@Component({
  selector: 'app-root',
  imports: [TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

/**
 *
 */
export class AppComponent {
  title = 'frontend';
}
