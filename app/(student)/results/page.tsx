'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Info, ChevronDown } from 'lucide-react';

// Mock Data for UDOM Results
const ACADEMIC_RESULTS = [
  {
    year: "1st Year of Study",
    academicYear: "2023/2024 Academic Year",
    summary: { totalCredits: 120.0, totalGradePoints: 420.0, gpa: 3.5, remarks: "Pass" },
    semesters: [
      {
        name: "Semester One",
        academicYear: "2023/2024 Academic Year",
        courses: [
          { code: "CS 111", name: "Introduction to Programming", type: "Core", credit: 9.0, grade: "A", remarks: "Pass" },
          { code: "MT 111", name: "Calculus I", type: "Core", credit: 7.5, grade: "B+", remarks: "Pass" },
          { code: "PH 111", name: "Digital Electronics", type: "Core", credit: 9.0, grade: "B", remarks: "Pass" },
          { code: "DS 101", name: "Development Studies", type: "Elective", credit: 7.5, grade: "C", remarks: "Pass" },
        ]
      },
      {
        name: "Semester Two",
        academicYear: "2023/2024 Academic Year",
        courses: [
          { code: "CS 121", name: "Data Structures", type: "Core", credit: 9.0, grade: "B+", remarks: "Pass" },
          { code: "CS 122", name: "Computer Organization", type: "Core", credit: 9.0, grade: "A", remarks: "Pass" },
          { code: "MT 112", name: "Linear Algebra", type: "Core", credit: 7.5, grade: "C", remarks: "Pass" },
        ]
      }
    ]
  },
  {
    year: "2nd Year of Study",
    academicYear: "2024/2025 Academic Year",
    summary: { totalCredits: 132.0, totalGradePoints: 485.5, gpa: 3.68, remarks: "Pass" },
    semesters: [
      {
        name: "Semester One",
        academicYear: "2024/2025 Academic Year",
        courses: [
          { code: "CP 412", name: "C# Programming", type: "Core", credit: 9.0, grade: "B+", remarks: "Pass" },
          { code: "CT 312", name: "Computer Maintenance", type: "Core", credit: 9.0, grade: "B+", remarks: "Pass" },
          { code: "IM 411", name: "Human Computer Interaction", type: "Core", credit: 7.5, grade: "C", remarks: "Pass" },
          { code: "BT 413", name: "Ict Project Management", type: "Core", credit: 6.0, grade: "B", remarks: "Pass" },
          { code: "CS 332", name: "Industrial Practical Training III", type: "Core", credit: 9.6, grade: "A", remarks: "Pass" },
          { code: "SI 311", name: "Professional Ethics And Conduct core", type: "Core", credit: 7.5, grade: "C", remarks: "Pass" },
          { code: "CS 431", name: "Software Engineering Project I", type: "Core", credit: 7.0, grade: "A", remarks: "Pass" },
          { code: "CS 411", name: "Software Reverse Engineering", type: "Core", credit: 9.0, grade: "A", remarks: "Pass" },
          { code: "CP 314", name: "Distributed Computing", type: "Elective", credit: 7.5, grade: "C", remarks: "Pass" },
        ]
      },
      {
        name: "Semester Two",
        academicYear: "2024/2025 Academic Year",
        courses: [
           { code: "CS 222", name: "Operating Systems", type: "Core", credit: 9.0, grade: "B", remarks: "Pass" },
           { code: "IS 221", name: "Database Management Systems", type: "Core", credit: 9.0, grade: "B+", remarks: "Pass" },
        ]
      }
    ]
  }
];

export default function StudentResultsPage() {
  const [openYears, setOpenYears] = useState<string[]>(["2nd Year of Study"]);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        {/* Breadcrumb Mock */}
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-6">
          <span>Home</span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-500">My Courses Assessments</span>
        </div>

        {/* Legend */}
        <div className="flex flex-col items-center mb-8">
          <p className="text-[10px] uppercase font-bold text-gray-400 mb-3 tracking-widest">Remarks Color Definition</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-6 py-2 bg-green-100/50 border border-green-200 rounded text-sm font-medium text-green-700">
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              Pass
            </div>
            <div className="flex items-center gap-2 px-6 py-2 bg-red-100/50 border border-red-200 rounded text-sm font-medium text-red-700">
              <div className="w-3 h-3 bg-red-200 rounded-sm"></div>
              Failed
            </div>
            <div className="flex items-center gap-2 px-6 py-2 bg-sky-100/50 border border-sky-200 rounded text-sm font-medium text-sky-700">
              <div className="w-3 h-3 bg-sky-200 rounded-sm"></div>
              Incomplete
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 flex items-center gap-3 mb-8 text-sky-700">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Click on an Listed Academic Year and Semester to view your course results.</p>
        </div>

        {/* Years Accordion */}
        <Accordion type="multiple" defaultValue={openYears} className="space-y-4">
          {ACADEMIC_RESULTS.map((yearData) => (
            <AccordionItem 
              key={yearData.year} 
              value={yearData.year} 
              className="bg-white border rounded-lg overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="px-6 py-5 hover:no-underline">
                <div className="flex flex-col items-start gap-1">
                  <h3 className="text-lg font-bold text-slate-800">{yearData.year}</h3>
                  <p className="text-xs text-slate-400">{yearData.academicYear}</p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0 border-t">
                {/* Year Summary */}
                <div className="bg-slate-50/50 p-6 flex flex-col items-center border-b">
                   <p className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-wider">Year Result Summary</p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-2xl">
                      <div className="bg-white border p-3 flex justify-between items-center rounded">
                        <span className="text-xs font-semibold text-slate-500">Total Credits:</span>
                        <span className="font-bold">{yearData.summary.totalCredits.toFixed(1)}</span>
                      </div>
                      <div className="bg-white border p-3 flex justify-between items-center rounded">
                        <span className="text-xs font-semibold text-slate-500">Total Grade Points:</span>
                        <span className="font-bold">{yearData.summary.totalGradePoints.toFixed(1)}</span>
                      </div>
                      <div className="bg-white border p-3 flex justify-between items-center rounded">
                        <span className="text-xs font-semibold text-slate-500">GPA:</span>
                        <span className="font-bold">{yearData.summary.gpa.toFixed(2)}</span>
                      </div>
                      <div className="bg-white border p-3 flex justify-between items-center rounded">
                        <span className="text-xs font-semibold text-slate-500">Remarks:</span>
                        <Badge className="bg-green-600">{yearData.summary.remarks}</Badge>
                      </div>
                   </div>
                </div>

                {/* Semesters Collapsible/Accordion */}
                <div className="divide-y">
                  {yearData.semesters.map((semester) => (
                    <div key={semester.name} className="bg-slate-50/30">
                       <details className="group" open={semester.name === "Semester One"}>
                          <summary className="px-8 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700">{semester.name}</span>
                              <span className="text-[10px] text-slate-400">{semester.academicYear}</span>
                            </div>
                            <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
                          </summary>
                          <div className="px-8 pb-8 pt-2">
                             <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                                <Table>
                                  <TableHeader className="bg-slate-50">
                                    <TableRow className="hover:bg-transparent">
                                      <TableHead className="w-12 text-center text-[11px] font-bold uppercase text-slate-500">#</TableHead>
                                      <TableHead className="text-[11px] font-bold uppercase text-slate-500">Course Code</TableHead>
                                      <TableHead className="text-[11px] font-bold uppercase text-slate-500">Course Name</TableHead>
                                      <TableHead className="text-[11px] font-bold uppercase text-slate-500">Course Type</TableHead>
                                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 text-center">Credit</TableHead>
                                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 text-center">Grade</TableHead>
                                      <TableHead className="text-[11px] font-bold uppercase text-slate-500 text-center">Remarks</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {semester.courses.map((course, idx) => (
                                      <TableRow key={course.code} className="hover:bg-slate-50/50">
                                        <TableCell className="text-center text-slate-400 text-xs font-medium">{idx + 1}</TableCell>
                                        <TableCell className="font-bold text-slate-700 text-xs">{course.code}</TableCell>
                                        <TableCell className="text-slate-600 text-xs uppercase">{course.name}</TableCell>
                                        <TableCell className="text-slate-500 text-xs">{course.type}</TableCell>
                                        <TableCell className="text-center font-semibold text-slate-600 text-xs">{course.credit.toFixed(1)}</TableCell>
                                        <TableCell className="text-center font-black text-slate-800 text-xs">{course.grade}</TableCell>
                                        <TableCell className="text-center p-1">
                                           <div className={`py-1.5 rounded text-[10px] font-bold uppercase ${
                                             course.remarks === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                           }`}>
                                             {course.remarks}
                                           </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                             </div>
                          </div>
                       </details>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          
          {/* Mock empty years for visual consistency with screenshot */}
          <AccordionItem value="3rd Year" className="bg-white border rounded-lg opacity-60">
            <AccordionTrigger className="px-6 py-5 cursor-not-allowed">
              <div className="flex flex-col items-start gap-1">
                <h3 className="text-lg font-bold text-slate-800">3rd Year of Study</h3>
                <p className="text-xs text-slate-400">2025/2026 Academic Year</p>
              </div>
            </AccordionTrigger>
          </AccordionItem>
          <AccordionItem value="4th Year" className="bg-white border rounded-lg opacity-60">
            <AccordionTrigger className="px-6 py-5 cursor-not-allowed">
              <div className="flex flex-col items-start gap-1">
                <h3 className="text-lg font-bold text-slate-800">4th Year of Study</h3>
                <p className="text-xs text-slate-400">2026/2027 Academic Year</p>
              </div>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-slate-400 text-[11px] font-medium">
           Copyright © 2026 <span className="text-blue-600 font-bold">The University of Dodoma (UDOM)</span> All rights reserved [Version 2.0]
        </div>
      </div>
    </div>
  );
}
