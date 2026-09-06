import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tms-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = this.auth.currentUser()?.displayName ?? 'Admin';

  logout() {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}