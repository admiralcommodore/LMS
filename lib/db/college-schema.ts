'use server';

// Database Schema Types for College Student Management System
// This file defines the database structure for the simplified college management system

// ─── User Schema ────────────────────────────────────────────────────────────────

export interface DBUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar?: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  emailVerified: boolean;
  phone?: string;
  country?: string;
  
  // Profile
  bio?: string;
  
  // Settings
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// ─── Student Registration Schema ─────────────────────────────────────────────────

export interface DBStudentRegistration {
  id: string;
  userId: string;
  registrationNumber?: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationalId: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  
  // Academic Information
  previousSchool: string;
  previousSchoolAddress: string;
  yearOfCompletion: number;
  examinationBoard: string;
  indexNumber: string;
  
  // Program Information
  programId: string;
  programName: string;
  department: string;
  intake: string;
  studyMode: 'full_time' | 'part_time' | 'distance_learning';
  
  // Guardian Information
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianRelationship: string;
  guardianAddress: string;
  
  // Status
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'payment_pending' | 'payment_completed' | 'registered';
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  
  // Timestamps
  submittedAt: Date;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBRegistrationDocument {
  id: string;
  registrationId: string;
  type: 'national_id' | 'birth_certificate' | 'academic_transcripts' | 'passport_photo' | 'other';
  name: string;
  url: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
}

export interface DBRegistrationPayment {
  id: string;
  registrationId: string;
  amount: number;
  currency: string;
  method: 'mpesa' | 'card' | 'bank_transfer' | 'cash';
  transactionId?: string;
  providerResponse?: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  failureReason?: string;
  paidAt?: Date;
  createdAt: Date;
  refundedAt?: Date;
}

// ─── Program & Department Schema ────────────────────────────────────────────────

export interface DBProgram {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  departmentName: string;
  duration: number; // in years
  description: string;
  requirements: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBDepartment {
  id: string;
  code: string;
  name: string;
  headOfDepartmentId?: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Student Profile Schema ──────────────────────────────────────────────────────

export interface DBStudentProfile {
  id: string;
  userId: string;
  registrationId: string;
  registrationNumber: string;
  programId: string;
  programName: string;
  department: string;
  intake: string;
  studyMode: 'full_time' | 'part_time' | 'distance_learning';
  currentYear: number;
  currentSemester: 'first' | 'second' | 'summer';
  currentAcademicYear: string;
  gpa?: number;
  cgpa?: number;
  totalCreditsEarned: number;
  status: 'active' | 'probation' | 'suspended' | 'graduated' | 'withdrawn';
  advisorId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Course Offering Schema ───────────────────────────────────────────────────────

export interface DBCourseOffering {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  department: string;
  credits: number;
  description: string;
  prerequisiteCourseIds: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBInstructorAssignment {
  id: string;
  instructorId: string;
  instructorName: string;
  courseOfferingId: string;
  courseCode: string;
  courseName: string;
  department: string;
  academicYear: string;
  semester: 'first' | 'second' | 'summer';
  assignedBy: string;
  assignedAt: Date;
  isActive: boolean;
}

// ─── Semester Registration Schema ─────────────────────────────────────────────────

export interface DBSemesterRegistration {
  id: string;
  studentProfileId: string;
  academicYear: string;
  semester: 'first' | 'second' | 'summer';
  totalCredits: number;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
}

export interface DBRegisteredCourse {
  id: string;
  semesterRegistrationId: string;
  courseOfferingId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  instructorId?: string;
  createdAt: Date;
}

// ─── Result Schema ───────────────────────────────────────────────────────────────

export interface DBExamResult {
  id: string;
  studentProfileId: string;
  registrationNumber: string;
  studentName: string;
  
  // Exam Details
  academicYear: string;
  semester: 'first' | 'second' | 'summer';
  courseOfferingId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  instructorId: string;
  instructorName: string;
  
  // Scores
  cat1Score?: number;
  cat2Score?: number;
  assignmentScore?: number;
  finalExamScore: number;
  totalScore: number;
  
  // Grade
  grade: 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F' | 'I' | 'W';
  gradePoints: number;
  
  // Status
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  remarks?: string;
  
  // Approval
  submittedBy: string;
  submittedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface DBSemesterResult {
  id: string;
  studentProfileId: string;
  registrationNumber: string;
  studentName: string;
  programName: string;
  department: string;
  
  academicYear: string;
  semester: 'first' | 'second' | 'summer';
  
  totalCredits: number;
  semesterGPA: number;
  previousCGPA: number;
  newCGPA: number;
  
  status: 'published' | 'unpublished';
  publishedBy?: string;
  publishedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// ─── Fee Structure Schema ────────────────────────────────────────────────────────

export interface DBFeeStructure {
  id: string;
  programId: string;
  programName: string;
  academicYear: string;
  studyMode: 'full_time' | 'part_time' | 'distance_learning';
  
  tuitionFee: number;
  registrationFee: number;
  libraryFee: number;
  laboratoryFee: number;
  examinationFee: number;
  studentUnionFee: number;
  medicalFee: number;
  otherFees: { name: string; amount: number }[];
  
  totalFee: number;
  currency: string;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── System Settings Schema ──────────────────────────────────────────────────────

export interface DBSystemSettings {
  id: string;
  currentAcademicYear: string;
  currentSemester: 'first' | 'second' | 'summer';
  registrationOpen: boolean;
  resultPublicationOpen: boolean;
  collegeName: string;
  collegeLogo?: string;
  collegeAddress: string;
  collegePhone: string;
  collegeEmail: string;
  website?: string;
  
  gradeScale: {
    grade: string;
    points: number;
    minScore: number;
    maxScore: number;
  }[];
  
  currency: string;
  paymentMethods: string[];
  
  updatedAt: Date;
}

// ─── Notification Schema ─────────────────────────────────────────────────────────

export interface DBNotification {
  id: string;
  userId: string;
  type: 'registration_status' | 'payment_status' | 'result_published' | 'general';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  
  isRead: boolean;
  readAt?: Date;
  
  createdAt: Date;
  expiresAt?: Date;
}

// ─── Audit Log Schema ────────────────────────────────────────────────────────────

export interface DBAuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
