/**
 * List row from the TMS API — mirrors CourseResponseDto
 */
export interface Course {
  id: number;
  code: string;
  title: string;
  maxCapacity: number;
  enrollmentCount: number;
  status?: string;
}

/** Envelope for GET /api/courses */
export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/** One link from CourseDetailDto.Links */
export interface CourseLink {
  href: string;
  rel: string;
  method: string;
}

/** Detail payload — includes links */
export interface CourseDetail extends Course {
  links: readonly CourseLink[];
}