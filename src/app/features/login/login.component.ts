import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'tms-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  isSubmitting = signal(false);
  error = signal('');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(12)]],
  });

  async onSubmit() {
    if (this.form.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.error.set('');

    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login({
        email: this.form.controls.email.value,
        password: this.form.controls.password.value,
      });
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.error.set('Invalid email or password.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
