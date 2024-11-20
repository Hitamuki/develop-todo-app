import { Component, Input } from '@angular/core';
import type { Task } from '../../models/task';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [NgIf, DatePipe, FormsModule, MatCheckboxModule],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  @Input() task!: Task;

  isOverdue(task: Task): boolean | null {
    return !task.done && task.deadline && task.deadline.getTime() < new Date().setHours(0, 0, 0, 0);
  }
}
