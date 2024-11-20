import { Component, EventEmitter, Output } from '@angular/core';
import type { Task } from '../../models/task';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, JsonPipe, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  @Output() addTask = new EventEmitter<Task>();

  newTask: Task = {
    title: '',
    done: false,
    deadline: null,
  };

  submit() {
    this.addTask.emit({
      title: this.newTask.title,
      done: false,
      deadline: this.newTask.deadline ? new Date(this.newTask.deadline) : null,
    });
    this.newTask = {
      title: '',
      done: false,
      deadline: null,
    };
  }
}
