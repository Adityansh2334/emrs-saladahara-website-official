import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    FaIconComponent
  ],
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent {
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  showPassword = false;

  otpSent = false;
  otpVerified = false;
  loading = false;

  constructor(
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  /** Step 1: Send OTP */
  sendOtp() {
    this.loading = true;
    this.authService.sendOtp().subscribe({
      next: () => {
        this.otpSent = true;
        this.toastService.success('OTP sent to the official admin email.');
      },
      error: (err) => {
        this.toastService.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /** Step 2: Verify OTP */
  verifyOtp() {
    if (!this.otp) {
      this.toastService.error('Enter the OTP sent to your email.');
      return;
    }

    this.loading = true;
    this.authService.verifyOtp(this.otp).subscribe({
      next: () => {
        this.otpVerified = true;
        this.toastService.success('OTP verified. You can now set a new password.');
      },
      error: (err) => {
        this.toastService.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /** Step 3: Update Password */
  updatePassword() {
    if (!this.newPassword || !this.confirmPassword) {
      this.toastService.info('Please fill out both password fields.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastService.error('Passwords do not match.');
      return;
    }

    this.loading = true;
    this.authService.updatePassword(this.newPassword).subscribe({
      next: () => {
        this.toastService.success('Password updated successfully.');
        this.resetState();
      },
      error: (err) => {
        this.toastService.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  /** Utility: Clear form state */
  private resetState() {
    this.email = '';
    this.otp = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.otpSent = false;
    this.otpVerified = false;
  }

  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEye = faEye;
}
