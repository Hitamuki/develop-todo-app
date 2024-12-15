import { Component, OnInit, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskGetResponseDto, TasksService } from '../api';
import { TaskAddEditComponent } from '../modals/task-add-edit/task-add-edit.component';

/**
 *
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskListItemComponent, TaskFormComponent, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  private tasksService = inject(TasksService);
  private modalService = inject(NgbModal);

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

  /**
   *
   */
  openModal(modalType: 'add' | 'edit', id: string | null = null) {
    const modalRef = this.modalService.open(TaskAddEditComponent, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.modalType = modalType;
    modalRef.componentInstance.id = id;
  }

  /**
   *
   * @param taskId
   */
  onEditTask(taskId: string) {
    this.openModal('edit', taskId); // 編集モードでモーダルを表示
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
