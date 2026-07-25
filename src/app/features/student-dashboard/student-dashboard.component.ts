import { Component, signal, computed, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { CourseCardComponent } from "../../ui/course-card/course-card.component";
import { EnrollmentListComponent } from "../enrollment-list/enrollment-list.component";
import { EnrollmentSummaryComponent } from "../enrollment-summary/enrollment-summary.component";
import { Course } from "../../models/course.model";
import { CourseService } from "../../services/course.service";


@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [
    CourseCardComponent,
    EnrollmentSummaryComponent,
    EnrollmentListComponent
   ],
  templateUrl: "./student-dashboard.component.html",
  styleUrl: "./student-dashboard.component.scss",
})
export class StudentDashboardComponent {
  private api = inject(CourseService);

  studentName = signal("Liya Kebede");
  earnedCredits = signal(45);
  selectedCourse = signal<Course | null>(null);

  graduationStatus = computed(() =>
    this.earnedCredits() >= 120 ? "Eligible for Graduation" : "In Progress"
  );

  coursesResource = rxResource({
    stream: () => this.api.getAll(),
  });

  registerForClass() {
    this.earnedCredits.update((c) => c + 3);
  }

  handleEnroll(course: Course) {
    this.selectedCourse.set(course);
    console.log("Enrollment requested for:", course.title);
  }
}