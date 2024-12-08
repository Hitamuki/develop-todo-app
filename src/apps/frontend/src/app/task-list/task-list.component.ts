import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskGetResponseDto, TasksService } from '../api';

/**
 *
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, TaskListItemComponent, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  // ----------------------
  // パブリック変数
  // ----------------------
  tasks: TaskGetResponseDto[] = [];

  // ----------------------
  // プライベート変数
  // ----------------------

  // ----------------------
  // パブリックメソッド
  // ----------------------
  /**
   * コンストラクタ
   * @param taskService タスクのAPI
   */
  constructor(private taskService: TasksService) {}

  /**
   * 初期化処理
   */
  ngOnInit() {
    this.taskService.gets().subscribe((result) => {
      this.tasks = result;
    });
    // this.tasks=[
      // { Title: '牛乳を買う', StatusId: 1, DueDate: new Date('2021-01-01').toDateString() },
      // { Title: '可燃ゴミを出す', StatusId: 3, DueDate: new Date('2020-01-02').toDateString() },
      // { Title: '銀行に行く', StatusId: 1, DueDate: new Date('2020-01-03').toDateString() },
    // ];
  }

  /**
   * タスクを追加する
   * @param task タスク
   */
  addTask(task: TaskGetResponseDto) {
    this.tasks.push(task);
  }

  // ----------------------
  // プライベートメソッド
  // ----------------------
}
