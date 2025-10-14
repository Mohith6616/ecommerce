import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

@Component({
  selector: 'app-real',
  standalone: false,
  templateUrl: './real.component.html',
  styleUrl: './real.component.scss'
})
export class RealComponent implements OnInit {
  username: string | null = null;

  constructor(private authService: AuthService, private rtr: Router, private auth: Auth) {}

  ngOnInit(): void {
    // Subscribe to auth changes and extract the email prefix (before @)
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user && user.email) {
        this.username = user.email.split('@')[0];
      } else {
        this.username = null;
      }
    });
  }

  logout() {
    this.authService.logout().then(() => alert('Logout Successful!'));
    this.rtr.navigate(['/']);
  }
}
