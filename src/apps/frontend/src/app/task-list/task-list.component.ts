import { Component, OnInit, inject } from '@angular/core';

import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskGetResponseDto, TasksService } from '../api';

/**
 *
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskListItemComponent, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  private tasksService = inject(TasksService);

  // ----------------------
  // パブリック変数
  // ----------------------
  tasks: TaskGetResponseDto[] = [];

  /** Inserted by Angular inject() migration for backwards compatibility */

  // ----------------------
  // プライベート変数
  // ----------------------

  // ----------------------
  // パブリックメソッド
  // ----------------------
  /**
   * 初期化処理
   */
  ngOnInit() {
    this.getTasks();
  }

  /**
   * タスクを追加する
   * @param task タスク
   */
  addTask(task: TaskGetResponseDto) {
    this.tasks = [...this.tasks, task];
  }

  // ----------------------
  // プライベートメソッド
  // ----------------------

  private getTasks() {
    this.tasksService.gets().subscribe({
      next: (result) => {
        this.tasks = [...result];
      },
      error: (err) => console.error('Error fetching tasks:', err),
    });
  }
}
