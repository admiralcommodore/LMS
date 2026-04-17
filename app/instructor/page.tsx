'use client';

import Link from 'next/link';
import { useLMS } from '@/lib/lms-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useResults } from '@/lib/results-context';
import {
  Users,
  TrendingUp,
  PlusCircle,
  Star,
  FileText,
} from 'lucide-react';

export default function InstructorDashboard() {
  const { currentUser } = useLMS();
  const { examResults } = useResults();
  const studentsCount = 42; // Mock total students
  const pendingResults = examResults.filter(r => r.status === 'submitted').length;
  const approvedResults = examResults.filter(r => r.status === 'approved').length;

  const stats = [
    {
      title: 'Total Students',
      value: studentsCount.toString(),
      description: 'Active students',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'Total Results',
      value: examResults.length.toString(),
      description: `${approvedResults} approved`,
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      title: 'Pending Approval',
      value: pendingResults.toString(),
      description: 'Awaiting review',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      title: 'Average Grade',
      value: 'B+',
      description: 'Overall performance',
      icon: Star,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {currentUser?.name?.split(' ')[0] || 'Instructor'}!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your students and results
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Results Management</CardTitle>
            <CardDescription>Upload and approve student exam results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-md">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Pending Approvals</p>
                  <p className="text-sm text-muted-foreground">{pendingResults} Results</p>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href="/instructor/results">Review All</Link>
              </Button>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/instructor/results">
                <PlusCircle className="mr-2 h-4 w-4" />
                Enter New Results
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students Records</CardTitle>
            <CardDescription>Manage student profiles and academic info</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-md">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Direct Students</p>
                  <p className="text-sm text-muted-foreground">{studentsCount} Enrolled</p>
                </div>
              </div>
              <Button size="sm" asChild variant="ghost">
                <Link href="/instructor/students">View List</Link>
              </Button>
            </div>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/instructor/students">
                <Users className="mr-2 h-4 w-4" />
                Manage All Students
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
