import { Component, OnInit } from '@angular/core';
import { faTrash, faUpload, faPhone, faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { ContactService, Contact } from '../services/contact.service';
import { ToastService } from '../services/toast.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
  imports: [FaIconComponent, NgIf, NgForOf, FormsModule],
  standalone: true
})
export class ContactsComponent implements OnInit {
  faUpload = faUpload;
  faPhone = faPhone;
  faAddressBook = faAddressBook;
  faTrash = faTrash;

  newContact: Contact = {
    email: '',
    emailType: '',
    id: undefined,
    phone: '',
    phoneType: ''
  };

  contacts: Contact[] = [];
  isLoadingContacts = false;
  isUploading = false;
  isDeleting = false;
  deletingId: number | null = null;
  showDeleteConfirm = false;

  constructor(
    private contactService: ContactService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {
    this.isLoadingContacts = true;
    this.contactService.getContacts().subscribe({
      next: (data) => {
        this.contacts = data;
        this.isLoadingContacts = false;
      },
      error: () => {
        this.toastService.error('Failed to load contacts');
        this.isLoadingContacts = false;
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[0-9\s\-]{7,15}$/;
    return phoneRegex.test(phone);
  }

  submitContact() {
    if (!this.newContact.phone || !this.newContact.email) {
      this.toastService.error('Phone and Email are required.');
      return;
    }

    if (!this.validatePhone(this.newContact.phone)) {
      this.toastService.error('Invalid phone number format.');
      return;
    }

    if (!this.validateEmail(this.newContact.email)) {
      this.toastService.error('Invalid email address.');
      return;
    }

    this.isUploading = true;
    this.newContact.emailType = 'contact';
    this.newContact.phoneType = 'contact';

    this.contactService.addContact(this.newContact).subscribe({
      next: (data) => {
        this.contacts.push(data);
        this.toastService.success('Contact added successfully!');
        this.newContact = {
          email: '',
          emailType: '',
          id: undefined,
          phone: '',
          phoneType: ''
        };
        this.isUploading = false;
      },
      error: () => {
        this.toastService.error('Failed to add contact.');
        this.isUploading = false;
      }
    });
  }

  deleteContact(id: number | undefined) {
    if (!id) return;
    this.deletingId = id;
    this.showDeleteConfirm = true;
  }

  confirmDelete() {
    if (!this.deletingId) return;

    this.isDeleting = true;

    this.contactService.deleteContact(this.deletingId).subscribe({
      next: () => {
        this.contacts = this.contacts.filter(c => c.id !== this.deletingId);
        this.toastService.success('Contact deleted successfully!');
        this.deletingId = null;
        this.showDeleteConfirm = false;
        this.isDeleting = false;
      },
      error: () => {
        this.toastService.error('Failed to delete contact.');
        this.deletingId = null;
        this.showDeleteConfirm = false;
        this.isDeleting = false;
      }
    });
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.deletingId = null;
  }
}
