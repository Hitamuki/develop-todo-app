import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { TasksService } from '../../api/api/tasks.service';
import { TaskGetResponseDto } from '../../api/model/task-get-response-dto';

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
  ],
  templateUrl: './task-add-edit.component.html',
  styleUrl: './task-add-edit.component.scss',
  providers: [MatNativeDateModule, { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' }],
})
export class TaskAddEditComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private tasksService = inject(TasksService);

  @Input() modalType!: 'add' | 'edit';
  @Input() id?: string;
  @Output() modalClosed = new EventEmitter<void>();

  task: TaskGetResponseDto = this.resetTask();

  /**
   *
   */
  ngOnInit(): void {
    // 初期化処理でpageTypeがeditの場合は、idを基に取得処理を実行
    if (this.modalType === 'edit') {
      this.getTask();
    }
  }

  /**
   *
   */
  save() {
    // 新規登録
    if (this.modalType === 'add') {
      this.postTask().subscribe({
        next: () => {
          this.modalClosed.emit();
        },
      });
    }
    // 更新
    if (this.modalType === 'edit') {
      this.putTask().subscribe({
        next: () => {
          this.modalClosed.emit();
        },
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
    this.tasksService.get(this.id as string).subscribe({
      next: (result) => {
        this.task = result;
      },
      error: (err) => console.error('Error fetching task:', err),
    });
  }

  private putTask(): Observable<unknown> {
    return this.tasksService.put(this.id as string, this.task);
  }

  private postTask(): Observable<unknown> {
    return this.tasksService.post(this.task);
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
