
export type Grade = 'Beginning' | 'Developing' | 'Approaching' | 'Proficient' | 'Exceeding';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  role: 'student' | 'coach' | 'pm' | 'instructor';
  password?: string; // prototype-only local auth, not production
  programManagerId?: string;
  coachId?: string;
  pathway?: string;
  instructors?: string[];
  classes?: string[];
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  pmId: string;
  coachIds: string[];
  studentIds: string[];
  createdAt: string;
}

export interface Highlight {
  id: string;
  content: string;
}

export interface WeeklyReport {
  id: string;
  studentId: string;
  submittedAt: string;
  weekEnding: string;
  topicToDiscuss: string;
  highlights: string[];
  grades: { [className: string]: Grade };
  modulesLessons: string;
  feelingsClasses: string;
  feelingsInstructors: string;
  pastWeekEvents: string;
  upcomingEvents: string;
  closingReflection: string;
  customQuestionAnswers: { [questionId: string]: string };
}

export interface CustomQuestion {
  id: string;
  creatorId: string;
  text: string;
  targetStudentIds: string[]; // empty means all students of this coach
  active: boolean;
  createdAt?: string;
}

export interface PathwayData {
  id: string;
  name: string;
  instructors: {
    name: string;
    classes: string[];
  }[];
}

export interface StaffInvitation {
  id: string; // The email of the invited staff
  email: string;
  role: 'pm' | 'coach' | 'instructor';
  invitedBy: string; // PM ID
  status: 'pending' | 'accepted';
  createdAt: string;
}
