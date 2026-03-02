import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');
  loading = signal(false);
  passwordVisible = signal(false);
  forgotPasswordMode = signal(false);
  resetEmailSent = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility() {
    this.passwordVisible.update((v) => !v);
  }

  showForgotPassword() {
    this.forgotPasswordMode.set(true);
    this.errorMessage.set('');
    this.resetEmailSent.set(false);
  }

  showLogin() {
    this.forgotPasswordMode.set(false);
    this.errorMessage.set('');
    this.resetEmailSent.set(false);
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email!, password!);
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.errorMessage.set(this.getErrorMessage(err.code));
    } finally {
      this.loading.set(false);
    }
  }

  async onGoogleSignIn() {
    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.loginWithGoogle();
      await this.router.navigate(['/dashboard']);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        this.errorMessage.set(this.getErrorMessage(err.code));
      }
    } finally {
      this.loading.set(false);
    }
  }

  async onResetPassword() {
    const email = this.loginForm.get('email')?.value;
    if (!email) {
      this.errorMessage.set('Please enter your email address.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      await this.authService.resetPassword(email);
      this.resetEmailSent.set(true);
    } catch (err: any) {
      this.errorMessage.set(this.getErrorMessage(err.code));
    } finally {
      this.loading.set(false);
    }
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/popup-closed-by-user':
        return '';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}
