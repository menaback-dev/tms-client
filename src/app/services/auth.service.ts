import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TmsUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>(null);
  currentUser = signal<TmsUser | null>(null);

  getAccessToken() : string | null {
    return this.accessToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginRequest) :Promise<void> {
    const res = await firstValueFrom(
        this.http.post<AuthResponse>('/api/auth/login', credentials)
    );

    this.accessToken.set(res.accessToken);

    const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
    const id =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
      payload.sub ??
      '';
    const role =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload.role ??
      'Student';
    
    this.currentUser.set({
        id: String(id),
        email: payload.email ?? payload.sub ?? credentials.email,
        displayName: payload.FirstName ?? payload.name ?? credentials.email,
        role: Array.isArray(role) ? role[0] : String(role),
    });
  console.log('SESSION', this.getAccessToken()?.slice(0, 20), this.currentUser());
}

    async register(payload: RegisterRequest): Promise<void> {
      await firstValueFrom(
        this.http.post('/api/auth/register', payload)
      );
    }
    logout(): void {
        this.accessToken.set(null);
        this.currentUser.set(null);
    }

    private readRoleFromToken(accessToken: string): string {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const roleClaim =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
        payload.role ??
        payload.roles;

      if (Array.isArray(roleClaim)) return String(roleClaim[0] ?? 'Student');
      return String(roleClaim ?? 'Student');
    }

    dashboardUrlForRole(role: string): string {
      switch (role) {
        case 'Admin':
          return 'admin/dashboard';
        case 'Instructor':
          return 'instructor/dashboard';
        case 'Student':
        default:
          return 'student/dashboard';
      }
    }

  private readUserIdFromToken(accessToken: string): string {
  const payload = JSON.parse(atob(accessToken.split('.')[1]));
  return (
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier'] ??
    payload.sub ??
    payload.nameid ??
    ''
  );
}
    
}