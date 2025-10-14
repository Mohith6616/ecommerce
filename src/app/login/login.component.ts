import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  registeredMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private rtr: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const registered = this.route.snapshot.queryParamMap.get('registered');
    if (registered === 'true') {
      this.registeredMessage = 'Registration successful. Please login with your new account.';
    }
  }

  async onlogin() {
    if (this.loading) return;
    this.loading = true;
    try {
      await this.authService.login(this.email, this.password);
      alert('✅ Login Successful!');
      await this.rtr.navigate(['/real']);
    } catch (error: any) {
      console.error('Login Error:', error);

      // Prefer mapping on error.code (SDK), otherwise fall back to error.message
      const code = error?.code;
      if (code) {
        switch (code) {
          case 'auth/invalid-email':
            alert('❌ Invalid email format.');
            break;
          case 'auth/user-not-found':
            alert('⚠️ No user found with this email.');
            break;
          case 'auth/wrong-password':
            alert('❌ Incorrect password.');
            break;
          case 'auth/too-many-requests':
            alert('⚠️ Too many failed attempts. Try again later.');
            break;
          case 'auth/network-request-failed':
            alert('🌐 Network error. Check your internet connection.');
            break;
          default:
            alert('⚠️ ' + (error.message || 'Unexpected error occurred. Please try again.'));
            break;
        }
      } else {
        alert('⚠️ ' + (error?.message || 'Unexpected error occurred. Please try again.'));
      }
    } finally {
      this.loading = false;
    }

  }
}
