import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {isPlatformServer} from '@angular/common';
import {environment} from '../../../environments/environment';

export interface Contact {
  id?: number;
  phone: string;
  email: string;
  phoneType: string;
  emailType: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private baseUrl = '';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformServer(this.platformId)) {
      this.baseUrl = global['API_URL'].trim(); // SSR context
    } else {
      this.baseUrl = environment.apiUrl; // Browser context
    }
    this.baseUrl = this.baseUrl + '/api/contacts';
  }

  /**
   * Fetch all existing contacts from backend.
   */
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.baseUrl);
  }

  /**
   * Add or save a new contact.
   */
  addContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, contact);
  }

  /**
   * Delete a contact by ID.
   */
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
