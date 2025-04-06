import { Component, OnInit, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, ClientSideRowModelModule } from 'ag-grid-community';
import { TaskAddEditComponent } from '../../modals/task-add-edit/task-add-edit.component';
import { TaskGetResponseDto, TasksService } from '../../api';
import { TaskActionCellComponent } from './../components/task-action-cell.component';
import { TaskStatusCellComponent } from './../components/task-status-cell.component';
import { DateCellComponent } from './../components/date-cell.component';
import { ToastrService } from 'ngx-toastr';

/**
 * タスク一覧コンポーネント
 */
@Component({
  selector: 'app-task-list',
  imports: [MatIconModule, AgGridModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  private tasksService = inject(TasksService);
  private modalService = inject(NgbModal);
  private toastr = inject(ToastrService);

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
        this.toastr.success('タスクが削除されました', '削除完了');
        this.reloadPage();
      },
      error: (err) => {
        console.error('Error deleting task:', err);
        this.toastr.error('タスクの削除に失敗しました', 'エラー');
      },
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
