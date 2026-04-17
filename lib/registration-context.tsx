'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
    Department,
    Program,
    RegistrationDocument,
    RegistrationFormData,
    RegistrationPayment,
    RegistrationStatus,
    StudentRegistration
} from './college-types';

interface RegistrationContextType {
  registrations: StudentRegistration[];
  programs: Program[];
  departments: Department[];
  currentRegistration: StudentRegistration | null;
  loading: boolean;
  
  // CRUD Operations
  createRegistration: (data: RegistrationFormData) => Promise<StudentRegistration>;
  getRegistrations: (filters?: { status?: RegistrationStatus }) => Promise<StudentRegistration[]>;
  getRegistrationById: (id: string) => Promise<StudentRegistration | null>;
  updateRegistration: (id: string, data: Partial<StudentRegistration>) => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
  approveRegistration: (id: string) => Promise<void>;
  rejectRegistration: (id: string, reason: string) => Promise<void>;
  
  // Payment Operations
  processPayment: (registrationId: string, feeType: FeeType, method: 'mpesa' | 'card' | 'bank_transfer' | 'cash', phoneNumber?: string) => Promise<RegistrationPayment>;
  
  // Document Operations
  uploadDocument: (registrationId: string, type: string, file: File) => Promise<RegistrationDocument>;
  
  // Helper
  setCurrentRegistration: (registration: StudentRegistration | null) => void;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export function RegistrationProvider({ children }: { children: React.ReactNode }) {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentRegistration, setCurrentRegistration] = useState<StudentRegistration | null>(null);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadPrograms();
    loadDepartments();
    loadRegistrations();
  }, []);

  const loadPrograms = async () => {
    // Mock data - replace with API call
    const mockPrograms: Program[] = [
      {
        id: 'prog-1',
        code: 'CS',
        name: 'Computer Science',
        department: 'School of Computing',
        duration: 4,
        description: 'Bachelor of Science in Computer Science',
        requirements: ['KCSE Mean Grade C+', 'C+ in Mathematics', 'C+ in Physics'],
        tuitionFee: 150000,
        currency: 'KES',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'prog-2',
        code: 'IT',
        name: 'Information Technology',
        department: 'School of Computing',
        duration: 4,
        description: 'Bachelor of Science in Information Technology',
        requirements: ['KCSE Mean Grade C+', 'C+ in Mathematics'],
        tuitionFee: 120000,
        currency: 'KES',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'prog-3',
        code: 'BA',
        name: 'Business Administration',
        department: 'School of Business',
        duration: 4,
        description: 'Bachelor of Business Administration',
        requirements: ['KCSE Mean Grade C+', 'C+ in English', 'C+ in Mathematics'],
        tuitionFee: 100000,
        currency: 'KES',
        isActive: true,
        createdAt: new Date(),
      },
    ];
    setPrograms(mockPrograms);
  };

  const loadDepartments = async () => {
    // Mock data - replace with API call
    const mockDepartments: Department[] = [
      {
        id: 'dept-1',
        code: 'SC',
        name: 'School of Computing',
        headOfDepartment: 'Dr. John Doe',
        description: 'Department of Computing and Information Technology',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'dept-2',
        code: 'SB',
        name: 'School of Business',
        headOfDepartment: 'Dr. Jane Smith',
        description: 'Department of Business and Management',
        isActive: true,
        createdAt: new Date(),
      },
    ];
    setDepartments(mockDepartments);
  };

  const loadRegistrations = async () => {
    setLoading(true);
    // Mock data - replace with API call
    const mockRegistrations: StudentRegistration[] = [
      {
        id: 'reg-1',
        userId: 'user-1',
        registrationNumber: 'T21-03-12812',
        firstName: 'Almuzany',
        lastName: 'I. M.',
        dateOfBirth: new Date('2002-05-15'),
        gender: 'male',
        phone: '+255 712 345 678',
        email: 'almuzany@example.com',
        address: '123 University Road',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        nationalId: '19950515-123456-00001-20',
        nationalIdType: 'national_id',
        academicQualifications: [
          {
            id: 'qual-1',
            level: 'o_level',
            institutionName: 'Mainland Secondary',
            institutionAddress: 'Dar es Salaam',
            country: 'Tanzania',
            startDate: new Date('2016-01-01'),
            endDate: new Date('2019-11-30'),
            indexNumber: 'S0101/0001/2019',
            grade: 'Division I',
            createdAt: new Date(),
          },
          {
            id: 'qual-2',
            level: 'a_level',
            institutionName: 'Tabora Boys',
            institutionAddress: 'Tabora',
            country: 'Tanzania',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2022-05-30'),
            indexNumber: 'S0102/0501/2022',
            grade: 'Division I',
            createdAt: new Date(),
          }
        ],
        programId: 'prog-1',
        programName: 'Computer Science',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        guardianName: 'Ibrahim M.',
        guardianPhone: '+255 712 000 000',
        guardianEmail: 'ibrahim@example.com',
        guardianRelationship: 'Father',
        guardianAddress: 'Dar es Salaam',
        documents: [],
        status: 'payment_completed',
        payments: [],
        submittedAt: new Date('2026-04-01'),
        createdAt: new Date('2026-04-01'),
        updatedAt: new Date('2026-04-01'),
      },
      {
        id: 'reg-2',
        userId: 'user-2',
        firstName: 'Sarah',
        lastName: 'Omani',
        dateOfBirth: new Date('2003-08-20'),
        gender: 'female',
        phone: '+255 754 111 222',
        email: 'sarah.o@example.com',
        address: '45 Mbezi Beach',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        nationalId: '20030820-223344-00001-15',
        nationalIdType: 'national_id',
        academicQualifications: [
          {
            id: 'qual-3',
            level: 'diploma',
            institutionName: 'DIT',
            institutionAddress: 'Dar es Salaam',
            country: 'Tanzania',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2024-11-30'),
            grade: '3.8 GPA',
            major: 'Information Technology',
            createdAt: new Date(),
          }
        ],
        programId: 'prog-2',
        programName: 'Information Technology',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'full_time',
        guardianName: 'Omani S.',
        guardianPhone: '+255 754 000 111',
        guardianEmail: 'omani@example.com',
        guardianRelationship: 'Mother',
        guardianAddress: 'Dar es Salaam',
        documents: [],
        status: 'pending',
        payments: [],
        submittedAt: new Date('2026-04-10'),
        createdAt: new Date('2026-04-10'),
        updatedAt: new Date('2026-04-10'),
      },
      {
        id: 'reg-3',
        userId: 'user-3',
        firstName: 'James',
        lastName: 'Wilson',
        dateOfBirth: new Date('2001-12-10'),
        gender: 'male',
        phone: '+255 621 999 888',
        email: 'james.w@example.com',
        address: '88 Oyesterbay',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        nationalId: '20011210-998877-00001-10',
        nationalIdType: 'passport',
        academicQualifications: [
          {
            id: 'qual-4',
            level: 'degree',
            institutionName: 'UDOM',
            institutionAddress: 'Dodoma',
            country: 'Tanzania',
            startDate: new Date('2020-01-01'),
            endDate: new Date('2023-11-30'),
            grade: '3.2 GPA',
            major: 'Business',
            createdAt: new Date(),
          }
        ],
        programId: 'prog-3',
        programName: 'Business Administration',
        department: 'School of Business',
        intake: 'January 2026',
        studyMode: 'part_time',
        guardianName: 'Wilson J.',
        guardianPhone: '+255 621 000 999',
        guardianEmail: 'wilson@example.com',
        guardianRelationship: 'Father',
        guardianAddress: 'Dar es Salaam',
        documents: [],
        status: 'under_review',
        payments: [],
        submittedAt: new Date('2026-04-05'),
        createdAt: new Date('2026-04-05'),
        updatedAt: new Date('2026-04-05'),
      },
      {
        id: 'reg-4',
        userId: 'user-4',
        firstName: 'Mariam',
        lastName: 'Ally',
        dateOfBirth: new Date('2004-01-15'),
        gender: 'female',
        phone: '+255 788 555 444',
        email: 'mariam.a@example.com',
        address: '12 Kariakoo',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        nationalId: '20040115-554433-00001-05',
        nationalIdType: 'birth_certificate',
        academicQualifications: [
          {
            id: 'qual-5',
            level: 'o_level',
            institutionName: 'Girls Secondary',
            institutionAddress: 'Mwanza',
            country: 'Tanzania',
            createdAt: new Date(),
            startDate: new Date('2018-01-01'),
            endDate: new Date('2021-11-30'),
          }
        ],
        programId: 'prog-1',
        programName: 'Computer Science',
        department: 'School of Computing',
        intake: 'September 2026',
        studyMode: 'full_time',
        guardianName: 'Ally M.',
        guardianPhone: '+255 788 000 555',
        guardianEmail: 'ally@example.com',
        guardianRelationship: 'Brother',
        guardianAddress: 'Mwanza',
        documents: [],
        status: 'rejected',
        rejectionReason: 'Does not meet minimum entrance requirements for Physics.',
        payments: [],
        submittedAt: new Date('2026-04-12'),
        createdAt: new Date('2026-04-12'),
        updatedAt: new Date('2026-04-12'),
      },
      {
        id: 'reg-5',
        userId: 'user-5',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: new Date('2000-03-30'),
        gender: 'male',
        phone: '+255 655 888 777',
        email: 'john.doe@example.com',
        address: '101 Sinza',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        nationalId: '20000330-887766-00001-01',
        nationalIdType: 'national_id',
        academicQualifications: [
          {
            id: 'qual-6',
            level: 'certificate',
            institutionName: 'Vocational Center',
            institutionAddress: 'Iringa',
            country: 'Tanzania',
            createdAt: new Date(),
            startDate: new Date('2020-01-01'),
            endDate: new Date('2021-11-30'),
          }
        ],
        programId: 'prog-2',
        programName: 'Information Technology',
        department: 'School of Computing',
        intake: 'January 2026',
        studyMode: 'distance_learning',
        guardianName: 'Jane Doe',
        guardianPhone: '+255 655 000 888',
        guardianEmail: 'jane@example.com',
        guardianRelationship: 'Spouse',
        guardianAddress: 'Dar es Salaam',
        documents: [],
        status: 'payment_pending',
        payments: [],
        submittedAt: new Date('2026-04-14'),
        createdAt: new Date('2026-04-14'),
        updatedAt: new Date('2026-04-14'),
      }
    ];
    setRegistrations(mockRegistrations);
    setLoading(false);
  };

  const createRegistration = async (data: RegistrationFormData): Promise<StudentRegistration> => {
    setLoading(true);

    // Mock implementation - replace with API call
    const newRegistration: StudentRegistration = {
      id: `reg-${Date.now()}`,
      userId: '', // Will be set from auth context
      registrationNumber: undefined,

      // Personal Information
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      address: data.address,
      city: data.city,
      country: data.country,

      // National ID Information
      nationalId: data.nationalId,
      nationalIdType: data.nationalIdType || 'national_id',
      nationalIdExpiryDate: data.nationalIdExpiryDate ? new Date(data.nationalIdExpiryDate) : undefined,

      // Academic Information (Multiple qualifications)
      academicQualifications: data.academicQualifications || [],

      // Program Information
      programId: data.programId,
      programName: programs.find(p => p.id === data.programId)?.name || '',
      department: programs.find(p => p.id === data.programId)?.department || '',
      intake: data.intake,
      studyMode: data.studyMode,

      // Guardian Information
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      guardianEmail: data.guardianEmail,
      guardianRelationship: data.guardianRelationship,
      guardianAddress: data.guardianAddress,

      // Documents
      documents: [],

      // Status
      status: 'pending',

      // Payments (Initialize with required fees)
      payments: [],

      // Timestamps
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRegistrations(prev => [...prev, newRegistration]);
    setLoading(false);
    return newRegistration;
  };

  const getRegistrations = async (filters?: { status?: RegistrationStatus }): Promise<StudentRegistration[]> => {
    setLoading(true);
    // Mock implementation - replace with API call
    let filtered = registrations;
    if (filters?.status) {
      filtered = registrations.filter(r => r.status === filters.status);
    }
    setLoading(false);
    return filtered;
  };

  const getRegistrationById = async (id: string): Promise<StudentRegistration | null> => {
    setLoading(true);
    // Mock implementation - replace with API call
    const registration = registrations.find(r => r.id === id) || null;
    setLoading(false);
    return registration;
  };

  const updateRegistration = async (id: string, data: Partial<StudentRegistration>): Promise<void> => {
    setLoading(true);
    // Mock implementation - replace with API call
    setRegistrations(prev => 
      prev.map(r => r.id === id ? { ...r, ...data, updatedAt: new Date() } : r)
    );
    setLoading(false);
  };

  const deleteRegistration = async (id: string): Promise<void> => {
    setLoading(true);
    // Mock implementation - replace with API call
    setRegistrations(prev => prev.filter(r => r.id !== id));
    setLoading(false);
  };

  const approveRegistration = async (id: string): Promise<void> => {
    setLoading(true);
    // Mock implementation - replace with API call
    const registration = registrations.find(r => r.id === id);
    if (registration) {
      const registrationNumber = `STU${new Date().getFullYear()}${String(registrations.length + 1).padStart(4, '0')}`;
      await updateRegistration(id, {
        status: 'approved',
        registrationNumber,
        approvedAt: new Date(),
      });
    }
    setLoading(false);
  };

  const rejectRegistration = async (id: string, reason: string): Promise<void> => {
    setLoading(true);
    // Mock implementation - replace with API call
    await updateRegistration(id, {
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: new Date(),
    });
    setLoading(false);
  };

  const processPayment = async (
    registrationId: string,
    feeType: 'registration_fee' | 'tuition_fee' | 'library_fee' | 'laboratory_fee' | 'examination_fee' | 'hostel_fee' | 'other',
    method: 'mpesa' | 'card' | 'bank_transfer' | 'cash',
    phoneNumber?: string
  ): Promise<RegistrationPayment> => {
    setLoading(true);

    // Mock implementation - replace with API call
    const registration = registrations.find(r => r.id === registrationId);
    const program = programs.find(p => p.id === registration?.programId);

    // Generate control number
    const controlNumber = `CN${new Date().getFullYear()}${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;

    // Determine amount based on fee type
    let amount = 0;
    let description = '';
    switch (feeType) {
      case 'registration_fee':
        amount = 5000;
        description = 'Registration Fee';
        break;
      case 'tuition_fee':
        amount = program?.tuitionFee || 0;
        description = 'Tuition Fee';
        break;
      case 'library_fee':
        amount = 2000;
        description = 'Library Fee';
        break;
      case 'laboratory_fee':
        amount = 3000;
        description = 'Laboratory Fee';
        break;
      case 'examination_fee':
        amount = 1500;
        description = 'Examination Fee';
        break;
      case 'hostel_fee':
        amount = 10000;
        description = 'Hostel Fee';
        break;
      default:
        amount = 1000;
        description = 'Other Fee';
    }

    const payment: RegistrationPayment = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      registrationId,
      feeType,
      description,
      amount,
      currency: 'TSH',
      controlNumber,
      method,
      transactionId: `TXN${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: 'completed',
      paidAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add payment to registration's payments array
    const updatedPayments = [...(registration?.payments || []), payment];
    await updateRegistration(registrationId, {
      payments: updatedPayments,
    });

    setLoading(false);
    return payment;
  };

  const uploadDocument = async (
    registrationId: string,
    type: string,
    file: File
  ): Promise<RegistrationDocument> => {
    setLoading(true);
    
    // Mock implementation - replace with actual file upload
    const document: RegistrationDocument = {
      id: `doc-${Date.now()}`,
      registrationId,
      type: type as any,
      name: file.name,
      url: URL.createObjectURL(file),
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      status: 'pending',
    };

    const registration = registrations.find(r => r.id === registrationId);
    if (registration) {
      await updateRegistration(registrationId, {
        documents: [...registration.documents, document],
      });
    }

    setLoading(false);
    return document;
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        programs,
        departments,
        currentRegistration,
        loading,
        createRegistration,
        getRegistrations,
        getRegistrationById,
        updateRegistration,
        deleteRegistration,
        approveRegistration,
        rejectRegistration,
        processPayment,
        uploadDocument,
        setCurrentRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
}
