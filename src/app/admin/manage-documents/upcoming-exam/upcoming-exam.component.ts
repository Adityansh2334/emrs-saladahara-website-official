import { Component, OnInit } from '@angular/core';
import { faPlusCircle, faPlus, faListAlt, faTrashAlt, faUpload } from '@fortawesome/free-solid-svg-icons';
import { UpcomingExamService, UpcomingExam } from '../../services/upcoming-exam.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-upcoming-exam',
  templateUrl: './upcoming-exam.component.html',
  styleUrls: ['./upcoming-exam.component.scss'],
  imports: [FaIconComponent, NgForOf, FormsModule, NgIf],
  standalone: true,
})
export class UpcomingExamComponent implements OnInit {
  faPlusCircle = faPlusCircle;
  faPlus = faPlus;
  faListAlt = faListAlt;
  faTrashAlt = faTrashAlt;
  faUpload = faUpload;

  newExam: UpcomingExam = { name: '', classLevel: '', date: '', time: '',datetime: '' };
  upcomingExams: UpcomingExam[] = [];
  savedExams: UpcomingExam[] = [];
  showDeleteConfirm = false;
  deleteTargetId: number | null = null;
  minDateTime: string | undefined;
  isDeleting = false;
  isLoadingExams = false;

  classOptions: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  constructor(
    private examService: UpcomingExamService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadExams();
    const now = new Date();
    this.minDateTime = now.toISOString().slice(0, 16); // Format: 'YYYY-MM-DDTHH:mm'
  }

  loadExams() {
    this.isLoadingExams = true;
    this.examService.getExams().subscribe({
      next: (data) => {
        this.savedExams = data;
        this.isLoadingExams = false;
      },
      error: () => {
        this.toastService.error('Failed to load saved exams');
        this.isLoadingExams = false;
      },
    });
  }

  addExamLocally(): void {
    if (!this.newExam.name || !this.newExam.classLevel || !this.newExam.datetime) {
      this.toastService.error('Please fill in all required fields');
      return;
    }
    const classNum = Number(this.newExam.classLevel);

    if (isNaN(classNum) || classNum < 1 || classNum > 12) {
      this.toastService.error('Class must be a number between 1 and 12');
      return;
    }

    const datetime = new Date(this.newExam.datetime);
    const date = datetime.toISOString().split('T')[0]; // yyyy-mm-dd
    let time = datetime.toTimeString().split(' ')[0]; // HH:mm:ss
    time = time ? time.slice(0, 5) : 'TBD'; // Just HH:mm or TBD

    const formattedTime = time ? this.formatTo12Hour(time) : 'TBD';

    this.upcomingExams.push({
      name: this.newExam.name,
      classLevel: this.newExam.classLevel,
      date: date,
      time: formattedTime,
      datetime: this.newExam.datetime
    });

    // Clear inputs
    this.newExam = { name: '', classLevel: '', date: '', time: '', datetime: '' };
  }


  removeExam(index: number) {
    this.upcomingExams.splice(index, 1);
    this.toastService.info('Exam removed from list');
  }

  uploadExams() {
    if (!this.upcomingExams.length) {
      this.toastService.error('No exams to upload');
      return;
    }

    this.examService.uploadExams(this.upcomingExams).subscribe({
      next: () => {
        this.toastService.success('Exams uploaded successfully');
        this.upcomingExams = [];
        this.loadExams();
      },
      error: () => this.toastService.error('Failed to upload exams'),
    });
  }

  deleteExam(id: number|null) {
    if (!id) return;
    this.isDeleting = true;
    this.examService.deleteExam(id).subscribe({
      next: () => {
        this.toastService.success('Exam deleted successfully');
        this.deleteTargetId = null;
        this.showDeleteConfirm = false;
        this.isDeleting = false;
        this.loadExams();
      },
      error: () => {
        this.toastService.error('Failed to delete exam')
        this.deleteTargetId = null;
        this.isDeleting = false;
        this.showDeleteConfirm = false;
      }
    });
  }

  formatTo12Hour(time24: string): string {
    const [hour, minute] = time24.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hr = hour % 12 || 12;
    return `${hr}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

  confirmDeleteModal(id: number|null|undefined) {
    if (!id) return;
    this.deleteTargetId = id;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.deleteTargetId = null;
    this.showDeleteConfirm = false;
  }

}
