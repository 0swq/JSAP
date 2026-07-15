import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const USER_KEY = 'auth-user';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const raw = window.localStorage.getItem(USER_KEY);

    if (!raw) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const stored = JSON.parse(raw);
      const token = stored?.data?.token ?? stored?.token;
      if (!token) {
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
