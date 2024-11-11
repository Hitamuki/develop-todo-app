import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import type { Task } from '../../models/task';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, TaskListItemComponent, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.sass'],
})
export class TaskListComponent {
  tasks: Task[] = [
    { title: '牛乳を買う', done: false, deadline: new Date('2021-01-01') },
    { title: '可燃ゴミを出す', done: true, deadline: new Date('2020-01-02') },
    { title: '銀行に行く', done: false, deadline: new Date('2020-01-03') },
  ];

  addTask(task: Task) {
    this.tasks.push(task);
  }
}
