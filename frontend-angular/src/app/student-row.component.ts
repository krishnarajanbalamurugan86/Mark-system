import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[app-student-row]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td>{{ student?.regNo }}</td>
    <td>{{ student?.studentName }}</td>
    <td>
        <span class="course-badge" *ngFor="let course of student?.courses">
            {{ course }}
        </span>
        <span *ngIf="!student?.courses?.length" class="course-badge">General</span>
    </td>
  `,
  styles: [`
    .course-badge {
        display: inline-block;
        background-color: #e2e8f0;
        color: #333;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin-right: 4px;
        margin-bottom: 4px;
    }
  `]
})
export class StudentRowComponent implements OnChanges {
  @Input() student: any;

  // [USER REQUEST]: use ngOnChanges
  // This effortlessly tracks when a student property changes or is loaded without breaking the app
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['student']) {
      console.log('ngOnChanges triggered! Student data changed:', changes['student'].currentValue);
    }
  }
}
