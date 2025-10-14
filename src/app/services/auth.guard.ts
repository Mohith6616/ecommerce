import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    // authState emits the current user or null. Use onAuthStateChanged and return the
    // unsubscribe function as the Observable teardown so the subscription is cleaned up.
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
      // onAuthStateChanged returns an unsubscribe function - return it directly so
      // Observable can call it when the subscriber unsubscribes.
      return typeof unsubscribe === 'function' ? unsubscribe : undefined;
    });
  }
}
