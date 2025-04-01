import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

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
