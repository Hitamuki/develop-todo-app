import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, tap } from 'rxjs';
import dayjs from 'dayjs';
import { TasksService } from '../../api/api/tasks.service';
import { TaskGetResponseDto } from '../../api/model/task-get-response-dto';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatusIdEnum } from '../../api/model/status-id-enum';
import { ToastrService } from 'ngx-toastr';

/**
 *
 */
@Component({
  selector: 'app-task-add-edit',
  standalone: true,
  imports: [
    NgbDatepickerModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgSelectModule,
  ],
  templateUrl: './task-add-edit.component.html',
  styleUrl: './task-add-edit.component.scss',
  providers: [MatNativeDateModule],
})
export class TaskAddEditComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private tasksService = inject(TasksService);
  private toastr = inject(ToastrService);

  @Input() modalType!: 'add' | 'edit';
  @Input() id?: string;
  @Output() modalClosed = new EventEmitter<void>();

  task: TaskGetResponseDto = this.resetTask();
  formattedDueDate?: { year: number; month: number; day: number };
  materialDate?: Date;

  statusItems = [
    { id: 1, name: '未着手' },
    { id: 2, name: '進行中' },
    { id: 3, name: '完了' }
  ];

  /**
   *
   */
  ngOnInit(): void {
    // 初期化処理でpageTypeがeditの場合は、idを基に取得処理を実行
    if (this.modalType === 'edit') {
      this.getTask().subscribe({
        next: () => {
          // 期日の初期化処理
          if (this.task.dueDate) {
            // `task.dueDate` は "YYYY-MM-DD" 形式の文字列 → { year, month, day } 型に変換
            const parsedDate = dayjs(this.task.dueDate);
            this.formattedDueDate = {
              year: parsedDate.year(),
              month: parsedDate.month() + 1, // dayjsのmonthは0から始まるので+1
              day: parsedDate.date(),
            };
            this.materialDate = new Date(this.task.dueDate);
          }
        },
      });
    }
  }

  // NgbDatepicker 日付変更イベント
  /**
   *
   * @param newDate
   * @param newDate.year
   * @param newDate.month
   * @param newDate.day
   */
  onDateChange(newDate: { year: number; month: number; day: number }): void {
    this.task.dueDate = `${newDate.year}-${String(newDate.month).padStart(2, '0')}-${String(newDate.day).padStart(2, '0')}`;
  }

  // Angular Material Datepicker 日付変更イベント
  /**
   *
   * @param event
   * @param event.value
   */
  onMaterialDateChange(event: { value: Date }): void {
    this.materialDate = event.value;
    this.task.dueDate = dayjs(this.materialDate).format('YYYY-MM-DD');
  }
  /**
   *
   */
  save() {
    // 新規登録
    if (this.modalType === 'add') {
      this.postTask().subscribe({
        next: () => {
          this.toastr.success('タスクが登録されました', '登録完了');
          this.modalClosed.emit();
        },
        error: (err) => {
          console.error('Error adding task:', err);
          this.toastr.error('タスクの登録に失敗しました', 'エラー');
        }
      });
    }
    // 更新
    if (this.modalType === 'edit') {
      this.putTask().subscribe({
        next: () => {
          this.toastr.success('タスクが更新されました', '更新完了');
          this.modalClosed.emit();
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.toastr.error('タスクの更新に失敗しました', 'エラー');
        }
      });
    }
    this.activeModal.close();
  }

  /**
   * 閉じる
   */
  close() {
    this.activeModal.close();
  }

  private getTask() {
    return this.tasksService.getTask(this.id as string).pipe(tap((result) => (this.task = result)));
  }

  private putTask(): Observable<unknown> {
    return this.tasksService.putTask(this.id as string, this.task);
  }

  private postTask(): Observable<unknown> {
    return this.tasksService.postTask(this.task);
  }

  private resetTask(): TaskGetResponseDto {
    return {
      id: '',
      title: '',
      statusId: 1,
      dueDate: undefined,
    };
  }
}
