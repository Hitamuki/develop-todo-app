import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TaskGetResponseDto } from '../api';

/**
 *
 */
@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [DatePipe, FormsModule, MatCheckboxModule,MatIconModule],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  @Input() task!: TaskGetResponseDto;

  /**
   *
   * @param task 編集するタスク
   */
  onEdit(task: TaskGetResponseDto) {
    console.log('Edit task:', task);
    // 編集処理のロジックをここに記述
  }

  /**
   *
   * @param task 削除するタスク
   */
  onDelete(task: TaskGetResponseDto) {
    console.log('Delete task:', task);
  }

  /**
   * 期日判定
   * @param task 対象のタスク
   * @returns 期日内の場合true
   */
  isOverdue(task: TaskGetResponseDto): boolean | null {
    if (!task?.dueDate) return null;
    const dueDate = new Date(task.dueDate as string);
    if (isNaN(dueDate.getTime())) return null;
    return task.statusId !== 3 && dueDate.getTime() < new Date().setHours(0, 0, 0, 0);
  }
}
