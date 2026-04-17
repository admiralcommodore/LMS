'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  ExamResult,
  SemesterResult,
  CourseOffering,
  StudentProfile,
  GradeScale,
} from './college-types';
import { DEFAULT_GRADE_SCALE } from './college-types';

interface ResultsContextType {
  examResults: ExamResult[];
  semesterResults: SemesterResult[];
  courseOfferings: CourseOffering[];
  studentProfiles: StudentProfile[];
  loading: boolean;
  
  // Exam Results CRUD
  createExamResult: (data: any) => Promise<ExamResult>;
  getExamResults: (filters?: { studentProfileId?: string; academicYear?: string; semester?: string }) => Promise<ExamResult[]>;
  getExamResultById: (id: string) => Promise<ExamResult | null>;
  updateExamResult: (id: string, data: Partial<ExamResult>) => Promise<void>;
  deleteExamResult: (id: string) => Promise<void>;
  submitExamResult: (id: string) => Promise<void>;
  approveExamResult: (id: string) => Promise<void>;
  rejectExamResult: (id: string, reason: string) => Promise<void>;
  
  // Semester Results
  createSemesterResult: (data: any) => Promise<SemesterResult>;
  getSemesterResults: (studentProfileId?: string) => Promise<SemesterResult[]>;
  publishSemesterResult: (id: string) => Promise<void>;
  
  // Course Offerings
  getCourseOfferings: () => Promise<CourseOffering[]>;
  createCourseOffering: (data: any) => Promise<CourseOffering>;
  updateCourseOffering: (id: string, data: Partial<CourseOffering>) => Promise<void>;
  deleteCourseOffering: (id: string) => Promise<void>;
  
  // Student Profiles
  getStudentProfiles: () => Promise<StudentProfile[]>;
  getStudentProfileByRegistration: (registrationNumber: string) => Promise<StudentProfile | null>;
  
  // Grade Calculation
  calculateGrade: (score: number) => { grade: GradeScale; points: number };
  calculateGPA: (results: ExamResult[]) => number;
  calculateCGPA: (semesterResults: SemesterResult[]) => number;
}

const ResultsContext = createContext<ResultsContextType | undefined>(undefined);

export function ResultsProvider({ children }: { children: React.ReactNode }) {
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [semesterResults, setSemesterResults] = useState<SemesterResult[]>([]);
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCourseOfferings();
    loadStudentProfiles();
    loadExamResults();
    loadSemesterResults();
  }, []);

  const loadCourseOfferings = async () => {
    // Mock data - replace with API call
    const mockCourseOfferings: CourseOffering[] = [
      {
        id: 'course-1',
        code: 'CP 412',
        name: 'C# Programming',
        departmentId: 'dept-1',
        department: 'School of Computing',
        credits: 9,
        description: 'Advanced C# Programming',
        prerequisiteCourseIds: [],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'course-2',
        code: 'CT 312',
        name: 'Computer Maintenance',
        departmentId: 'dept-1',
        department: 'School of Computing',
        credits: 9,
        description: 'Computer Maintenance and Repair',
        prerequisiteCourseIds: ['course-1'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'course-3',
        code: 'CS 201',
        name: 'Data Structures',
        departmentId: 'dept-1',
        department: 'School of Computing',
        credits: 8,
        description: 'Advanced data structures and algorithms',
        prerequisiteCourseIds: ['course-2'],
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'course-4',
        code: 'MT 101',
        name: 'Calculus I',
        departmentId: 'dept-1',
        department: 'School of Computing',
        credits: 7,
        description: 'Introduction to calculus',
        prerequisiteCourseIds: [],
        isActive: true,
        createdAt: new Date(),
      },
    ];
    setCourseOfferings(mockCourseOfferings);
  };

  const loadStudentProfiles = async () => {
    // Mock data - replace with API call
    const mockStudentProfiles: StudentProfile[] = [
      {
        id: 'student-1',
        userId: 'user-1',
        registrationId: 'reg-1',
        registrationNumber: 'T21-03-12812',
        programId: 'prog-1',
        programName: 'Computer Science',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 3.5,
        cgpa: 3.5,
        totalCreditsEarned: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-2',
        userId: 'user-2',
        registrationId: 'reg-2',
        registrationNumber: 'T21-03-12813',
        programId: 'prog-1',
        programName: 'Computer Science',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 2.8,
        cgpa: 2.8,
        totalCreditsEarned: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-3',
        userId: 'user-3',
        registrationId: 'reg-3',
        registrationNumber: 'T21-03-12814',
        programId: 'prog-2',
        programName: 'Information Technology',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 1.4,
        cgpa: 1.4,
        totalCreditsEarned: 12,
        status: 'suspended',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-4',
        userId: 'user-4',
        registrationId: 'reg-4',
        registrationNumber: 'T21-03-12815',
        programId: 'prog-2',
        programName: 'Information Technology',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 1.8,
        cgpa: 1.8,
        totalCreditsEarned: 15,
        status: 'suspended',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-5',
        userId: 'user-5',
        registrationId: 'reg-5',
        registrationNumber: 'T21-03-12816',
        programId: 'prog-1',
        programName: 'Computer Science',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 3.2,
        cgpa: 3.2,
        totalCreditsEarned: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-6',
        userId: 'user-6',
        registrationId: 'reg-6',
        registrationNumber: 'T21-03-12817',
        programId: 'prog-3',
        programName: 'Business Administration',
        department: 'School of Business',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 1.7,
        cgpa: 1.7,
        totalCreditsEarned: 9,
        status: 'suspended',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-7',
        userId: 'user-7',
        registrationId: 'reg-7',
        registrationNumber: 'T21-03-12818',
        programId: 'prog-3',
        programName: 'Business Administration',
        department: 'School of Business',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 1.9,
        cgpa: 1.9,
        totalCreditsEarned: 12,
        status: 'suspended',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-8',
        userId: 'user-8',
        registrationId: 'reg-8',
        registrationNumber: 'T21-03-12819',
        programId: 'prog-1',
        programName: 'Computer Science',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 3.8,
        cgpa: 3.8,
        totalCreditsEarned: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-9',
        userId: 'user-9',
        registrationId: 'reg-9',
        registrationNumber: 'T21-03-12820',
        programId: 'prog-2',
        programName: 'Information Technology',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 2.5,
        cgpa: 2.5,
        totalCreditsEarned: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-10',
        userId: 'user-10',
        registrationId: 'reg-10',
        registrationNumber: 'T21-03-12821',
        programId: 'prog-3',
        programName: 'Business Administration',
        department: 'School of Business',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 2.9,
        cgpa: 2.9,
        totalCreditsEarned: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'student-11',
        userId: 'user-11',
        registrationId: 'reg-11',
        registrationNumber: 'T21-03-12822',
        programId: 'prog-2',
        programName: 'Information Technology',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        currentYear: 1,
        currentSemester: 'first',
        currentAcademicYear: '2024/2025',
        gpa: 3.1,
        cgpa: 3.1,
        totalCreditsEarned: 18,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    setStudentProfiles(mockStudentProfiles);
  };

  const loadExamResults = async () => {
    setLoading(true);
    const mockExamResults: ExamResult[] = [
      {
        id: "result-1",
        studentProfileId: "student-1",
        registrationNumber: "T21-03-12812",
        studentName: "Almuzany I. M.",
        academicYear: "2024/2025",
        semester: "first",
        courseOfferingId: "course-1",
        courseCode: "CP 412",
        courseName: "C# Programming",
        credits: 9.0,
        cat1Score: 15,
        cat2Score: 14,
        assignmentScore: 10,
        finalExamScore: 45,
        totalScore: 84,
        grade: "A",
        gradePoints: 4.0,
        status: "approved",
        instructorId: "inst-1",
        instructorName: "Dr. Peter John",
        submittedBy: "inst-1",
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "result-2",
        studentProfileId: "student-1",
        registrationNumber: "T21-03-12812",
        studentName: "Almuzany I. M.",
        academicYear: "2024/2025",
        semester: "second",
        courseOfferingId: "course-2",
        courseCode: "CT 312",
        courseName: "Computer Maintenance",
        credits: 9.0,
        cat1Score: 12,
        cat2Score: 13,
        assignmentScore: 8,
        finalExamScore: 40,
        totalScore: 73,
        grade: "A",
        gradePoints: 4.0,
        status: "submitted",
        instructorId: "inst-1",
        instructorName: "Dr. Peter John",
        submittedBy: "inst-1",
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    setExamResults(mockExamResults);
    setLoading(false);
  };

  const loadSemesterResults = async () => {
    setLoading(true);
    // Mock data - replace with API call
    const mockSemesterResults: SemesterResult[] = [];
    setSemesterResults(mockSemesterResults);
    setLoading(false);
  };

  const calculateGrade = (score: number): { grade: GradeScale; points: number } => {
    const gradePoint = DEFAULT_GRADE_SCALE.find(
      (g) => score >= g.minScore && score <= g.maxScore
    );
    return {
      grade: gradePoint?.grade || 'F',
      points: gradePoint?.points || 0,
    };
  };

  const calculateGPA = (results: ExamResult[]): number => {
    if (results.length === 0) return 0;
    const totalPoints = results.reduce((sum, r) => sum + r.gradePoints * r.credits, 0);
    const totalCredits = results.reduce((sum, r) => sum + r.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const calculateCGPA = (semesterResults: SemesterResult[]): number => {
    if (semesterResults.length === 0) return 0;
    const totalGPA = semesterResults.reduce((sum, r) => sum + r.semesterGPA, 0);
    return totalGPA / semesterResults.length;
  };

  const createExamResult = async (data: any): Promise<ExamResult> => {
    setLoading(true);
    
    const { grade, points } = calculateGrade(data.finalExamScore);
    const totalScore = (data.cat1Score || 0) + (data.cat2Score || 0) + (data.assignmentScore || 0) + data.finalExamScore;
    
    const newResult: ExamResult = {
      id: `result-${Date.now()}`,
      studentProfileId: data.studentProfileId,
      registrationNumber: data.registrationNumber,
      studentName: data.studentName,
      
      academicYear: data.academicYear,
      semester: data.semester,
      courseOfferingId: data.courseOfferingId,
      courseCode: data.courseCode,
      courseName: data.courseName,
      credits: data.credits,
      instructorId: data.instructorId,
      instructorName: data.instructorName,
      
      cat1Score: data.cat1Score,
      cat2Score: data.cat2Score,
      assignmentScore: data.assignmentScore,
      finalExamScore: data.finalExamScore,
      totalScore,
      
      grade,
      gradePoints: points,
      
      status: 'draft',
      submittedBy: data.instructorId,
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setExamResults(prev => [...prev, newResult]);
    setLoading(false);
    return newResult;
  };

  const getExamResults = async (filters?: {
    studentProfileId?: string;
    academicYear?: string;
    semester?: string;
  }): Promise<ExamResult[]> => {
    setLoading(true);
    let filtered = examResults;
    
    if (filters?.studentProfileId) {
      filtered = filtered.filter(r => r.studentProfileId === filters.studentProfileId);
    }
    if (filters?.academicYear) {
      filtered = filtered.filter(r => r.academicYear === filters.academicYear);
    }
    if (filters?.semester) {
      filtered = filtered.filter(r => r.semester === filters.semester);
    }
    
    setLoading(false);
    return filtered;
  };

  const getExamResultById = async (id: string): Promise<ExamResult | null> => {
    setLoading(true);
    const result = examResults.find(r => r.id === id) || null;
    setLoading(false);
    return result;
  };

  const updateExamResult = async (id: string, data: Partial<ExamResult>): Promise<void> => {
    setLoading(true);
    
    const updatedResults = examResults.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...data, updatedAt: new Date() };
        
        // Recalculate grade if scores changed
        if (data.cat1Score !== undefined || data.cat2Score !== undefined || 
            data.assignmentScore !== undefined || data.finalExamScore !== undefined) {
          const totalScore = (updated.cat1Score || 0) + (updated.cat2Score || 0) + 
                           (updated.assignmentScore || 0) + (updated.finalExamScore || 0);
          const { grade, points } = calculateGrade(totalScore);
          updated.totalScore = totalScore;
          updated.grade = grade;
          updated.gradePoints = points;
        }
        
        return updated;
      }
      return r;
    });
    
    setExamResults(updatedResults);
    setLoading(false);
  };

  const deleteExamResult = async (id: string): Promise<void> => {
    setLoading(true);
    setExamResults(prev => prev.filter(r => r.id !== id));
    setLoading(false);
  };

  const submitExamResult = async (id: string): Promise<void> => {
    setLoading(true);
    await updateExamResult(id, { status: 'submitted' });
    setLoading(false);
  };

  const approveExamResult = async (id: string): Promise<void> => {
    setLoading(true);
    await updateExamResult(id, { status: 'approved', approvedAt: new Date() });
    setLoading(false);
  };

  const rejectExamResult = async (id: string, reason: string): Promise<void> => {
    setLoading(true);
    await updateExamResult(id, { status: 'rejected', remarks: reason });
    setLoading(false);
  };

  const createSemesterResult = async (data: any): Promise<SemesterResult> => {
    setLoading(true);
    
    const studentResults = examResults.filter(
      r => r.studentProfileId === data.studentProfileId && 
           r.academicYear === data.academicYear && 
           r.semester === data.semester
    );
    
    const semesterGPA = calculateGPA(studentResults);
    
    const newSemesterResult: SemesterResult = {
      id: `semester-result-${Date.now()}`,
      studentProfileId: data.studentProfileId,
      registrationNumber: data.registrationNumber,
      studentName: data.studentName,
      programName: data.programName,
      department: data.department,
      
      academicYear: data.academicYear,
      semester: data.semester,
      
      totalCredits: studentResults.reduce((sum, r) => sum + r.credits, 0),
      semesterGPA,
      previousCGPA: data.previousCGPA || 0,
      newCGPA: data.previousCGPA ? ((data.previousCGPA + semesterGPA) / 2) : semesterGPA,
      
      status: 'unpublished',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSemesterResults(prev => [...prev, newSemesterResult]);
    
    // Update student profile CGPA
    setStudentProfiles(prev => 
      prev.map(p => 
        p.id === data.studentProfileId 
          ? { ...p, cgpa: newSemesterResult.newCGPA, updatedAt: new Date() }
          : p
      )
    );
    
    setLoading(false);
    return newSemesterResult;
  };

  const getSemesterResults = async (studentProfileId?: string): Promise<SemesterResult[]> => {
    setLoading(true);
    let filtered = semesterResults;
    if (studentProfileId) {
      filtered = filtered.filter(r => r.studentProfileId === studentProfileId);
    }
    setLoading(false);
    return filtered;
  };

  const publishSemesterResult = async (id: string): Promise<void> => {
    setLoading(true);
    setSemesterResults(prev => 
      prev.map(r => 
        r.id === id 
          ? { ...r, status: 'published', publishedAt: new Date() }
          : r
      )
    );
    setLoading(false);
  };

  const getCourseOfferings = async (): Promise<CourseOffering[]> => {
    return courseOfferings;
  };

  const createCourseOffering = async (data: any): Promise<CourseOffering> => {
    const newCourse: CourseOffering = {
      id: `course-${Date.now()}`,
      code: data.code,
      name: data.name,
      departmentId: data.departmentId,
      department: data.department,
      credits: data.credits,
      description: data.description,
      prerequisiteCourseIds: data.prerequisiteCourseIds || [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCourseOfferings(prev => [...prev, newCourse]);
    return newCourse;
  };

  const updateCourseOffering = async (id: string, data: Partial<CourseOffering>): Promise<void> => {
    setCourseOfferings(prev => 
      prev.map(c => c.id === id ? { ...c, ...data, updatedAt: new Date() } : c)
    );
  };

  const deleteCourseOffering = async (id: string): Promise<void> => {
    setCourseOfferings(prev => prev.filter(c => c.id !== id));
  };

  const getStudentProfiles = async (): Promise<StudentProfile[]> => {
    return studentProfiles;
  };

  const getStudentProfileByRegistration = async (registrationNumber: string): Promise<StudentProfile | null> => {
    return studentProfiles.find(p => p.registrationNumber === registrationNumber) || null;
  };

  return (
    <ResultsContext.Provider
      value={{
        examResults,
        semesterResults,
        courseOfferings,
        studentProfiles,
        loading,
        createExamResult,
        getExamResults,
        getExamResultById,
        updateExamResult,
        deleteExamResult,
        submitExamResult,
        approveExamResult,
        rejectExamResult,
        createSemesterResult,
        getSemesterResults,
        publishSemesterResult,
        getCourseOfferings,
        createCourseOffering,
        updateCourseOffering,
        deleteCourseOffering,
        getStudentProfiles,
        getStudentProfileByRegistration,
        calculateGrade,
        calculateGPA,
        calculateCGPA,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
}
