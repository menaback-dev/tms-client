import { Routes } from "@angular/router";
import { roleGuard } from "./guards/role.guard";

export const routes: Routes = [

    {
    path: 'register',
    loadComponent: () =>
        import('./features/register/register.component').then((m) => m.RegisterComponent),
    },
    {
    path: 'login',
    loadComponent: () =>
        import('./features/login/login.component').then((m) => m.LoginComponent),
    },
    {
    path: "courses/:id",
    loadComponent: () =>
      import("./features/course-detail/course-detail.component").then(
        (m) => m.CourseDetailComponent
      ),
    },
    
    {
    path: 'enroll',
    loadComponent: () => import('./features/enrollment-form/enrollment-form.component')
        .then(m => m.EnrollmentFormComponent)
    },

    {
    path: 'dashboard',
    loadComponent: () =>
        import('./features/instructor-dashboard/instructor-dashboard.component')
        .then(m => m.InstructorDashboardComponent),
    },

    {
    path: 'enrollments',
    loadComponent: () =>
        import('./features/enrollment-list/enrollment-list.component')
        .then(m => m.EnrollmentListComponent),
    },

    {
    path: 'grade-submission',
    loadComponent: () =>
        import('./features/grade-submission/grade-submission.component').then(
        (m) => m.GradeSubmissionComponent
        ),
    },
    {
    path: 'student-dashboard',
    loadComponent: () =>
        import('./features/student-dashboard/student-dashboard.component').then(
        (m) => m.StudentDashboardComponent
        ),
    },
    {
    path: 'admin/courses',
    loadComponent: () =>
    import('./features/admin-course-list/admin-course-list.component')
      .then(m => m.AdminCourseListComponent),
    canActivate: [roleGuard('Admin')]
    },
    {
    path: 'unauthorized',
    loadComponent: () =>
        import('./features/unauthorized/unauthorized.component')
        .then(m => m.UnauthorizedComponent),
    },

    { path: "", redirectTo: "register", pathMatch: "full" },
    ];