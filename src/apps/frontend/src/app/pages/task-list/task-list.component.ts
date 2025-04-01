import { Component, OnInit, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule, ICellRendererAngularComp } from 'ag-grid-angular';
import { ColDef, ClientSideRowModelModule } from 'ag-grid-community';
import { DatePipe, NgClass } from '@angular/common';
import { TaskAddEditComponent } from '../../modals/task-add-edit/task-add-edit.component';
import { TaskGetResponseDto, TasksService } from '../../api';

/**
 * タスクアクションセルレンダラーコンポーネント
 */
@Component({
  selector: 'app-task-action-cell',
  template: `
    <div class="d-flex justify-content-around align-items-center h-100">
      <button class="btn btn-sm btn-outline-primary" (click)="onEdit()">
        <mat-icon>edit</mat-icon>
      </button>
      <button class="btn btn-sm btn-outline-danger" (click)="onDelete()">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
  standalone: true,
  imports: [MatIconModule],
})
export class TaskActionCellComponent implements ICellRendererAngularComp {
  private params: any;

  /**
   *
   * @param params
   */
  agInit(params: any): void {
    this.params = params;
  }

  /**
   *
   * @param params
   */
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  /**
   *
   */
  onEdit(): void {
    if (this.params.onEdit) {
      this.params.onEdit(this.params.data.id);
    }
  }

  /**
   *
   */
  onDelete(): void {
    if (this.params.onDelete) {
      this.params.onDelete(this.params.data.id);
    }
  }
}

/**
 * ステータスセルレンダラーコンポーネント
 */
@Component({
  selector: 'app-task-status-cell',
  template: `
    <div>
      {{ getStatusText(params.value) }}
    </div>
  `,
  standalone: true,
})
export class TaskStatusCellComponent implements ICellRendererAngularComp {
  params: any;

  /**
   *
   * @param params
   */
  agInit(params: any): void {
    this.params = params;
  }

  /**
   *
   * @param params
   */
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  /**
   *
   * @param statusId
   */
  getStatusText(statusId: number): string {
    switch (statusId) {
      case 1:
        return '未着手';
      case 2:
        return '進行中';
      case 3:
        return '完了';
      default:
        return '不明';
    }
  }
}

/**
 * 日付セルレンダラーコンポーネント
 */
@Component({
  selector: 'app-date-cell',
  template: `
    <div [ngClass]="{ 'text-danger': isOverdue() }">
      {{ params.value | date: 'yyyy/MM/dd' }}
    </div>
  `,
  standalone: true,
  imports: [DatePipe, NgClass],
})
export class DateCellComponent implements ICellRendererAngularComp {
  params: any;

  /**
   *
   * @param params
   */
  agInit(params: any): void {
    this.params = params;
  }

  /**
   *
   * @param params
   */
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  /**
   *
   */
  isOverdue(): boolean {
    if (!this.params.value) return false;
    const dueDate = new Date(this.params.value);
    const statusId = this.params.data.statusId;
    return statusId !== 3 && dueDate.getTime() < new Date().setHours(0, 0, 0, 0);
  }
}

/**
 * タスク一覧コンポーネント
 */
@Component({
  selector: 'app-task-list',
  imports: [MatIconModule, AgGridModule, TaskActionCellComponent, TaskStatusCellComponent, DateCellComponent],
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

  // AG Grid Modules
  modules = [ClientSideRowModelModule];

  // AG Grid Column Definitions
  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'title', headerName: 'タイトル', flex: 2 },
    { field: 'description', headerName: '説明', flex: 3 },
    {
      field: 'dueDate',
      headerName: '期日',
      flex: 1,
      cellRenderer: DateCellComponent,
    },
    {
      field: 'statusId',
      headerName: 'ステータス',
      flex: 1,
      cellRenderer: TaskStatusCellComponent,
    },
    {
      headerName: 'アクション',
      cellRenderer: TaskActionCellComponent,
      cellRendererParams: {
        onEdit: this.onEditTask.bind(this),
        onDelete: this.onDeleteTask.bind(this),
      },
      flex: 1,
    },
  ];

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
   * @param taskId
   */
  onDeleteTask(taskId: string) {
    this.tasksService._delete(taskId).subscribe({
      next: () => {
        this.reloadPage();
      },
      error: (err) => console.error('Error deleting task:', err),
    });
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
