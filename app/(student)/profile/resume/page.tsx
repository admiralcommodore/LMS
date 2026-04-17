'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/lib/lms-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Building,
  GraduationCap,
  Award,
  FolderOpen,
  Download,
  Eye,
  Printer,
  ArrowLeft,
  FileText,
  ExternalLink,
  Palette,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ResumeTemplate = 'classic' | 'modern' | 'minimal' | 'creative';
type ColorScheme = 'blue' | 'green' | 'purple' | 'gray' | 'orange';

export default function ResumeBuilderPage() {
  const { studentProfile, getUserEnrollments, getCourse } = useLMS();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<ResumeTemplate>('modern');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue');
  const [showCourses, setShowCourses] = useState(true);
  const [showProjects, setShowProjects] = useState(true);

  const enrollments = getUserEnrollments();
  const completedCourses = enrollments
    .filter(e => e.status === 'completed')
    .map(e => getCourse(e.courseId))
    .filter(Boolean);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handlePrint = () => {
    window.print();
  };

  const colorClasses = {
    blue: {
      primary: 'text-blue-600',
      bg: 'bg-blue-600',
      border: 'border-blue-600',
      light: 'bg-blue-50',
    },
    green: {
      primary: 'text-emerald-600',
      bg: 'bg-emerald-600',
      border: 'border-emerald-600',
      light: 'bg-emerald-50',
    },
    purple: {
      primary: 'text-violet-600',
      bg: 'bg-violet-600',
      border: 'border-violet-600',
      light: 'bg-violet-50',
    },
    gray: {
      primary: 'text-gray-700',
      bg: 'bg-gray-700',
      border: 'border-gray-700',
      light: 'bg-gray-100',
    },
    orange: {
      primary: 'text-orange-600',
      bg: 'bg-orange-600',
      border: 'border-orange-600',
      light: 'bg-orange-50',
    },
  };

  const colors = colorClasses[colorScheme];

  if (!studentProfile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold mt-4">Complete Your Profile First</h2>
            <p className="text-muted-foreground mt-2">
              Add your information to build your resume
            </p>
            <Button className="mt-6" asChild>
              <Link href="/onboarding">Start Onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ModernTemplate = () => (
    <div className="bg-white text-gray-900 p-8 print:p-0">
      {/* Header */}
      <header className={cn("pb-6 mb-6 border-b-2", colors.border)}>
        <h1 className="text-3xl font-bold">
          {studentProfile.firstName} {studentProfile.lastName}
        </h1>
        {studentProfile.headline && (
          <p className={cn("text-lg mt-1", colors.primary)}>{studentProfile.headline}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
          {studentProfile.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {studentProfile.email}
            </span>
          )}
          {studentProfile.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {studentProfile.phone}
            </span>
          )}
          {studentProfile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {studentProfile.location}
            </span>
          )}
          {studentProfile.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </span>
          )}
          {studentProfile.github && (
            <span className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              GitHub
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {studentProfile.summary && (
        <section className="mb-6">
          <h2 className={cn("text-lg font-semibold mb-2 uppercase tracking-wide", colors.primary)}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{studentProfile.summary}</p>
        </section>
      )}

      {/* Skills */}
      {studentProfile.skills.length > 0 && (
        <section className="mb-6">
          <h2 className={cn("text-lg font-semibold mb-3 uppercase tracking-wide", colors.primary)}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {studentProfile.skills.map((skill) => (
              <span
                key={skill.id}
                className={cn(
                  "px-3 py-1 text-sm rounded-full",
                  colors.light,
                  colors.primary
                )}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {studentProfile.workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className={cn("text-lg font-semibold mb-3 uppercase tracking-wide", colors.primary)}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {studentProfile.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-gray-700 mt-2 text-sm">{exp.description}</p>
                )}
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
                    {exp.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {studentProfile.education.length > 0 && (
        <section className="mb-6">
          <h2 className={cn("text-lg font-semibold mb-3 uppercase tracking-wide", colors.primary)}>
            Education
          </h2>
          <div className="space-y-3">
            {studentProfile.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate!)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {studentProfile.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className={cn("text-lg font-semibold mb-3 uppercase tracking-wide", colors.primary)}>
            Certifications
          </h2>
          <div className="grid gap-2">
            {studentProfile.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                </div>
                <span className="text-sm text-gray-500">{formatDate(cert.issueDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {showProjects && studentProfile.projects.length > 0 && (
        <section className="mb-6">
          <h2 className={cn("text-lg font-semibold mb-3 uppercase tracking-wide", colors.primary)}>
            Projects
          </h2>
          <div className="space-y-3">
            {studentProfile.projects.filter(p => p.featured).map((project) => (
              <div key={project.id}>
                <h3 className="font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-700">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs text-gray-500">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed Courses */}
      {showCourses && completedCourses.length > 0 && (
        <section>
          <h2 className={cn("text-lg font-semibold mb-3 uppercase tracking-wide", colors.primary)}>
            Online Courses Completed
          </h2>
          <div className="grid gap-2">
            {completedCourses.slice(0, 5).map((course) => (
              <div key={course!.id} className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-sm">{course!.title}</h3>
                  <p className="text-xs text-gray-500">{course!.instructorName}</p>
                </div>
                <Badge variant="outline" className="text-xs">{course!.category}</Badge>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const ClassicTemplate = () => (
    <div className="bg-white text-gray-900 p-8 print:p-0">
      {/* Header */}
      <header className="text-center pb-4 mb-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          {studentProfile.firstName} {studentProfile.lastName}
        </h1>
        {studentProfile.headline && (
          <p className="text-gray-600 mt-1">{studentProfile.headline}</p>
        )}
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm text-gray-600">
          {studentProfile.email && <span>{studentProfile.email}</span>}
          {studentProfile.phone && (
            <>
              <span>|</span>
              <span>{studentProfile.phone}</span>
            </>
          )}
          {studentProfile.location && (
            <>
              <span>|</span>
              <span>{studentProfile.location}</span>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {studentProfile.summary && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Summary
          </h2>
          <p className="text-sm text-gray-700">{studentProfile.summary}</p>
        </section>
      )}

      {/* Experience */}
      {studentProfile.workExperience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {studentProfile.workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <strong className="text-sm">{exp.position}</strong>
                  <span className="text-xs text-gray-500">
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 italic">{exp.company}</p>
                {exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-700 mt-1">
                    {exp.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {studentProfile.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {studentProfile.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <strong className="text-sm">{edu.degree} in {edu.fieldOfStudy}</strong>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate!)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {studentProfile.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Skills
          </h2>
          <p className="text-sm text-gray-700">
            {studentProfile.skills.map(s => s.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Certifications */}
      {studentProfile.certifications.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-2">
            Certifications
          </h2>
          <div className="space-y-1">
            {studentProfile.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between text-sm">
                <span>{cert.name} - {cert.issuer}</span>
                <span className="text-gray-500">{formatDate(cert.issueDate)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const MinimalTemplate = () => (
    <div className="bg-white text-gray-900 p-8 print:p-0 font-light">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-extralight">
          {studentProfile.firstName} {studentProfile.lastName}
        </h1>
        {studentProfile.headline && (
          <p className="text-lg text-gray-500 mt-2">{studentProfile.headline}</p>
        )}
        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
          {studentProfile.email && <span>{studentProfile.email}</span>}
          {studentProfile.phone && <span>{studentProfile.phone}</span>}
          {studentProfile.location && <span>{studentProfile.location}</span>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Summary */}
          {studentProfile.summary && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">About</h2>
              <p className="text-sm leading-relaxed">{studentProfile.summary}</p>
            </section>
          )}

          {/* Experience */}
          {studentProfile.workExperience.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
              <div className="space-y-4">
                {studentProfile.workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium">{exp.position}</h3>
                      <span className="text-xs text-gray-400">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{exp.company}</p>
                    {exp.achievements.length > 0 && (
                      <ul className="text-sm mt-2 space-y-1">
                        {exp.achievements.map((a, i) => (
                          <li key={i} className="text-gray-600">— {a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {showProjects && studentProfile.projects.filter(p => p.featured).length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
              <div className="space-y-3">
                {studentProfile.projects.filter(p => p.featured).map((project) => (
                  <div key={project.id}>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          {studentProfile.skills.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Skills</h2>
              <div className="space-y-1">
                {studentProfile.skills.map((skill) => (
                  <p key={skill.id} className="text-sm">{skill.name}</p>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {studentProfile.education.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Education</h2>
              <div className="space-y-2">
                {studentProfile.education.map((edu) => (
                  <div key={edu.id}>
                    <p className="text-sm font-medium">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {studentProfile.certifications.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-2">Certifications</h2>
              <div className="space-y-1">
                {studentProfile.certifications.map((cert) => (
                  <p key={cert.id} className="text-sm">{cert.name}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const CreativeTemplate = () => (
    <div className="bg-white text-gray-900 print:p-0">
      {/* Header with color bar */}
      <div className={cn("h-2", colors.bg)} />
      <div className="p-8">
        <header className="flex items-start gap-6 mb-8">
          <div className={cn("w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold", colors.bg)}>
            {studentProfile.firstName?.charAt(0)}{studentProfile.lastName?.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">
              {studentProfile.firstName} {studentProfile.lastName}
            </h1>
            {studentProfile.headline && (
              <p className={cn("text-lg mt-1", colors.primary)}>{studentProfile.headline}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-3 text-sm">
              {studentProfile.email && (
                <span className="flex items-center gap-1">
                  <Mail className={cn("h-4 w-4", colors.primary)} />
                  {studentProfile.email}
                </span>
              )}
              {studentProfile.phone && (
                <span className="flex items-center gap-1">
                  <Phone className={cn("h-4 w-4", colors.primary)} />
                  {studentProfile.phone}
                </span>
              )}
              {studentProfile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className={cn("h-4 w-4", colors.primary)} />
                  {studentProfile.location}
                </span>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Summary */}
            {studentProfile.summary && (
              <section>
                <h2 className={cn("text-lg font-bold mb-2 flex items-center gap-2", colors.primary)}>
                  <User className="h-5 w-5" />
                  About Me
                </h2>
                <p className="text-gray-700">{studentProfile.summary}</p>
              </section>
            )}

            {/* Experience */}
            {studentProfile.workExperience.length > 0 && (
              <section>
                <h2 className={cn("text-lg font-bold mb-3 flex items-center gap-2", colors.primary)}>
                  <Building className="h-5 w-5" />
                  Experience
                </h2>
                <div className="space-y-4">
                  {studentProfile.workExperience.map((exp) => (
                    <div key={exp.id} className={cn("pl-4 border-l-2", colors.border)}>
                      <h3 className="font-semibold">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                      </p>
                      {exp.achievements.length > 0 && (
                        <ul className="list-disc list-inside text-sm mt-2">
                          {exp.achievements.map((a, i) => (
                            <li key={i}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {showProjects && studentProfile.projects.filter(p => p.featured).length > 0 && (
              <section>
                <h2 className={cn("text-lg font-bold mb-3 flex items-center gap-2", colors.primary)}>
                  <FolderOpen className="h-5 w-5" />
                  Projects
                </h2>
                <div className="space-y-3">
                  {studentProfile.projects.filter(p => p.featured).map((project) => (
                    <div key={project.id} className={cn("p-3 rounded-lg", colors.light)}>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className={cn("text-xs px-2 py-0.5 rounded", colors.primary, "bg-white")}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {studentProfile.skills.length > 0 && (
              <section className={cn("p-4 rounded-lg", colors.light)}>
                <h2 className={cn("font-bold mb-3", colors.primary)}>Skills</h2>
                <div className="flex flex-wrap gap-1">
                  {studentProfile.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={cn("text-xs px-2 py-1 rounded-full bg-white", colors.primary)}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {studentProfile.education.length > 0 && (
              <section>
                <h2 className={cn("font-bold mb-3 flex items-center gap-2", colors.primary)}>
                  <GraduationCap className="h-4 w-4" />
                  Education
                </h2>
                <div className="space-y-2">
                  {studentProfile.education.map((edu) => (
                    <div key={edu.id}>
                      <p className="font-medium text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-500">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {studentProfile.certifications.length > 0 && (
              <section>
                <h2 className={cn("font-bold mb-3 flex items-center gap-2", colors.primary)}>
                  <Award className="h-4 w-4" />
                  Certifications
                </h2>
                <div className="space-y-2">
                  {studentProfile.certifications.map((cert) => (
                    <div key={cert.id}>
                      <p className="font-medium text-sm">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const getTemplate = () => {
    switch (template) {
      case 'classic':
        return <ClassicTemplate />;
      case 'minimal':
        return <MinimalTemplate />;
      case 'creative':
        return <CreativeTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <p className="text-muted-foreground mt-1">Create and download your professional resume</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Customization Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Customize
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select value={template} onValueChange={(v: ResumeTemplate) => setTemplate(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="creative">Creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Color Scheme</label>
                <div className="flex gap-2">
                  {(['blue', 'green', 'purple', 'gray', 'orange'] as ColorScheme[]).map((color) => (
                    <button
                      key={color}
                      onClick={() => setColorScheme(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        color === 'blue' && "bg-blue-600",
                        color === 'green' && "bg-emerald-600",
                        color === 'purple' && "bg-violet-600",
                        color === 'gray' && "bg-gray-700",
                        color === 'orange' && "bg-orange-600",
                        colorScheme === color ? "border-foreground" : "border-transparent"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium">Sections</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showCourses"
                    checked={showCourses}
                    onChange={(e) => setShowCourses(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showCourses" className="text-sm">Show completed courses</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showProjects"
                    checked={showProjects}
                    onChange={(e) => setShowProjects(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showProjects" className="text-sm">Show projects</label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Keep your resume concise and relevant to the job you're applying for.</p>
              <p>Quantify achievements with numbers when possible.</p>
              <p>Use action verbs to describe your experience.</p>
            </CardContent>
          </Card>
        </div>

        {/* Resume Preview */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 border-b flex-row items-center justify-between py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={resumeRef}
                className="bg-white shadow-inner print:shadow-none"
                style={{ minHeight: '11in' }}
              >
                {getTemplate()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
