import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tms-unauthorized',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  role = this.auth.currentUser()?.role ?? null;

  goHome() {
    const role = (this.auth.currentUser()?.role ?? '').toLowerCase();
    if (role === 'admin') {
      void this.router.navigateByUrl('/admin/dashboard');
    } else if (role === 'instructor') {
      void this.router.navigateByUrl('/instructor/dashboard');
    } else if (role === 'student') {
      void this.router.navigateByUrl('/student/dashboard');
    } else {
      void this.router.navigateByUrl('/login');
    }
  }

  logout() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}