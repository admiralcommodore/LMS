'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Search, Filter, DollarSign, Download, TrendingUp, Users, CheckCircle } from 'lucide-react';

// Define Fee types if not available globally
type FeeType = 'tuition' | 'registration' | 'examination' | 'library' | 'medical' | 'other';

const MOCK_PAYMENTS = [
  { id: '1', studentName: 'Almuzany I. M.', regNumber: 'T21-03-12812', feeType: 'tuition', amount: 1560000, currency: 'TSH', method: 'bank_transfer', controlNumber: '9912003445', date: '2026-04-15', status: 'completed' },
  { id: '2', studentName: 'Sarah John', regNumber: 'T21-03-12815', feeType: 'registration', amount: 50000, currency: 'TSH', method: 'mpesa', controlNumber: '9912003446', date: '2026-04-16', status: 'completed' },
  { id: '3', studentName: 'James Peter', regNumber: 'T21-03-12818', feeType: 'tuition', amount: 1560000, currency: 'TSH', method: 'bank_transfer', controlNumber: '9912003447', date: '2026-04-14', status: 'pending' },
  { id: '4', studentName: 'Zainab Ally', regNumber: 'T21-03-12820', feeType: 'library', amount: 25000, currency: 'TSH', method: 'card', controlNumber: '9912003448', date: '2026-04-13', status: 'completed' },
];

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalRevenue = MOCK_PAYMENTS
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const completedRegistrations = MOCK_PAYMENTS.filter(p => p.status === 'completed').length;

  if (!mounted) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Revenue & Payments</h1>
          <p className="text-muted-foreground">Monitor student fees, control numbers and financial status</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Financial Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Revenue (TSH)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed collections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Paid Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedRegistrations}</div>
            <p className="text-xs text-muted-foreground mt-1">Students with complete registration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {MOCK_PAYMENTS.filter(p => p.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Outstanding invoices</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>A list of all student fee payments and their statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Reg. Number</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Control Number</TableHead>
                <TableHead>Amount (TSH)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PAYMENTS.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.studentName}</TableCell>
                  <TableCell>{payment.regNumber}</TableCell>
                  <TableCell className="capitalize">{payment.feeType}</TableCell>
                  <TableCell className="font-mono text-xs">{payment.controlNumber}</TableCell>
                  <TableCell>{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                    <Badge variant={payment.status === 'completed' ? 'secondary' : 'outline'} className={payment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
