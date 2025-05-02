import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-message-modal',
  imports: [
  ],
  templateUrl: './message-modal.component.html',
  standalone: true,
  styleUrl: './message-modal.component.scss'
})
export class MessageModalComponent {
  @Input() message: string = '';
  @Input() title: string = '';
  @Input() author: string = '';
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
