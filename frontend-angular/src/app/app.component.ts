import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { StudentRowComponent } from './student-row.component';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StudentRowComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend-angular';
  groupedStudents: any[] = [];
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('Angular App Title from ENV:', environment.appTitle);
    this.fetchStudents();
  }

  fetchStudents() {
    this.http.get<any[]>('/api/marks').subscribe({
      next: (data) => {
        // Group the data by student Registration Number
        const grouped: any = {};
        data.forEach((record: any) => {
          const key = record.id || record.regNo || record.studentName;
          if (!grouped[key]) {
            grouped[key] = {
              regNo: record.regNo || `Backend-${record.id}`,
              studentName: record.studentName,
              courses: []
            };
          }
          if (record.courseCode && !grouped[key].courses.includes(record.courseCode)) {
            grouped[key].courses.push(record.courseCode);
          } else if (record.subject && !grouped[key].courses.includes(record.subject)) {
            grouped[key].courses.push(record.subject);
          }
        });
        
        this.groupedStudents = Object.values(grouped);
      },
      error: (err) => {
        console.error('Failed to fetch from backend', err);
        this.errorMessage = 'Could not load students. Is the Express backend running?';
      }
    });
  }
}
