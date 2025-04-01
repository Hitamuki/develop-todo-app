import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';

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
