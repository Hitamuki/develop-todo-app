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

  newTask: TaskGetResponseDto = {
    Title: '',
    StatusId: 1,
    DueDate: undefined,
  };
  defaultNewTask: TaskGetResponseDto = {
    Title: '',
    StatusId: 1,
    DueDate: undefined,
  };

  /**
   * タスクを追加する
   */
  submit() {
    this.addTask.emit({
      Title: this.newTask.Title,
      StatusId: 1,
      DueDate: this.newTask.DueDate ? new Date(this.newTask.DueDate).toDateString() : undefined,
    });
    this.newTask = this.defaultNewTask;
  }
}
