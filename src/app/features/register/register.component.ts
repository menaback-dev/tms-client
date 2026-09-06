import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SiteNavbarComponent } from '../../ui/site-navbar/site-navbar.component';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tms-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, SiteNavbarComponent],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isSubmitting = signal(false);
  error = signal('');
  success = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(12)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    role: ['Student', Validators.required],
  });

  async onSubmit() {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.error.set('');
    this.success.set('');

    
   

    try {
    const res = await firstValueFrom(
      this.http.post<{ message: string; studentId?: string | null }>(
        '/api/auth/register',
        this.form.getRawValue()
      )
    );

    
    if (res.studentId) {
      sessionStorage.setItem('tms_student_id', res.studentId);
    }

    this.success.set('Account created. You can sign in now.');
    await this.router.navigateByUrl('/login');
  } catch {
      this.error.set('Registration failed. Check password policy and try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}