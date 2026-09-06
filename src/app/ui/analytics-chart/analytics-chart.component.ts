import { Component, computed, input } from '@angular/core';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'tms-analytics-chart',
  standalone: true,
  templateUrl: './analytics-chart.component.html',
})
export class AnalyticsChartComponent {
  data = input.required<Enrollment[]>();

  private maxBar = 160;

  approvedCount = computed(
    () => this.data().filter((e) => e.status === 'Approved').length
  );
  pendingCount = computed(
    () => this.data().filter((e) => e.status === 'Pending').length
  );
  rejectedCount = computed(
    () => this.data().filter((e) => e.status === 'Rejected').length
  );

  private scale(count: number): number {
    const max = Math.max(
      this.approvedCount(),
      this.pendingCount(),
      this.rejectedCount(),
      1
    );
    return Math.max(24, (count / max) * this.maxBar);
  }

  approvedHeight = computed(() => this.scale(this.approvedCount()));
  pendingHeight = computed(() => this.scale(this.pendingCount()));
  rejectedHeight = computed(() => this.scale(this.rejectedCount()));
}