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
    try{
      const existing = await this.authService.findUserByEmail(this.email);
      if(existing){
        alert('An account with this email already exists. Redirecting to login.');
        await this.rtr.navigate(['/login']);
        return;
      }
    }catch(e){
      console.error('Email lookup failed before signup', e);
    }
    try{
      await this.authService.signup(this.email,this.password);
      await this.rtr.navigate(['/login'], { queryParams: { registered: 'true' } });
    }catch(err:any){
      alert(err?.message || 'Sign-up failed. Please check your credentials.');
    }
    
  }
}
