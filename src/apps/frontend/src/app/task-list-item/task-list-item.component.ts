import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatePipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { TaskGetResponseDto, TasksService } from '../api';

/**
 *
 */
@Component({
    selector: 'app-task-list-item',
    imports: [DatePipe, FormsModule, MatCheckboxModule, MatIconModule, NgClass],
    templateUrl: './task-list-item.component.html',
    styleUrl: './task-list-item.component.scss'
})
export class TaskListItemComponent {
  private tasksService = inject(TasksService);
  @Input() task!: TaskGetResponseDto;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<void>();

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
    this.deleteTask(taskId).subscribe({
      next: () => {
        this.delete.emit();
      },
    });
  }

  onStatusChange(isChecked: boolean): void {
    if (isChecked) {
      this.task.statusId = 3;
    } else {
      this.task.statusId = 1;
    }
    this.putTask(this.task.id, this.task);
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

  private deleteTask(id: string): Observable<unknown> {
    // TODO: 「_」がついている
    return this.tasksService._delete(id);
  }

  private putTask(id: string, task: TaskGetResponseDto): void {
    this.tasksService.put(id, task).subscribe();
  }
}
