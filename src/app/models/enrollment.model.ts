export interface Enrollment{
courseCode: string;
    id: string;
    studentId: number;
    studentName: string;
    courseId: number;
    courseName: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    enrolledAt: string;
}