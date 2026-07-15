import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { StorageService } from '../_services/storage.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private router: Router, private storage: StorageService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = this.normalizeRoles(route.data?.['roles']);
    if (!requiredRoles.length) return true;

    const userRole = this.storage.getRol();

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }
    if (userRole === 'admin' || requiredRoles.includes(userRole)) {
      return true;
    }

    this.router.navigate(['/inicio']);
    return false;
  }

  private normalizeRoles(roles: unknown): string[] {
    if (!roles) return [];
    if (typeof roles === 'string') return [roles];
    if (Array.isArray(roles)) return roles.filter((r): r is string => typeof r === 'string');
    return [];
  }
}
