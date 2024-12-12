import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { TaskGetResponseDto } from '../api';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 *
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  @Output() addTask = new EventEmitter<TaskGetResponseDto>();

  newTask: TaskGetResponseDto = this.resetTask();

  /**
   * タスクを追加する
   */
  submit() {
    if (!this.newTask.title) {
      console.error('Title is required');
      return;
    }

    const task: TaskGetResponseDto = {
      ...this.newTask,
      dueDate: this.newTask.dueDate ? this.newTask.dueDate : undefined,
    };

    this.addTask.emit(task);
    this.newTask = this.resetTask();
  }

  private resetTask(): TaskGetResponseDto {
    return {
      title: '',
      statusId: 1,
      dueDate: undefined,
    };
  }
}
