import { Component } from '@angular/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

/**
 *
 */
@Component({
  selector: 'app-task-add-edit',
  standalone: true,
  imports: [NgbDatepickerModule],
  templateUrl: './task-add-edit.component.html',
  styleUrl: './task-add-edit.component.scss'
})
export class TaskAddEditComponent {
  // 初期化処理でpageTypeがeditの場合は、idを基に取得処理を実行

  // 保存ボタン押下で登録/更新

  // 閉じる(リロード)
}
