'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRegistration } from '@/lib/registration-context';
import { Building2, CheckCircle2, CreditCard, Loader2, Receipt, Smartphone } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FeeType = 'registration_fee' | 'tuition_fee' | 'library_fee' | 'laboratory_fee' | 'examination_fee' | 'hostel_fee' | 'other';

const FEE_CONFIG: Record<FeeType, { label: string; amount: number; description: string }> = {
  registration_fee: { label: 'Registration Fee', amount: 50000, description: 'One-time registration fee' },
  tuition_fee: { label: 'Tuition Fee', amount: 1500000, description: 'Semester tuition fee' },
  library_fee: { label: 'Library Fee', amount: 20000, description: 'Library access fee' },
  laboratory_fee: { label: 'Laboratory Fee', amount: 30000, description: 'Lab usage fee' },
  examination_fee: { label: 'Examination Fee', amount: 15000, description: 'Exam processing fee' },
  hostel_fee: { label: 'Hostel Fee', amount: 100000, description: 'Accommodation fee' },
  other: { label: 'Other Fee', amount: 10000, description: 'Other miscellaneous fees' },
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { getRegistrationById, processPayment } = useRegistration();
  const [registration, setRegistration] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'bank_transfer' | 'cash'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedFees, setSelectedFees] = useState<FeeType[]>(['registration_fee']);
  const [feeControlNumbers, setFeeControlNumbers] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRegistration();
  }, [params.id]);

  useEffect(() => {
    // Generate mock control numbers for all fees on load
    const numbers: Record<string, string> = {};
    Object.keys(FEE_CONFIG).forEach(fee => {
      numbers[fee] = `99${new Date().getFullYear()}${Math.floor(100000000 + Math.random() * 900000000)}`;
    });
    setFeeControlNumbers(numbers);
  }, []);

  const loadRegistration = async () => {
    const data = await getRegistrationById(params.id as string);
    setRegistration(data);
  };

  const toggleFee = (fee: FeeType) => {
    setSelectedFees(prev => 
      prev.includes(fee) 
        ? prev.filter(f => f !== fee)
        : [...prev, fee]
    );
  };

  const handlePayment = async () => {
    if (selectedFees.length === 0) return;
    
    setProcessing(true);
    try {
      // Process each selected fee
      for (const fee of selectedFees) {
        await processPayment(params.id as string, fee, paymentMethod, phoneNumber);
      }
      
      setPaymentSuccess(true);
      await loadRegistration();

      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const calculateTotal = () => {
    return selectedFees.reduce((sum, fee) => sum + FEE_CONFIG[fee].amount, 0);
  };

  if (!registration) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <Card className="border-green-200 bg-green-50 shadow-lg animate-in fade-in zoom-in duration-300">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-green-900 mb-2">Payment Successful!</h2>
              <p className="text-green-700 mb-6 text-lg">
                Your payment has been processed. Your registration is now being updated.
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to your dashboard...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4 hover:bg-transparent">
            ← Back to Registration
          </Button>
          <h1 className="text-4xl font-extrabold tracking-tight">Fee Payment & Control Numbers</h1>
          <p className="text-muted-foreground text-lg mt-1 italic">Select fees to pay using their respective Government Control Numbers</p>
        </div>
        <div className="bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Student ID: {registration.id}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fees List */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Required Fees</CardTitle>
                  <CardDescription>All amounts are in Tanzanian Shillings (TSH)</CardDescription>
                </div>
                <Badge variant="outline" className="px-3 py-1">Academic Year 2025/26</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {(Object.entries(FEE_CONFIG) as [FeeType, any][]).map(([key, config]) => {
                  const isPaid = registration.payments?.some((p: any) => p.feeType === key && p.status === 'completed');
                  const isSelected = selectedFees.includes(key);
                  
                  return (
                    <div 
                      key={key} 
                      className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                        isPaid ? 'bg-green-50/30' : isSelected ? 'bg-primary/5' : 'hover:bg-muted/20'
                      }`}
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg">{config.label}</h4>
                          {isPaid && <Badge className="bg-green-600">PAID</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs font-semibold px-2 py-0.5 bg-muted rounded text-muted-foreground uppercase">Control Number:</span>
                          <span className="font-mono font-medium text-sm text-primary tracking-wider">{feeControlNumbers[key]}</span>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 min-w-[140px]">
                        <p className="text-xl font-black">TSH {config.amount.toLocaleString()}</p>
                        {!isPaid && (
                          <Button 
                            variant={isSelected ? "default" : "outline"} 
                            size="sm"
                            onClick={() => toggleFee(key)}
                            className="w-full md:w-auto"
                          >
                            {isSelected ? "Selected" : "Select to Pay"}
                          </Button>
                        )}
                        {isPaid && (
                          <Button variant="ghost" size="sm" disabled className="text-green-600 opacity-100">
                             <CheckCircle2 className="w-4 h-4 mr-2" />
                             Receipt Ready
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <div className="bg-muted/30 p-4 border-t flex justify-between items-center">
              <span className="font-semibold">Selected Fees Total:</span>
              <span className="text-2xl font-black text-primary">TSH {calculateTotal().toLocaleString()}</span>
            </div>
          </Card>

          {/* Registration Info Summary */}
          <Card className="border-none shadow-sm bg-muted/20">
            <CardContent className="p-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold tracking-widest">Full Name</p>
                    <p className="font-semibold">{registration.firstName} {registration.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold tracking-widest">Program</p>
                    <p className="font-semibold truncate">{registration.programName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold tracking-widest">Intake</p>
                    <p className="font-semibold">{registration.intake}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 uppercase text-[10px] font-bold tracking-widest">Status</p>
                    <Badge variant="outline" className="capitalize">{registration.status.replace('_', ' ')}</Badge>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Confirmation Side */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg sticky top-8">
            <CardHeader className="pb-4">
              <CardTitle>Complete Payment</CardTitle>
              <CardDescription>Choose your preferred payment provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)} className="grid grid-cols-1 gap-3">
                <div className={`relative flex items-center space-x-3 border-2 p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'mpesa' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                  <RadioGroupItem value="mpesa" id="mpesa" className="sr-only" />
                  <Label htmlFor="mpesa" className="flex items-center gap-4 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold">Mobile Money</p>
                      <p className="text-xs text-muted-foreground">M-Pesa, Tigo-Pesa, Airtel Money</p>
                    </div>
                  </Label>
                  {paymentMethod === 'mpesa' && <CheckCircle2 className="w-5 h-5 text-primary absolute right-4" />}
                </div>

                <div className={`relative flex items-center space-x-3 border-2 p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                  <RadioGroupItem value="card" id="card" className="sr-only" />
                  <Label htmlFor="card" className="flex items-center gap-4 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold">Card Payment</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, GePG</p>
                    </div>
                  </Label>
                  {paymentMethod === 'card' && <CheckCircle2 className="w-5 h-5 text-primary absolute right-4" />}
                </div>

                <div className={`relative flex items-center space-x-3 border-2 p-4 rounded-xl cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" className="sr-only" />
                  <Label htmlFor="bank_transfer" className="flex items-center gap-4 cursor-pointer flex-1">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-bold">Bank Deposit</p>
                      <p className="text-xs text-muted-foreground">NMB, CRDB, NBC Branch/Agent</p>
                    </div>
                  </Label>
                  {paymentMethod === 'bank_transfer' && <CheckCircle2 className="w-5 h-5 text-primary absolute right-4" />}
                </div>
              </RadioGroup>

              {paymentMethod === 'mpesa' && (
                <div className="space-y-3 bg-muted/30 p-4 rounded-xl ring-1 ring-muted">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest">Phone Number (Push Payment)</Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 07XXXXXXXX"
                    className="bg-background text-lg py-6"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    An STK push will be sent to this number
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  className="w-full text-lg py-7 font-bold shadow-lg shadow-primary/20"
                  onClick={handlePayment}
                  disabled={processing || selectedFees.length === 0 || (paymentMethod === 'mpesa' && !phoneNumber)}
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Processing TSH...
                    </>
                  ) : (
                    `Pay TSH ${calculateTotal().toLocaleString()}`
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-4 leading-relaxed">
                  Secure payment powered by Government Electronic Payment Gateway (GePG).
                  Ensure you use the correct control number for each fee type.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="border-none bg-blue-600 text-white overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm opacity-90 pb-6 relative z-10">
              Contact our treasury office if you encounter issues with control numbers or payment verification.
              <Button variant="secondary" size="sm" className="w-full mt-4 bg-white text-blue-600 hover:bg-white/90">
                Contact Finance Support
              </Button>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500 rounded-full opacity-50 blur-2xl"></div>
          </Card>
        </div>
      </div>

      {/* Payment History */}
      {registration?.payments && registration.payments.length > 0 && (
        <Card className="mt-12 border-none shadow-md">
          <CardHeader className="border-b bg-muted/10">
            <CardTitle className="flex items-center gap-3">
              <Receipt className="w-6 h-6 text-primary" />
              Receipt History
            </CardTitle>
            <CardDescription>Track all payments made toward this registration</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                  <tr>
                    <th className="px-6 py-4 font-bold">Fee Description</th>
                    <th className="px-6 py-4 font-bold">Control No.</th>
                    <th className="px-6 py-4 font-bold">Date</th>
                    <th className="px-6 py-4 font-bold">Method</th>
                    <th className="px-6 py-4 font-bold text-right">Amount (TSH)</th>
                    <th className="px-6 py-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {registration.payments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4 font-medium">{payment.description}</td>
                      <td className="px-6 py-4 font-mono text-xs">{payment.controlNumber}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 capitalize">{payment.method.replace('_', ' ')}</td>
                      <td className="px-6 py-4 font-bold text-right">{(payment.amount || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className={payment.status === 'completed' ? 'bg-green-600' : ''}>
                          {payment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
