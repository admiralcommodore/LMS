'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLMS } from '@/lib/lms-context';
import { SKILL_CATEGORIES, CATEGORIES, JOB_ROLES, CAREER_GOALS } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  FileText,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Building,
  Calendar,
  Award,
  FolderOpen,
  ExternalLink,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const {
    studentProfile,
    updateStudentProfile,
    addSkill,
    removeSkill,
    updateSkill,
    addEducation,
    removeEducation,
    updateEducation,
    addWorkExperience,
    removeWorkExperience,
    updateWorkExperience,
    addCertification,
    removeCertification,
    addProject,
    removeProject,
    updateProject,
  } = useLMS();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: studentProfile?.firstName || '',
    lastName: studentProfile?.lastName || '',
    email: studentProfile?.email || '',
    phone: studentProfile?.phone || '',
    headline: studentProfile?.headline || '',
    summary: studentProfile?.summary || '',
    location: studentProfile?.location || '',
    website: studentProfile?.website || '',
    linkedin: studentProfile?.linkedin || '',
    github: studentProfile?.github || '',
    portfolio: studentProfile?.portfolio || '',
    employmentStatus: studentProfile?.employmentStatus || 'student',
    currentRole: studentProfile?.currentRole || '',
    yearsOfExperience: studentProfile?.yearsOfExperience || 0,
    careerGoals: studentProfile?.careerGoals || [],
    desiredRoles: studentProfile?.desiredRoles || [],
    remotePreference: studentProfile?.remotePreference || 'any',
    willingToRelocate: studentProfile?.willingToRelocate || false,
    preferredCategories: studentProfile?.preferredCategories || [],
    learningGoals: studentProfile?.learningGoals || [],
  });

  // Dialog states
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  // Form states
  const [newSkill, setNewSkill] = useState({ name: '', level: 'beginner' as const, category: '' });
  const [newEducation, setNewEducation] = useState({
    institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, description: '', location: '',
  });
  const [newExperience, setNewExperience] = useState({
    company: '', position: '', location: '', locationType: 'onsite' as const, startDate: '', endDate: '', current: false, description: '', achievements: [''], skills: [''],
  });
  const [newCertification, setNewCertification] = useState({
    name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', skills: [''],
  });
  const [newProject, setNewProject] = useState({
    title: '', description: '', url: '', githubUrl: '', technologies: [''], featured: false,
  });

  const handleSaveProfile = () => {
    updateStudentProfile(editData);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.category) {
      addSkill(newSkill);
      setNewSkill({ name: '', level: 'beginner', category: '' });
      setSkillDialogOpen(false);
    }
  };

  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      addEducation({
        ...newEducation,
        startDate: new Date(newEducation.startDate),
        endDate: newEducation.endDate ? new Date(newEducation.endDate) : undefined,
      });
      setNewEducation({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false, description: '', location: '' });
      setEducationDialogOpen(false);
    }
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position) {
      addWorkExperience({
        ...newExperience,
        startDate: new Date(newExperience.startDate),
        endDate: newExperience.endDate ? new Date(newExperience.endDate) : undefined,
        achievements: newExperience.achievements.filter(a => a),
        skills: newExperience.skills.filter(s => s),
      });
      setNewExperience({ company: '', position: '', location: '', locationType: 'onsite', startDate: '', endDate: '', current: false, description: '', achievements: [''], skills: [''] });
      setExperienceDialogOpen(false);
    }
  };

  const handleAddCertification = () => {
    if (newCertification.name && newCertification.issuer) {
      addCertification({
        ...newCertification,
        issueDate: new Date(newCertification.issueDate),
        expiryDate: newCertification.expiryDate ? new Date(newCertification.expiryDate) : undefined,
        skills: newCertification.skills.filter(s => s),
      });
      setNewCertification({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '', skills: [''] });
      setCertificationDialogOpen(false);
    }
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      addProject({
        ...newProject,
        technologies: newProject.technologies.filter(t => t),
      });
      setNewProject({ title: '', description: '', url: '', githubUrl: '', technologies: [''], featured: false });
      setProjectDialogOpen(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (!studentProfile) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold mt-4">No Profile Found</h2>
            <p className="text-muted-foreground mt-2">Complete the onboarding to create your profile</p>
            <Button className="mt-6" asChild>
              <Link href="/onboarding">Start Onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your profile and resume information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/profile/resume">
              <FileText className="mr-2 h-4 w-4" />
              Resume Builder
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Headline</Label>
                    <Input
                      value={editData.headline}
                      onChange={(e) => setEditData({ ...editData, headline: e.target.value })}
                      placeholder="e.g., Full Stack Developer | React Enthusiast"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Professional Summary</Label>
                    <Textarea
                      rows={4}
                      value={editData.summary}
                      onChange={(e) => setEditData({ ...editData, summary: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        value={editData.website}
                        onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        value={editData.linkedin}
                        onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GitHub</Label>
                      <Input
                        value={editData.github}
                        onChange={(e) => setEditData({ ...editData, github: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Employment Status</Label>
                      <Select
                        value={editData.employmentStatus}
                        onValueChange={(value: any) => setEditData({ ...editData, employmentStatus: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employed">Employed</SelectItem>
                          <SelectItem value="unemployed">Unemployed</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="seeking">Actively Seeking</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Years of Experience</Label>
                      <Input
                        type="number"
                        min="0"
                        value={editData.yearsOfExperience}
                        onChange={(e) => setEditData({ ...editData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-6">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-4xl font-bold text-primary">
                        {studentProfile.firstName?.charAt(0)}{studentProfile.lastName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">
                        {studentProfile.firstName} {studentProfile.lastName}
                      </h2>
                      <p className="text-lg text-muted-foreground">{studentProfile.headline || 'No headline set'}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                        {studentProfile.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {studentProfile.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {studentProfile.email}
                        </span>
                        {studentProfile.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {studentProfile.phone}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {studentProfile.linkedin && (
                          <a href={studentProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        {studentProfile.github && (
                          <a href={studentProfile.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                        {studentProfile.website && (
                          <a href={studentProfile.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                            <Globe className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {studentProfile.summary && (
                    <div>
                      <h3 className="font-semibold mb-2">About</h3>
                      <p className="text-muted-foreground">{studentProfile.summary}</p>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="font-semibold mb-2">Career Goals</h3>
                      <div className="flex flex-wrap gap-1">
                        {studentProfile.careerGoals.length > 0 ? (
                          studentProfile.careerGoals.map((goal) => (
                            <Badge key={goal} variant="secondary">{goal}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No goals set</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Desired Roles</h3>
                      <div className="flex flex-wrap gap-1">
                        {studentProfile.desiredRoles.length > 0 ? (
                          studentProfile.desiredRoles.map((role) => (
                            <Badge key={role} variant="outline">{role}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No roles set</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Achievements & Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Badges you've earned through your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                <Award className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No achievements yet. Keep learning to earn badges!</p>
              </div>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>Your earned course certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No certificates earned yet. Complete courses to view them here.</p>
              </div>
            </CardContent>
          </Card>

          {/* Learning Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Preferences</CardTitle>
              <CardDescription>Categories and topics you're interested in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Preferred Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {studentProfile.preferredCategories.length > 0 ? (
                    studentProfile.preferredCategories.map((cat) => (
                      <Badge key={cat} variant="secondary">{cat}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No preferences set</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Learning Goals</h4>
                <div className="flex flex-wrap gap-1">
                  {studentProfile.learningGoals.length > 0 ? (
                    studentProfile.learningGoals.map((goal) => (
                      <Badge key={goal}>{goal}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No learning goals set</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Work Experience</CardTitle>
                <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Experience
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Work Experience</DialogTitle>
                      <DialogDescription>Add details about your work experience</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={newExperience.company}
                            onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                            placeholder="Company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Position</Label>
                          <Input
                            value={newExperience.position}
                            onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                            placeholder="Job title"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={newExperience.location}
                            onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                            placeholder="City, Country"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Work Type</Label>
                          <Select
                            value={newExperience.locationType}
                            onValueChange={(value: any) => setNewExperience({ ...newExperience, locationType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                              <SelectItem value="onsite">Onsite</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={newExperience.startDate}
                            onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={newExperience.endDate}
                            onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                            disabled={newExperience.current}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="currentJob"
                          checked={newExperience.current}
                          onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="currentJob" className="font-normal">I currently work here</Label>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={newExperience.description}
                          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                          placeholder="Describe your responsibilities..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Key Achievements</Label>
                        {newExperience.achievements.map((achievement, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={achievement}
                              onChange={(e) => {
                                const updated = [...newExperience.achievements];
                                updated[idx] = e.target.value;
                                setNewExperience({ ...newExperience, achievements: updated });
                              }}
                              placeholder="Achievement"
                            />
                            {idx === newExperience.achievements.length - 1 ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setNewExperience({ ...newExperience, achievements: [...newExperience.achievements, ''] })}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const updated = newExperience.achievements.filter((_, i) => i !== idx);
                                  setNewExperience({ ...newExperience, achievements: updated });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setExperienceDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddExperience}>Add Experience</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {studentProfile.workExperience.length > 0 ? (
                <div className="space-y-6">
                  {studentProfile.workExperience.map((exp) => (
                    <div key={exp.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Building className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{exp.position}</h4>
                            <p className="text-muted-foreground">{exp.company}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeWorkExperience(exp.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                          </span>
                          {exp.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {exp.location}
                            </span>
                          )}
                          <Badge variant="outline" className="text-xs">{exp.locationType}</Badge>
                        </div>
                        {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                        {exp.achievements.length > 0 && (
                          <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                            {exp.achievements.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        )}
                        {exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {exp.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No work experience added yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Certifications</CardTitle>
                <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Certification
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Certification</DialogTitle>
                      <DialogDescription>Add your professional certifications</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Certification Name</Label>
                        <Input
                          value={newCertification.name}
                          onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                          placeholder="e.g., AWS Solutions Architect"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Issuing Organization</Label>
                        <Input
                          value={newCertification.issuer}
                          onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                          placeholder="e.g., Amazon Web Services"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Issue Date</Label>
                          <Input
                            type="month"
                            value={newCertification.issueDate}
                            onChange={(e) => setNewCertification({ ...newCertification, issueDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Expiry Date (Optional)</Label>
                          <Input
                            type="month"
                            value={newCertification.expiryDate}
                            onChange={(e) => setNewCertification({ ...newCertification, expiryDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Credential ID</Label>
                        <Input
                          value={newCertification.credentialId}
                          onChange={(e) => setNewCertification({ ...newCertification, credentialId: e.target.value })}
                          placeholder="Optional"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Credential URL</Label>
                        <Input
                          value={newCertification.credentialUrl}
                          onChange={(e) => setNewCertification({ ...newCertification, credentialUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCertificationDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddCertification}>Add Certification</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {studentProfile.certifications.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {studentProfile.certifications.map((cert) => (
                    <Card key={cert.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                            <Award className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{cert.name}</h4>
                            <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Issued {formatDate(cert.issueDate)}
                              {cert.expiryDate && ` · Expires ${formatDate(cert.expiryDate)}`}
                            </p>
                            {cert.credentialUrl && (
                              <a
                                href={cert.credentialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                              >
                                View Credential <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeCertification(cert.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No certifications added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Education</DialogTitle>
                      <DialogDescription>Add your educational background</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                          placeholder="University/School name"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Degree</Label>
                          <Input
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                            placeholder="e.g., Bachelor's"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Field of Study</Label>
                          <Input
                            value={newEducation.fieldOfStudy}
                            onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={newEducation.startDate}
                            onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={newEducation.endDate}
                            onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                            disabled={newEducation.current}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="currentEdu"
                          checked={newEducation.current}
                          onChange={(e) => setNewEducation({ ...newEducation, current: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="currentEdu" className="font-normal">Currently attending</Label>
                      </div>
                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Textarea
                          rows={3}
                          value={newEducation.description}
                          onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                          placeholder="Activities, achievements, etc."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEducationDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddEducation}>Add Education</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {studentProfile.education.length > 0 ? (
                <div className="space-y-6">
                  {studentProfile.education.map((edu) => (
                    <div key={edu.id} className="flex gap-4 p-4 border rounded-lg">
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</h4>
                            <p className="text-muted-foreground">{edu.institution}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeEducation(edu.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate!)}
                        </p>
                        {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No education added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Skills</CardTitle>
                <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Skill</DialogTitle>
                      <DialogDescription>Add a skill to your profile</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Skill Name</Label>
                        <Input
                          value={newSkill.name}
                          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                          placeholder="e.g., JavaScript"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={newSkill.category}
                          onValueChange={(value) => setNewSkill({ ...newSkill, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {SKILL_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Proficiency Level</Label>
                        <Select
                          value={newSkill.level}
                          onValueChange={(value: any) => setNewSkill({ ...newSkill, level: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSkillDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddSkill}>Add Skill</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {studentProfile.skills.length > 0 ? (
                <div className="space-y-6">
                  {SKILL_CATEGORIES.map((category) => {
                    const categorySkills = studentProfile.skills.filter(s => s.category === category);
                    if (categorySkills.length === 0) return null;
                    return (
                      <div key={category}>
                        <h4 className="font-medium mb-3">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {categorySkills.map((skill) => (
                            <Badge
                              key={skill.id}
                              variant="secondary"
                              className="py-1.5 px-3 gap-2"
                            >
                              <span>{skill.name}</span>
                              <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded",
                                skill.level === 'expert' && "bg-green-100 text-green-700",
                                skill.level === 'advanced' && "bg-blue-100 text-blue-700",
                                skill.level === 'intermediate' && "bg-amber-100 text-amber-700",
                                skill.level === 'beginner' && "bg-gray-100 text-gray-700",
                              )}>
                                {skill.level}
                              </span>
                              <button onClick={() => removeSkill(skill.id)}>
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Code className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No skills added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Project</DialogTitle>
                      <DialogDescription>Showcase your work</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Project Title</Label>
                        <Input
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="Project name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          placeholder="What does this project do?"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Live URL</Label>
                          <Input
                            value={newProject.url}
                            onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                            placeholder="https://..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>GitHub URL</Label>
                          <Input
                            value={newProject.githubUrl}
                            onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                            placeholder="https://github.com/..."
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Technologies</Label>
                        {newProject.technologies.map((tech, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input
                              value={tech}
                              onChange={(e) => {
                                const updated = [...newProject.technologies];
                                updated[idx] = e.target.value;
                                setNewProject({ ...newProject, technologies: updated });
                              }}
                              placeholder="e.g., React"
                            />
                            {idx === newProject.technologies.length - 1 ? (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setNewProject({ ...newProject, technologies: [...newProject.technologies, ''] })}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  const updated = newProject.technologies.filter((_, i) => i !== idx);
                                  setNewProject({ ...newProject, technologies: updated });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={newProject.featured}
                          onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                          className="rounded"
                        />
                        <Label htmlFor="featured" className="font-normal">Featured project</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddProject}>Add Project</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {studentProfile.projects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {studentProfile.projects.map((project) => (
                    <Card key={project.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-muted">
                            <FolderOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h4 className="font-semibold flex items-center gap-2">
                              {project.title}
                              {project.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                            </h4>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeProject(project.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {project.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-4">
                        {project.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <Globe className="mr-2 h-3 w-3" />
                              Live
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-3 w-3" />
                              Code
                            </a>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">No projects added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
