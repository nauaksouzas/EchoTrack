import { User, WeeklyReport, CustomQuestion, Group, StaffInvitation } from '../types';

const STORAGE_KEY = 'yearup_weekly_report_data';

const getInitialData = () => {
  return {
    users: [{
      id: "pm-kayla",
      fullName: "Kayla Casiano",
      email: "kcasiano@yearupunited.org",
      username: "kcasiano",
      role: "pm",
      password: "Yearup123456!",
      createdAt: new Date().toISOString()
    }],
    reports: [],
    questions: [],
    groups: [],
    staff_invitations: []
  };
};

const getDb = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial = getInitialData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

const saveDb = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const dataService = {
  // Common listeners pattern
  listeners: {
    invitations: new Set<Function>(),
    reports: new Set<Function>(),
    questions: new Set<Function>(),
    users: new Set<Function>(),
    groups: new Set<Function>()
  },

  notify(collection: string) {
    const db = getDb();
    if ((this.listeners as any)[collection]) {
      (this.listeners as any)[collection].forEach((cb: Function) => cb(db[collection]));
    }
  },

  ensureSeedData() {
    const db = getDb();
    let kaylaIndex = db.users.findIndex((u: User) => u.id === 'pm-kayla');
    if (kaylaIndex >= 0) {
      db.users[kaylaIndex] = {
        ...db.users[kaylaIndex],
        fullName: "Kayla Casiano",
        email: "kcasiano@yearupunited.org",
        username: "kcasiano",
        role: "pm",
        password: "Yearup123456!"
      };
    } else {
      db.users.push({
        id: "pm-kayla",
        fullName: "Kayla Casiano",
        email: "kcasiano@yearupunited.org",
        username: "kcasiano",
        role: "pm",
        password: "Yearup123456!",
        createdAt: new Date().toISOString()
      });
    }
    saveDb(db);
  },

  resetPrototypeData() {
    localStorage.removeItem(STORAGE_KEY);
    this.ensureSeedData();
    window.location.reload();
  },

  // Users
  async saveUser(user: User) {
    const db = getDb();
    const existingIndex = db.users.findIndex((u: User) => u.id === user.id);
    if (existingIndex >= 0) {
      db.users[existingIndex] = user;
    } else {
      db.users.push(user);
    }
    saveDb(db);
    this.notify('users');
  },

  async getUser(uid: string) {
    const db = getDb();
    return db.users.find((u: User) => u.id === uid) || null;
  },

  subscribeToAllUsers(callback: (users: User[]) => void) {
    this.listeners.users.add(callback);
    callback(getDb().users);
    return () => this.listeners.users.delete(callback);
  },

  // Staff Management
  async inviteStaff(email: string, role: string, invitedBy: string) {
    const db = getDb();
    const id = email.toLowerCase();
    db.staff_invitations.push({
      id,
      email: id,
      role,
      invitedBy,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    saveDb(db);
    this.notify('invitations');
  },

  async acceptInvitation(email: string) {
    const db = getDb();
    const id = email.toLowerCase();
    const inv = db.staff_invitations.find((i: StaffInvitation) => i.id === id);
    if (inv) {
      inv.status = 'accepted';
      saveDb(db);
      this.notify('invitations');
    }
  },

  subscribeToInvitations(callback: (invites: StaffInvitation[]) => void) {
    this.listeners.invitations.add(callback);
    callback(getDb().staff_invitations);
    return () => this.listeners.invitations.delete(callback);
  },

  // Reports
  async submitReport(report: Omit<WeeklyReport, 'id' | 'submittedAt'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const db = getDb();
    const submittedAt = new Date().toISOString();
    db.reports.push({
      ...report,
      id,
      submittedAt
    });
    saveDb(db);
    this.notify('reports');
  },

  async syncToSheets(range: string, values: any[]) {
    console.log("Mock sync to sheets:", range, values);
  },

  async exportToDoc(title: string, content: string) {
    console.log("Mock export to doc:", title, content);
    throw new Error("Google Docs export not configured in this prototype.");
  },

  subscribeToReports(studentId: string, callback: (reports: WeeklyReport[]) => void) {
    const cb = (allReports: WeeklyReport[]) => {
      const studentReports = allReports.filter((r) => r.studentId === studentId);
      studentReports.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      callback(studentReports);
    };
    this.listeners.reports.add(cb);
    cb(getDb().reports);
    return () => this.listeners.reports.delete(cb);
  },

  subscribeToAllReports(callback: (reports: WeeklyReport[]) => void) {
    const cb = (allReports: WeeklyReport[]) => {
      const sorted = [...allReports].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      callback(sorted);
    };
    this.listeners.reports.add(cb);
    cb(getDb().reports);
    return () => this.listeners.reports.delete(cb);
  },

  // Questions
  async saveQuestion(question: Omit<CustomQuestion, 'id' | 'createdAt'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const db = getDb();
    db.questions.push({
      ...question,
      id,
      createdAt: new Date().toISOString()
    });
    saveDb(db);
    this.notify('questions');
  },

  async deleteQuestion(id: string) {
    const db = getDb();
    const question = db.questions.find((q: CustomQuestion) => q.id === id);
    if (question) {
      question.active = false;
      saveDb(db);
      this.notify('questions');
    }
  },

  subscribeToQuestions(callback: (questions: CustomQuestion[]) => void) {
    const cb = (allQuestions: CustomQuestion[]) => callback(allQuestions.filter((q) => q.active));
    this.listeners.questions.add(cb);
    cb(getDb().questions);
    return () => this.listeners.questions.delete(cb);
  },

  // Group Management
  async addGroup(name: string, pmId: string) {
    const db = getDb();
    const id = Math.random().toString(36).substr(2, 9);
    db.groups.push({
      id,
      name,
      pmId,
      coachIds: [],
      studentIds: [],
      createdAt: new Date().toISOString()
    });
    saveDb(db);
    this.notify('groups');
  },

  async updateGroup(group: Group) {
    const db = getDb();
    const idx = db.groups.findIndex((g: Group) => g.id === group.id);
    if (idx >= 0) {
      db.groups[idx] = { ...db.groups[idx], ...group };
      saveDb(db);
      this.notify('groups');
    }
  },

  subscribeToGroups(callback: (groups: Group[]) => void) {
    const cb = (allGroups: Group[]) => callback([...allGroups].sort((a, b) => a.name.localeCompare(b.name)));
    this.listeners.groups.add(cb);
    cb(getDb().groups);
    return () => this.listeners.groups.delete(cb);
  },

  // Utils
  isReportWindowOpen() {
    return true; // Always open for testing
  }
};

