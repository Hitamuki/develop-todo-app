import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { DatePipe, NgClass } from '@angular/common';

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
