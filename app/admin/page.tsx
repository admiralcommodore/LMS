'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  ClipboardList,
  UserCog,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  PlusCircle,
} from 'lucide-react';
import { useResults } from '@/lib/results-context';

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { studentProfiles, examResults } = useResults();

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = {
    totalStudents: studentProfiles.length,
    totalStaff: 12,
    pendingRegistrations: 5,
    totalRevenue: '1,635,000 TSH',
    passedStudents: studentProfiles.filter(s => (s.cgpa || 0) >= 2.0).length,
    failedStudents: studentProfiles.filter(s => (s.cgpa || 0) < 2.0).length,
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Administration Overview</h1>
          <p className="text-muted-foreground mt-1">
            General management of students, staff, and academic performance
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" asChild>
            <Link href="/admin/payments">
              <DollarSign className="mr-2 h-4 w-4" />
              Financials
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/users/students">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1">Actively enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Staff Members</CardTitle>
            <UserCog className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStaff}</div>
            <p className="text-xs text-muted-foreground mt-1">Instructors & Admin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Confirm Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground mt-1">Registration fees collected</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reg.</CardTitle>
            <ClipboardList className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Results Management Section */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>Overall student GPA and continuation status</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/results">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div className="flex flex-col p-4 bg-green-50 rounded-lg border border-green-100">
                    <span className="text-green-600 text-sm">Pass / Continuation</span>
                    <span className="text-2xl text-green-800 font-semibold">{stats.passedStudents} Students</span>
                 </div>
                 <div className="flex flex-col p-4 bg-red-50 rounded-lg border border-red-100">
                    <span className="text-red-600 text-sm">Discontinuation Risk</span>
                    <span className="text-2xl text-red-800 font-semibold">{stats.failedStudents} Students</span>
                 </div>
              </div>
              <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                Students with CGPA below 1.8 are automatically flagged for review.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Management Links</CardTitle>
            <CardDescription>Direct access to key modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/users/students">
                <Users className="mr-2 h-4 w-4" />
                Student Registry
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/users/staff">
                <UserCog className="mr-2 h-4 w-4" />
                Staff Directory
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/registrations">
                <ClipboardList className="mr-2 h-4 w-4" />
                Registration Desk
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/payments">
                <DollarSign className="mr-2 h-4 w-4" />
                Revenue & Payments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Tables Snippet */}
      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader>
              <CardTitle>Recent Staff Activity</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {[
                    { name: 'Dr. Peter John', action: 'Uploaded CP 412 Results', time: '2h ago' },
                    { name: 'Sarah Wilson', action: 'Approved 3 Registrations', time: '5h ago' }
                  ].map((act, i) => (
                    <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                       <div>
                          <p className="font-medium">{act.name}</p>
                          <p className="text-muted-foreground">{act.action}</p>
                       </div>
                       <span className="text-xs text-muted-foreground">{act.time}</span>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
              <CardTitle>Payment Compliance</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-medium">Fully Paid Students</span>
                     <Badge className="bg-green-100 text-green-700">85%</Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                     <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">36 out of 42 students have completed their tuition payments for this semester.</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
