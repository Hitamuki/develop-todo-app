import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TaskGetResponseDto, TasksService } from '../api';

/**
 *
 */
@Component({
  selector: 'app-task-list-item',
  standalone: true,
  imports: [DatePipe, FormsModule, MatCheckboxModule, MatIconModule],
  templateUrl: './task-list-item.component.html',
  styleUrl: './task-list-item.component.scss',
})
export class TaskListItemComponent {
  private tasksService = inject(TasksService);
  @Input() task!: TaskGetResponseDto;
  @Output() edit = new EventEmitter<string>();

  /**
   *
   * @param taskId 編集するタスクUUID
   */
  onEdit(taskId: string) {
    this.edit.emit(taskId);
  }

  /**
   *
   * @param taskId 削除するタスクUUID
   */
  onDelete(taskId: string) {
    this.deleteTask(taskId);
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

  private deleteTask(id: string) {
    // TODO: 「_」がついている
    this.tasksService._delete(id).subscribe({
      error: (err) => console.error('Error fetching task:', err),
    });
  }
}
