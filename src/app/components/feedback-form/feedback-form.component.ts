import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  standalone: true,
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent {
  feedback = {
    name: '',
    email: '',
    message: ''
  };

  submitFeedback() {
    console.log('Feedback submitted:', this.feedback);
    alert('Thank you for your feedback!');
    // Here you would typically send this data to a backend server
  }
}

