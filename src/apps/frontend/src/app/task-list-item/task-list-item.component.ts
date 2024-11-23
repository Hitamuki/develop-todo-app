import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe, NgIf } from '@angular/common';
import type { Task } from '../../models/task';

/**
 *
 */
@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [NgIf, DatePipe, FormsModule, MatCheckboxModule],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  @Input() task!: Task;

  /**
   * 期日判定
   * @param task 対象のタスク
   * @returns 期日内の場合true
   */
  isOverdue(task: Task): boolean | null {
    return !task.done && task.deadline && task.deadline.getTime() < new Date().setHours(0, 0, 0, 0);
  }
}
