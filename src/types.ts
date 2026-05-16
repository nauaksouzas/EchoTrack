export type UserRole = 'ADMIN' | 'PROGRAM_MANAGER' | 'INSTRUCTOR' | 'COACH' | 'STUDENT';
export type AccountStatus = 'INVITED' | 'ACTIVE' | 'DEACTIVATED';
export type ReportStatus = 'NOT_STARTED' | 'DRAFT' | 'SUBMITTED' | 'REVIEWED';
export type CycleStatus = 'OPEN' | 'CLOSED';
export type PerformanceLevel = 'EXCEEDING' | 'MEETING' | 'APPROACHING' | 'BEGINNING';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertType =
  | 'LOW_ENERGY' | 'LOW_MOOD' | 'LOW_CONFIDENCE' | 'LOW_ATTENDANCE'
  | 'MISSED_REPORT' | 'CHALLENGE_FLAGGED' | 'SUPPORT_NEEDED'
  | 'LOW_PERFORMANCE' | 'GENERAL';

export const PERFORMANCE_LEVELS: { value: PerformanceLevel; label: string; color: string; bg: string }[] = [
  { value: 'EXCEEDING',   label: 'Exceeding',   color: '#16A34A', bg: '#F0FDF4' },
  { value: 'MEETING',     label: 'Meeting',     color: '#2563EB', bg: '#EFF6FF' },
  { value: 'APPROACHING', label: 'Approaching', color: '#EA580C', bg: '#FFF7ED' },
  { value: 'BEGINNING',   label: 'Beginning',   color: '#DC2626', bg: '#FEF2F2' },
];

export const ROLE_BADGE: Record<UserRole, { bg: string; text: string; border: string; label: string }> = {
  ADMIN:           { bg: 'bg-red-50',     text: 'text-red-600',     border: 'border-red-200',     label: 'Admin' },
  PROGRAM_MANAGER: { bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-200',  label: 'Program Manager' },
  INSTRUCTOR:      { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-200',  label: 'Instructor' },
  COACH:           { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-200',    label: 'Coach' },
  STUDENT:         { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', label: 'Student' },
};

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
