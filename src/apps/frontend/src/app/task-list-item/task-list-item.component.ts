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
   * @param task
   */
  onEdit(task: TaskGetResponseDto) {
    task.description = 'test';
    this.edit.emit('627bfc78-b00d-4b93-90af-e9a5b5b3cc49'); // TODO: id
  }

  /**
   *
   * @param task 削除するタスク
   */
  onDelete(task: TaskGetResponseDto) {
    this.deleteTask('ca656f51-b039-11ef-88cc-0242ac1a0002');
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
    this.tasksService._delete(id as string).subscribe({
      error: (err) => console.error('Error fetching task:', err),
    });
  }
}
