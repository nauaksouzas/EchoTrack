-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "account_status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "invite_token" TEXT,
    "avatar_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "manager_id" TEXT,
    "instructor_pathway_id" TEXT,
    CONSTRAINT "users_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "users_instructor_pathway_id_fkey" FOREIGN KEY ("instructor_pathway_id") REFERENCES "pathways" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "communities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "program_manager_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "communities_program_manager_id_fkey" FOREIGN KEY ("program_manager_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pathways" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "instructor_id" TEXT,
    "schedule" TEXT,
    "pathway_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "classes_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "classes_pathway_id_fkey" FOREIGN KEY ("pathway_id") REFERENCES "pathways" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "coach_id" TEXT,
    "program_manager_id" TEXT,
    "community_id" TEXT,
    "pathway_id" TEXT,
    "phone" TEXT,
    "bio" TEXT,
    "accent_color" TEXT NOT NULL DEFAULT '#FF7A00',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "student_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "student_profiles_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "student_profiles_program_manager_id_fkey" FOREIGN KEY ("program_manager_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "student_profiles_community_id_fkey" FOREIGN KEY ("community_id") REFERENCES "communities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "student_profiles_pathway_id_fkey" FOREIGN KEY ("pathway_id") REFERENCES "pathways" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_class_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_profile_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "student_class_enrollments_student_profile_id_fkey" FOREIGN KEY ("student_profile_id") REFERENCES "student_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "student_class_enrollments_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "report_cycles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "pathway_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "report_cycles_pathway_id_fkey" FOREIGN KEY ("pathway_id") REFERENCES "pathways" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "weekly_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "cycle_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "submitted_at" DATETIME,
    "energy" INTEGER DEFAULT 5,
    "mood" INTEGER DEFAULT 5,
    "attendance" INTEGER DEFAULT 100,
    "confidence" INTEGER DEFAULT 5,
    "weekly_topic" TEXT,
    "highlights" TEXT,
    "academic_progress" TEXT,
    "class_experience" TEXT,
    "instructor_support" TEXT,
    "events" TEXT,
    "upcoming_events" TEXT,
    "challenges_text" TEXT,
    "challenges_tags" TEXT NOT NULL DEFAULT '[]',
    "support_needed" TEXT,
    "needs_support" BOOLEAN NOT NULL DEFAULT false,
    "reflection" TEXT,
    "goals" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "weekly_reports_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "weekly_reports_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "report_cycles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "class_ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "report_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "rating" TEXT NOT NULL DEFAULT 'MEETING',
    "comment" TEXT,
    CONSTRAINT "class_ratings_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "weekly_reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "class_ratings_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "coach_feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "report_id" TEXT NOT NULL,
    "coach_id" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "coach_feedbacks_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "weekly_reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "coach_feedbacks_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "targeted_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "creator_id" TEXT,
    "question" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "cycle_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "targeted_questions_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "targeted_questions_cycle_id_fkey" FOREIGN KEY ("cycle_id") REFERENCES "report_cycles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "targeted_answers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "targeted_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "targeted_questions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "targeted_answers_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "weekly_reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "targeted_answers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'GENERAL',
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "alerts_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "link" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actor_id" TEXT,
    "actor_role" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "organization_name" TEXT NOT NULL DEFAULT 'KSP Dominion Group',
    "product_name" TEXT NOT NULL DEFAULT 'EchoTrack',
    "primary_color" TEXT NOT NULL DEFAULT '#FF7A00',
    "weekly_due_day" INTEGER NOT NULL DEFAULT 5,
    "weekly_due_hour" INTEGER NOT NULL DEFAULT 17,
    "auto_close_cycles" BOOLEAN NOT NULL DEFAULT false,
    "alert_threshold_energy" INTEGER NOT NULL DEFAULT 3,
    "alert_threshold_mood" INTEGER NOT NULL DEFAULT 3,
    "alert_threshold_attend" INTEGER NOT NULL DEFAULT 70,
    "alert_threshold_conf" INTEGER NOT NULL DEFAULT 3,
    "outlook_enabled" BOOLEAN NOT NULL DEFAULT false,
    "brightspace_enabled" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_invite_token_key" ON "users"("invite_token");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_user_id_key" ON "student_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_class_enrollments_student_profile_id_class_id_key" ON "student_class_enrollments"("student_profile_id", "class_id");

-- CreateIndex
CREATE INDEX "weekly_reports_student_id_idx" ON "weekly_reports"("student_id");

-- CreateIndex
CREATE INDEX "weekly_reports_cycle_id_idx" ON "weekly_reports"("cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "weekly_reports_student_id_cycle_id_key" ON "weekly_reports"("student_id", "cycle_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_ratings_report_id_class_id_key" ON "class_ratings"("report_id", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "targeted_answers_question_id_report_id_key" ON "targeted_answers"("question_id", "report_id");

-- CreateIndex
CREATE INDEX "alerts_student_id_idx" ON "alerts"("student_id");

-- CreateIndex
CREATE INDEX "alerts_resolved_idx" ON "alerts"("resolved");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_idx" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
