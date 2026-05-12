import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, FileText, Copy, Check } from 'lucide-react';
import { Button } from './ui/Common';
import { WeeklyReport } from '../types';
import { dataService } from '../services/dataService';

interface ReportViewerProps {
  student: any;
  reports: WeeklyReport[];
  onClose: () => void;
}

export function ReportViewer({ student, reports, onClose }: ReportViewerProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const studentReports = reports.filter(r => r.studentId === student.id);

  const handleExport = async (report: WeeklyReport) => {
    setExporting(report.id);
    try {
      const content = `
WEEKLY REPORT: ${student.fullName}
Week Ending: ${report.weekEnding}
Pathway: ${student.pathway}

TOPIC TO DISCUSS:
${report.topicToDiscuss}

GRADES:
${Object.entries(report.grades).map(([c, g]) => `${c}: ${g}`).join('\n')}

HIGHLIGHTS:
${report.highlights.join('\n')}

SENTIMENT:
Classes: ${report.feelingsClasses}
Instructors: ${report.feelingsInstructors}

REFLECTION:
${report.closingReflection}

Submitted on: ${new Date(report.submittedAt).toLocaleString()}
      `;
      
      await dataService.exportToDoc(`Weekly Report - ${student.fullName} - ${report.weekEnding}`, content);
    } catch (error) {
      console.error(error);
      alert("Note: Google Doc creation requires OAuth configured in the backend. Data was synced to Sheets if GOOGLE_SHEET_ID is set.");
    } finally {
      setExporting(null);
    }
  };

  const copyToClipboard = (report: WeeklyReport) => {
    const text = `Weekly Report - ${student.fullName} (${report.weekEnding})\n\nTopic: ${report.topicToDiscuss}\nReflection: ${report.closingReflection}`;
    navigator.clipboard.writeText(text);
    setCopied(report.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white text-gray-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-200">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                {student.fullName}
                <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">@{student.username}</span>
              </h3>
              <p className="text-sm text-gray-400 capitalize font-medium">{student.pathway} Pathway</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-full w-10 h-10 p-0 text-gray-400">✕</Button>
        </div>
        
        <div className="overflow-y-auto p-8 space-y-12 flex-1 bg-gray-50/30">
          {studentReports.length === 0 ? (
            <div className="text-center py-24 grayscale opacity-30">
              <BarChart3 className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <p className="font-bold text-2xl text-gray-400 tracking-tight">No reports submitted yet.</p>
            </div>
          ) : (
            studentReports.map((r) => (
              <div key={r.id} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm first:ring-2 first:ring-blue-500/10">
                <div className="flex items-center gap-4">
                  <h4 className="text-base font-black bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-sm tracking-wide">
                    {new Date(r.submittedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="h-px flex-1 bg-gray-100" />
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-full gap-2 text-xs font-bold"
                      onClick={() => copyToClipboard(r)}
                    >
                      {copied === r.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === r.id ? 'Copied' : 'Copy'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full gap-2 text-xs font-bold border-gray-200"
                      onClick={() => handleExport(r)}
                      disabled={exporting === r.id}
                    >
                      {exporting === r.id ? (
                        <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      Google Doc
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">Topic to Discuss</label>
                    <p className="text-gray-800 font-semibold text-lg leading-tight">{r.topicToDiscuss || 'No topic specified'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">Grades Overview</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {Object.entries(r.grades).map(([cls, grade]: any) => (
                        <div key={cls} className="text-[10px] font-black px-2.5 py-1.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                          <span className="text-gray-400">{cls}:</span> <span className={grade === 'Exceeding' ? 'text-green-600' : 'text-blue-600'}>{grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Highlights</label>
                  <ul className="grid grid-cols-1 gap-2">
                    {r.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-gray-700 bg-gray-50/50 p-4 rounded-2xl text-sm font-medium border border-gray-100">
                        <span className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 shrink-0 shadow-sm border border-gray-100">{idx+1}</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Classes Sentiment</label>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic border-l-4 border-blue-100 pl-4 bg-blue-50/20 py-2 rounded-r-xl">{r.feelingsClasses || 'No feelings shared'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instructors Sentiment</label>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-4 bg-indigo-50/20 py-2 rounded-r-xl">{r.feelingsInstructors || 'No feelings shared'}</p>
                  </div>
                </div>

                {Object.keys(r.customQuestionAnswers || {}).length > 0 && (
                  <div className="bg-pink-50/30 p-6 rounded-3xl border border-pink-100 space-y-4">
                    <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Custom Question Answers</label>
                    {Object.entries(r.customQuestionAnswers).map(([qid, answer]) => (
                      <div key={qid} className="space-y-1">
                        <p className="text-sm text-pink-900 font-bold leading-relaxed">{answer as string}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-gray-900 p-8 rounded-3xl text-white shadow-xl shadow-gray-200">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Weekly Reflection</label>
                  <p className="text-gray-100 leading-relaxed font-serif text-lg italic">"{r.closingReflection}"</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
