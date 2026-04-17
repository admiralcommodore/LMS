'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  GraduationCap,
  Calendar,
  User,
  Award,
  Shield,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample certificate data
const sampleCertificate = {
  id: 'cert-12345',
  verificationCode: 'LH-2024-FSWD-78945',
  isValid: true,
  
  recipientName: 'John Mwangi',
  courseTitle: 'Full Stack Web Development Bootcamp',
  instructorName: 'Dr. Sarah Kimani',
  
  issueDate: new Date('2024-03-15'),
  grade: 'distinction' as const,
  score: 94,
  
  skillsValidated: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'REST APIs', 'Git'],
  
  blockchainHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
  blockchainNetwork: 'Polygon',
  
  organizationName: 'LearnHub',
  organizationLogo: '/logo.png',
};

export default function VerifyCertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const resolvedParams = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [certificate, setCertificate] = useState<typeof sampleCertificate | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate API call to verify certificate
    const timer = setTimeout(() => {
      // For demo, show valid certificate for specific codes
      if (resolvedParams.code.startsWith('LH-')) {
        setCertificate(sampleCertificate);
      } else {
        setCertificate(null);
      }
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [resolvedParams.code]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Verifying Certificate...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Checking authenticity and blockchain records
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-xl font-bold text-destructive">Certificate Not Found</h1>
            <p className="text-muted-foreground mt-2 mb-6">
              We could not verify a certificate with code: <br />
              <code className="text-sm bg-muted px-2 py-1 rounded mt-2 inline-block">
                {resolvedParams.code}
              </code>
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-left p-3 bg-amber-50 rounded-lg text-amber-800">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">This could mean:</p>
                  <ul className="mt-1 space-y-1 text-amber-700">
                    <li>The certificate code is incorrect</li>
                    <li>The certificate has been revoked</li>
                    <li>The certificate does not exist</li>
                  </ul>
                </div>
              </div>
              <Button asChild className="w-full">
                <Link href="/">Go to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="font-bold text-lg">LearnHub</span>
          </Link>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            Verified Certificate
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 md:py-12">
        {/* Verification Status */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-green-800">
                Certificate Verified
              </h1>
              <p className="text-sm text-green-700">
                This certificate is authentic and has been verified on the blockchain
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Certificate Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Certificate Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-6 w-6" />
                  <span className="font-medium">Certificate of Completion</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {certificate.courseTitle}
                </h2>
                <p className="text-primary-foreground/80">
                  Awarded with {certificate.grade.charAt(0).toUpperCase() + certificate.grade.slice(1)}
                </p>
              </div>
              <CardContent className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recipient</p>
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-semibold text-lg">{certificate.recipientName}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{formatDate(certificate.issueDate)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Instructor</p>
                    <span className="font-medium">{certificate.instructorName}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Final Score</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">{certificate.score}%</span>
                      <Badge
                        className={cn(
                          certificate.grade === 'distinction'
                            ? 'bg-amber-100 text-amber-800'
                            : certificate.grade === 'merit'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        )}
                      >
                        {certificate.grade.charAt(0).toUpperCase() + certificate.grade.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Validated */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skills Validated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {certificate.skillsValidated.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm py-1.5">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Blockchain Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Network</p>
                  <Badge variant="outline">{certificate.blockchainNetwork}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Transaction Hash</p>
                  <code className="text-xs bg-muted px-2 py-1.5 rounded block overflow-x-auto">
                    {certificate.blockchainHash}
                  </code>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Verification Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Certificate ID</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{certificate.id}</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Verification Code</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{certificate.verificationCode}</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Issued By</p>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <span className="font-medium">{certificate.organizationName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Need help verifying this certificate? Contact our support team at{' '}
                  <a href="mailto:support@learnhub.com" className="text-primary hover:underline">
                    support@learnhub.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Certificate verification powered by LearnHub</p>
          <p className="mt-1">
            <a href="/" className="text-primary hover:underline">Learn more about our verification system</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
