import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ToastService} from '../services/toast.service';
import {AuthService} from '../services/auth.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, FaIconComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  loading = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private router: Router, private toastService: ToastService, private authService: AuthService) {}

  onLogin() {
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe(
      res => {
        this.loading = false;
        this.toastService.info('Login successful');
        this.router.navigate(['/admin/dashboard']);
      },
      err => {
        this.toastService.error('Login failed. Invalid username or password.');
        this.loading = false;
      }
    );
  }
}
