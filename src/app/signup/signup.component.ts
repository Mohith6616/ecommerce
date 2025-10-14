import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  email='';
  password='';
  confirmPassword='';
  constructor(private authService:AuthService, private rtr:Router){}

  async onSignup(){
    if(this.password !== this.confirmPassword){
      alert('Passwords do not match.');
      return;
    }
    // If a user already exists in Firestore with this email, redirect them to login instead
    try{
      const existing = await this.authService.findUserByEmail(this.email);
      if(existing){
        // Could show a nicer inline message in the template; for now keep parity with existing alerts
        alert('An account with this email already exists. Redirecting to login.');
        await this.rtr.navigate(['/login']);
        return;
      }
    }catch(e){
      // Non-fatal: if the lookup fails, proceed with signup attempt and let signup handle errors.
      console.error('Email lookup failed before signup', e);
    }
    try{
      await this.authService.signup(this.email,this.password);
      // Navigate to login and indicate registration success so the login page can show a message
      await this.rtr.navigate(['/login'], { queryParams: { registered: 'true' } });
    }catch(err:any){
      // console.error('signup error', err);
      // const code = err?.code || err?.message || '';
      // const msg = this.mapFirebaseError(code);
      // alert(msg);
      alert(err?.message || 'Sign-up failed. Please check your credentials.');
    }
    
  }
  // private mapFirebaseError(code: string){
  //   if(!code) return 'Sign-up failed. Please try again.';
  //   if(code.includes('email-already-in-use')) return 'That email is already registered. Please login or use a different email.';
  //   if(code.includes('invalid-email')) return 'The email address is not valid.';
  //   if(code.includes('weak-password')) return 'The password is too weak. Use at least 6 characters.';
  //   return typeof code === 'string' ? code : 'Sign-up failed. Please try again.';
  // }
}
