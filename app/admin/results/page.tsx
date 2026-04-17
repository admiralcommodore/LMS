'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResults } from '@/lib/results-context';
import { Search, Filter, TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye, Download } from 'lucide-react';

export default function AdminResultsPage() {
  const router = useRouter();
  const { getSemesterResults, getStudentProfiles, getExamResults, loading } = useResults();
  
  const [mounted, setMounted] = useState(false);
  const [studentProfiles, setStudentProfiles] = useState<any[]>([]);
  const [semesterResults, setSemesterResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [academicYearFilter, setAcademicYearFilter] = useState<string>('2024/2025');

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [studentProfiles, searchTerm, programFilter, statusFilter]);

  const loadData = async () => {
    const students = await getStudentProfiles();
    const semResults = await getSemesterResults();
    setStudentProfiles(students);
    setSemesterResults(semResults);
  };

  const filterStudents = () => {
    let filtered = studentProfiles;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.programName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (programFilter !== 'all') {
      filtered = filtered.filter((s) => s.programId === programFilter);
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'continue') {
        filtered = filtered.filter((s) => s.cgpa >= 2.0);
      } else if (statusFilter === 'discontinue') {
        filtered = filtered.filter((s) => s.cgpa < 2.0);
      }
    }

    setStudentProfiles(filtered);
  };

  const getContinuationStatus = (cgpa: number, status: string) => {
    if (status === 'graduated') {
      return { label: 'Graduated', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
    if (cgpa < 2.0 || status === 'withdrawn' || status === 'suspended') {
      return { label: 'Discontinued', color: 'bg-red-100 text-red-800', icon: XCircle };
    }
    return { label: 'Good Standing', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const getStudentSemesterResults = (studentProfileId: string) => {
    return semesterResults.filter(r => r.studentProfileId === studentProfileId);
  };

  const getStudentYearlyGPA = (studentProfileId: string) => {
    const results = semesterResults.filter(r => r.studentProfileId === studentProfileId);
    const yearlyGPA: Record<string, number[]> = {};
    
    results.forEach(r => {
      const year = r.academicYear.split('/')[0];
      if (!yearlyGPA[year]) {
        yearlyGPA[year] = [];
      }
      yearlyGPA[year].push(r.semesterGPA);
    });

    return Object.entries(yearlyGPA).map(([year, gpas]) => ({
      year,
      averageGPA: gpas.reduce((a, b) => a + b, 0) / gpas.length,
      semesterCount: gpas.length,
    }));
  };

  const stats = {
    total: studentProfiles.length,
    goodStanding: studentProfiles.filter(s => s.cgpa >= 2.0 && s.status === 'active').length,
    probation: studentProfiles.filter(s => s.status === 'probation').length,
    discontinued: studentProfiles.filter(s => s.status === 'withdrawn' || s.status === 'suspended' || s.cgpa < 2.0).length,
    graduated: studentProfiles.filter(s => s.status === 'graduated').length,
    averageCGPA: studentProfiles.length > 0 
      ? studentProfiles.reduce((sum, s) => sum + (s.cgpa || 0), 0) / studentProfiles.length 
      : 0,
  };

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Academic Performance</h1>
          <p className="text-muted-foreground">Monitor student results, GPA, and continuation status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Back to Dashboard
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Good Standing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.goodStanding}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              Probation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.probation}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Discontinued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.discontinued}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Avg CGPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageCGPA.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by registration number or program..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="continue">Good Standing</SelectItem>
                  <SelectItem value="discontinue">Discontinued</SelectItem>
                </SelectContent>
              </Select>
              <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Academic Performance</CardTitle>
          <CardDescription>
            Track CGPA, yearly GPA trends, and continuation status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reg. Number</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Current Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Yearly GPA</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Continuation</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentProfiles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                studentProfiles.map((student) => {
                  const continuationStatus = getContinuationStatus(student.cgpa || 0, student.status);
                  const yearlyGPA = getStudentYearlyGPA(student.id);
                  const StatusIcon = continuationStatus.icon;

                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.registrationNumber}</TableCell>
                      <TableCell>{student.programName}</TableCell>
                      <TableCell>Year {student.currentYear}</TableCell>
                      <TableCell className="capitalize">{student.currentSemester}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${student.cgpa >= 2.0 ? 'text-green-600' : 'text-red-600'}`}>
                          {student.cgpa?.toFixed(2) || '0.00'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {yearlyGPA.map((gpa, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {gpa.year}: {gpa.averageGPA.toFixed(2)}
                            </Badge>
                          ))}
                          {yearlyGPA.length === 0 && <span className="text-muted-foreground text-sm">No data</span>}
                        </div>
                      </TableCell>
                      <TableCell>{student.totalCreditsEarned}</TableCell>
                      <TableCell>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={continuationStatus.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {continuationStatus.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/results/${student.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Continuation Policy Info */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Continuation Policy</CardTitle>
          <CardDescription>Academic requirements for student continuation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Good Standing</h4>
              <p className="text-sm text-green-800">CGPA of 2.0 or higher. Student can continue studies normally.</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Discontinuation</h4>
              <p className="text-sm text-red-800">CGPA lower than 2.0. Student is discontinued from the program.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
