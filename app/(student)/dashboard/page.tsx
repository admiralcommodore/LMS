'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLMS } from '@/lib/lms-context';
import { formatDuration } from '@/lib/sample-data';
import {
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Play,
  Star,
  Target,
  TrendingUp,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  const {
    currentUser,
    studentProfile,
    getUserEnrollments,
    getCourse,
    getRecommendedCourses,
    getLearningPaths,
  } = useLMS();

  const enrollments = getUserEnrollments();
  const recommendations = getRecommendedCourses();
  const learningPaths = getLearningPaths();
  
  const activeEnrollments = enrollments.filter((e) => e.status === 'active');
  const completedEnrollments = enrollments.filter((e) => e.status === 'completed');
  const totalLessonsCompleted = enrollments.reduce((acc, e) => acc + e.completedLessons.length, 0);
  
  const topRecommendations = recommendations.slice(0, 4);

  // Check if onboarding is needed
  const needsOnboarding = !studentProfile?.onboardingCompleted;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {studentProfile?.firstName || currentUser?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          {needsOnboarding
            ? 'Complete your profile to get personalized course recommendations'
            : 'Track your progress and continue your learning journey'}
        </p>
      </div>

      {/* Onboarding Banner */}
      {needsOnboarding && (
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                  <p className="text-muted-foreground mt-1">
                    Build your resume and get personalized course recommendations based on your career goals.
                  </p>
                  <div className="mt-3">
                    <Progress value={(studentProfile?.onboardingStep || 0) * 20} className="h-2 w-48" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Step {studentProfile?.onboardingStep || 0} of 5 completed
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href="/onboarding">
                  {studentProfile?.onboardingStep === 0 ? 'Get Started' : 'Continue'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{enrollments.length}</p>
                <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedEnrollments.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <GraduationCap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
                <p className="text-sm text-muted-foreground">Lessons Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{studentProfile?.skills.length || 0}</p>
                <p className="text-sm text-muted-foreground">Skills</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          {activeEnrollments.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Continue Learning</h2>
                <Button variant="ghost" asChild>
                  <Link href="/my-learning">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {activeEnrollments.slice(0, 2).map((enrollment) => {
                  const course = getCourse(enrollment.courseId);
                  if (!course) return null;
                  return (
                    <Card key={enrollment.id} className="overflow-hidden group">
                      <div className="relative aspect-video">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button asChild size="sm">
                            <Link href={`/learn/${course.slug}`}>
                              <Play className="mr-2 h-4 w-4" />
                              Continue
                            </Link>
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{enrollment.progress}% complete</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Recommended Courses */}
          {topRecommendations.length > 0 && !needsOnboarding && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recommended for You</h2>
                <Button variant="ghost" asChild>
                  <Link href="/course-pool">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {topRecommendations.map((rec) => {
                  const course = getCourse(rec.courseId);
                  if (!course) return null;
                  return (
                    <Card key={rec.courseId} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge
                          className="absolute top-2 right-2"
                          variant={rec.priority === 'high' ? 'default' : 'secondary'}
                        >
                          {rec.priority === 'high' ? 'Top Match' : 'Recommended'}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{course.instructorName}</p>
                        {rec.reasons.length > 0 && (
                          <p className="text-xs text-primary mt-2 line-clamp-1">
                            <Zap className="inline h-3 w-3 mr-1" />
                            {rec.reasons[0]}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex items-center text-sm">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                            {course.rating.toFixed(1)}
                          </div>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDuration(course.duration)}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href={`/courses/${course.slug}`}>View Course</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* Learning Paths */}
          {learningPaths.length > 0 && !needsOnboarding && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Learning Paths</h2>
              </div>
              <div className="space-y-4">
                {learningPaths.slice(0, 2).map((path) => (
                  <Card key={path.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{path.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{path.description}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {path.skills.slice(0, 5).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {path.skills.length > 5 && (
                              <Badge variant="secondary" className="text-xs">
                                +{path.skills.length - 5} more
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {path.courses.length} courses
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(path.estimatedDuration)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {studentProfile?.firstName?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {studentProfile?.firstName} {studentProfile?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {studentProfile?.headline || 'Complete your profile'}
                  </p>
                </div>
              </div>
              
              {studentProfile?.skills && studentProfile.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Top Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {studentProfile.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill.id} variant="outline" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-full" asChild>
                <Link href="/profile">
                  {needsOnboarding ? 'Complete Profile' : 'Edit Profile'}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/course-pool">
                  <BookMarked className="mr-2 h-4 w-4" />
                  Course Pool
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profile/resume">
                  <FileText className="mr-2 h-4 w-4" />
                  Resume Builder
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/my-learning">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  My Progress
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/courses">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Browse Courses
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Career Goals */}
          {studentProfile?.careerGoals && studentProfile.careerGoals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Career Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {studentProfile.careerGoals.map((goal, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4 text-primary" />
                      {goal}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
