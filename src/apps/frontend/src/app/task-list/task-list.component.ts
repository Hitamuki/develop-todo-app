import { Component, OnInit, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { TaskListItemComponent } from '../task-list-item/task-list-item.component';
import { TaskGetResponseDto, TasksService } from '../api';
import { TaskAddEditComponent } from '../modals/task-add-edit/task-add-edit.component';

/**
 *
 */
@Component({
    selector: 'app-task-list',
    imports: [TaskListItemComponent, MatIconModule],
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss']
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
   *
   * @param modalType モーダル画面の種別
   * @param id タスクUUID
   */
  openModal(modalType: 'add' | 'edit', id: string | null = null) {
    const modalRef = this.modalService.open(TaskAddEditComponent, {
      size: 'xl',
      centered: true,
      scrollable: true,
    });
    modalRef.componentInstance.modalType = modalType;
    modalRef.componentInstance.id = id;

    modalRef.componentInstance.modalClosed.subscribe(() => {
      this.reloadPage();
    });
  }

  /**
   *
   * @param taskId UUID
   */
  onEditTask(taskId: string) {
    this.openModal('edit', taskId); // 編集モードでモーダルを表示
  }

  /**
   *
   */
  onDeleteTask() {
    this.reloadPage();
  }

  // ----------------------
  // プライベートメソッド
  // ----------------------

  private reloadPage() {
    this.getTasks();
  }

  private getTasks() {
    this.tasksService.gets().subscribe({
      next: (result) => {
        this.tasks = [...result];
      },
      error: (err) => console.error('Error fetching tasks:', err),
    });
  }
}
