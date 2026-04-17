'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
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
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, XCircle, Download, FileText } from 'lucide-react';

export default function AdminStudentResultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getStudentProfiles, getSemesterResults, getExamResults, getExamResultById } = useResults();
  
  const [student, setStudent] = useState<any>(null);
  const [semesterResults, setSemesterResults] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('all');

  useEffect(() => {
    loadStudentData();
  }, [params.id]);

  useEffect(() => {
    if (selectedAcademicYear === 'all') {
      loadAllExamResults();
    } else {
      loadExamResultsByYear(selectedAcademicYear);
    }
  }, [selectedAcademicYear]);

  const loadStudentData = async () => {
    const students = await getStudentProfiles();
    const foundStudent = students.find(s => s.id === params.id);
    if (foundStudent) {
      setStudent(foundStudent);
      const semResults = await getSemesterResults(foundStudent.id);
      setSemesterResults(semResults);
      loadAllExamResults();
    }
  };

  const loadAllExamResults = async () => {
    if (student) {
      const results = await getExamResults({ studentProfileId: student.id });
      setExamResults(results);
    }
  };

  const loadExamResultsByYear = async (year: string) => {
    if (student) {
      const results = await getExamResults({ studentProfileId: student.id, academicYear: year });
      setExamResults(results);
    }
  };

  const getContinuationStatus = (cgpa: number, status: string) => {
    if (status === 'graduated') {
      return { label: 'Graduated', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
    if (status === 'withdrawn' || status === 'suspended') {
      return { label: 'Discontinued', color: 'bg-red-100 text-red-800', icon: XCircle };
    }
    if (cgpa < 2.0) {
      return { label: 'Probation', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle };
    }
    return { label: 'Good Standing', color: 'bg-green-100 text-green-800', icon: CheckCircle };
  };

  const getYearlyGPA = (studentId: string) => {
    const results = semesterResults.filter(r => r.studentProfileId === studentId);
    const yearlyGPA: Record<string, { gpa: number; semesters: string[] }> = {};
    
    results.forEach(r => {
      const year = r.academicYear.split('/')[0];
      if (!yearlyGPA[year]) {
        yearlyGPA[year] = { gpa: 0, semesters: [] };
      }
      yearlyGPA[year].gpa += r.semesterGPA;
      yearlyGPA[year].semesters.push(r.semester);
    });

    return Object.entries(yearlyGPA).map(([year, data]) => ({
      year,
      averageGPA: data.gpa / data.semesters.length,
      semesterCount: data.semesters.length,
    }));
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'C-': 'bg-yellow-100 text-yellow-800',
      'D+': 'bg-orange-100 text-orange-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800',
    };
    return colors[grade] || 'bg-gray-100 text-gray-800';
  };

  if (!student) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Student Not Found</h2>
          <Button onClick={() => router.push('/admin/results')}>
            Back to Results
          </Button>
        </div>
      </div>
    );
  }

  const continuationStatus = getContinuationStatus(student.cgpa || 0, student.status);
  const StatusIcon = continuationStatus.icon;
  const yearlyGPA = getYearlyGPA(student.id);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            View Profile
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Transcript
          </Button>
        </div>
      </div>

      {/* Student Info Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{student.registrationNumber}</h2>
              <p className="text-muted-foreground">{student.programName}</p>
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{student.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Intake</p>
                  <p className="font-medium">{student.intake}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Study Mode</p>
                  <p className="font-medium capitalize">{student.studyMode.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
            <Badge className={continuationStatus.color} className="text-sm px-4 py-2">
              <StatusIcon className="w-4 h-4 mr-2" />
              {continuationStatus.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${student.cgpa >= 2.0 ? 'text-green-600' : 'text-red-600'}`}>
              {student.cgpa?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {student.gpa?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Credits Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{student.totalCreditsEarned}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Year {student.currentYear}</div>
            <p className="text-sm text-muted-foreground capitalize">{student.currentSemester} Semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Yearly GPA Trend */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Yearly GPA Trend</CardTitle>
          <CardDescription>Academic performance by academic year</CardDescription>
        </CardHeader>
        <CardContent>
          {yearlyGPA.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No academic data available</p>
          ) : (
            <div className="space-y-3">
              {yearlyGPA.map((gpa, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{gpa.year}</span>
                      <span className="text-sm text-muted-foreground">{gpa.semesterCount} semester(s)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${gpa.averageGPA >= 3.0 ? 'bg-green-500' : gpa.averageGPA >= 2.0 ? 'bg-blue-500' : gpa.averageGPA >= 1.5 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${(gpa.averageGPA / 4.0) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="text-2xl font-bold">{gpa.averageGPA.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Semester Results */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Semester Results</CardTitle>
          <CardDescription>Detailed performance by semester</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Academic Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Semester GPA</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {semesterResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No semester results available
                  </TableCell>
                </TableRow>
              ) : (
                semesterResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.academicYear}</TableCell>
                    <TableCell className="capitalize">{result.semester}</TableCell>
                    <TableCell>{result.totalCredits}</TableCell>
                    <TableCell className="font-semibold">{result.semesterGPA.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">{result.newCGPA.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={result.status === 'published' ? 'default' : 'secondary'}>
                        {result.status === 'published' ? 'Published' : 'Unpublished'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Course Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Results</CardTitle>
              <CardDescription>Detailed performance in each course</CardDescription>
            </div>
            <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2025/2026">2025/2026</SelectItem>
                <SelectItem value="2024/2025">2024/2025</SelectItem>
                <SelectItem value="2023/2024">2023/2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Academic Year</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No course results available
                  </TableCell>
                </TableRow>
              ) : (
                examResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.courseCode}</TableCell>
                    <TableCell>{result.courseName}</TableCell>
                    <TableCell>{result.academicYear}</TableCell>
                    <TableCell className="capitalize">{result.semester}</TableCell>
                    <TableCell>{result.credits}</TableCell>
                    <TableCell className="font-semibold">{result.totalScore}</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(result.grade)}>
                        {result.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.gradePoints.toFixed(1)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
