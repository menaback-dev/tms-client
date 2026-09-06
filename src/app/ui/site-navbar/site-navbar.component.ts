import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'tms-site-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-navbar.component.html',
})
export class SiteNavbarComponent {}