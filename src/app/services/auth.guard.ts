import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return new Observable(sub => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => {
          if (user) sub.next(true);
          else sub.next(this.router.parseUrl('/login'));
          sub.complete();
        },
        (err) => {
          sub.next(this.router.parseUrl('/login'));
          sub.complete();
        }
      );
      return typeof unsubscribe === 'function' ? unsubscribe : undefined;
    });
  }
}
