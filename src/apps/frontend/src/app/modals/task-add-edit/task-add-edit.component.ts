import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../api/api/tasks.service';
import { TaskGetResponseDto } from '../../api/model/task-get-response-dto';

/**
 *
 */
@Component({
  selector: 'app-task-add-edit',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule],
  templateUrl: './task-add-edit.component.html',
  styleUrl: './task-add-edit.component.scss',
})
export class TaskAddEditComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private tasksService = inject(TasksService);
  @Input() modalType!: 'add' | 'edit';
  @Input() id?: string;
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
    // 登録
    if (this.modalType === 'add') {
      this.postTask();
    }
    // 更新
    if (this.modalType === 'edit') {
      this.putTask();
    }
    this.activeModal.close();
  }

  /**
   * 閉じる(リロード)
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

  private putTask() {
    this.tasksService.put(this.id as string, this.task).subscribe({
      error: (err) => console.error('Error fetching task:', err),
    });
  }

  private postTask() {
    this.tasksService.post(this.task).subscribe({
      error: (err) => console.error('Error fetching task:', err),
    });
  }

  private resetTask(): TaskGetResponseDto {
    return {
      id:'',
      title: '',
      statusId: 1,
      dueDate: undefined,
    };
  }
}
