import {Component, OnInit} from '@angular/core';
import {
  faCalendarDays,
  faCheckCircle,
  faFilePdf,
  faListAlt,
  faPlus,
  faPlusCircle,
  faSave,
  faTrashAlt,
  faUpload,
  faEdit,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import {AcademicCalendarEvent, AcademicCalendarPayload, AcademicCalendarService} from '../../services/calendar.servcie'; // ✅ Add your custom toast service import

@Component({
  selector: 'app-academic-calendar',
  templateUrl: './academic-calender.component.html',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgClass,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./academic-calender.component.scss']
})
export class AcademicCalendarComponent implements OnInit {
  // FontAwesome icons
  faCalendarDays = faCalendarDays;
  faUpload = faUpload;
  faFilePdf = faFilePdf;
  faCheckCircle = faCheckCircle;
  faPlus = faPlus;
  faPlusCircle = faPlusCircle;
  faListAlt = faListAlt;
  faSave = faSave;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faEye = faEye;

  constructor(private toastService: ToastService, private calendarService: AcademicCalendarService) {}

  // PDF file
  selectedPdfFileName: string = 'Select PDF';
  calendarPdfUrl: string | null = null;
  existingPdfUrl: string | null = null;
  pdfError: string | null = null;
  showDeleteConfirm: boolean = false;
  isSubmittingCalendar: boolean = false;
  isLoadingEvents: boolean = false;
  isDeleting: boolean = false;

  // Event model
  newEvent = {
    id: undefined,
    month: '',
    title: '',
    date: '',
    type: '',
    day: 1
  };

  // Events list
  calendarEvents:AcademicCalendarEvent[] = [];

  existingEvents: AcademicCalendarPayload = {
    id: 0,
    calendarPdfUrl: '',
    events: []
  };

  months: string[] = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  ngOnInit(): void {
    this.loadExistingEvents();
  }

  loadExistingEvents(): void {
    this.isLoadingEvents = true;
    this.calendarService.getCalendarData().subscribe({
      next: (data) => {
        this.existingEvents = data;
        this.existingPdfUrl = data.calendarPdfUrl || null;
        this.isLoadingEvents = false;
      },
      error: () => {
        this.toastService.error('Failed to load academic calendar data');
        this.isLoadingEvents = false;
        this.existingEvents = {
          id: 0,
          calendarPdfUrl: '',
          events: []
        }
      }
    });
  }

  // Handle calendar PDF selection
  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.pdfError = null;
    this.calendarPdfUrl = null;

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.toastService.error('PDF file size must be under 2 MB.');
      return;
    }
    this.selectedPdfFileName = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      this.calendarPdfUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // Add a new event to the list
  addCalendarEvent(): void {
    const { month, title, day, type } = this.newEvent;

    if (!month || !title || !day || !type) {
      this.toastService.error('Please fill all fields to add an event.');
      return;
    }

    if (day < 1 || day > 31) {
      this.toastService.error('Day must be between 1 and 31.');
      return;
    }

    if (
      (day > 30 && ['April', 'June', 'August', 'September', 'November'].includes(month)) ||
      (day > 29 && month === 'February')
    ) {
      this.toastService.error('Invalid date for this month.');
      return;
    }

    const monthIndex = this.months.indexOf(month);
    const year = new Date().getFullYear();


    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const monthEdit = monthAbbreviations[monthIndex];
    this.newEvent.date = `${day.toString().padStart(2, '0')} ${monthEdit} ${year}`;

    this.calendarEvents.push({ ...this.newEvent });

    console.log("Calendar events:", this.calendarEvents);

    this.toastService.success('Event added successfully.');

    // Reset form
    this.newEvent = {
      id: undefined,
      month: '',
      title: '',
      type: '',
      date: '',
      day: 1
    };
  }

  // Remove an event from list
  removeCalendarEvent(index: number): void {
    this.calendarEvents.splice(index, 1);
  }

  // Final submission handler
  submitAcademicCalendar(): void {
    if (!this.calendarPdfUrl || !this.calendarEvents.length) {
      this.toastService.error('Upload a PDF and add events first.');
      return;
    }
    this.isSubmittingCalendar = true;
    const payload: AcademicCalendarPayload = {
      id: undefined,
      calendarPdfUrl: this.calendarPdfUrl,
      events: this.calendarEvents
    };

    this.calendarService.saveAcademicCalendar(payload).subscribe({
      next: () => {
        this.toastService.success('Calendar saved successfully');
        this.calendarEvents = [];
        this.loadExistingEvents();
        this.isSubmittingCalendar = false;
      },
      error: () => {
        this.toastService.error('Failed to save calendar');
        this.isSubmittingCalendar = false;
      }
    });
    // Reset form
    this.newEvent = {
      id: undefined,
      month: '',
      title: '',
      type: '',
      date: '',
      day: 1
    };
    this.selectedPdfFileName = 'Select PDF';
    this.calendarPdfUrl = null;
  }

  deleteEvent(index: number|undefined, pdfUrl: string): void {
    // const updatedEvents = [...this.existingEvents];
    // updatedEvents.splice(index, 1);
    if (!index) return;
    this.isDeleting = true;
    this.calendarService.deleteEvent(index, pdfUrl).subscribe({
      next: () => {
        this.toastService.success('Event deleted');
        this.showDeleteConfirm = false;
        this.loadExistingEvents();
        this.isDeleting = false;
      },
      error: () => {
        this.toastService.error('Failed to delete event')
        this.showDeleteConfirm = false;
        this.isDeleting = false;
      }
    });
  }

  showDeleteModal() {
    this.showDeleteConfirm = true;
  }
  cancelDelete() {
    this.showDeleteConfirm = false;
  }
}
