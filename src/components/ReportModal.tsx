import React, { useState } from 'react';
import { X, Download, FileText, Heart, Brain, Target, Lightbulb, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BACKEND_URL } from '@/config/api';

interface ReportData {
  user_name: string;
  session_summary: string;
  emotional_snapshot: {
    current_vibe: string;
    energy: string;
    focus_state: string;
  };
  your_strengths: string[];
  growth_focus: string[];
  next_micro_actions: string[];
  coach_reflection: string;
  mood_icon: string;
  report_version: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null;
  sessionId: string | null;
}

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, reportData, sessionId }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!sessionId) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/download-report/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mina_report_${sessionId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen || !reportData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-primary">Session Report</h2>
                <p className="text-sm text-muted-foreground">
                  {reportData.user_name} • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="rounded-full w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-8">
            
            {/* Session Summary */}
            <div className="bg-card/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-2">Session Summary</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {reportData.session_summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Emotional Snapshot */}
            <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 border border-border/50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-4">Emotional Snapshot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Current Vibe</h4>
                      <p className="text-foreground">{reportData.emotional_snapshot.current_vibe}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Energy</h4>
                      <p className="text-foreground">{reportData.emotional_snapshot.energy}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Focus State</h4>
                      <p className="text-foreground">{reportData.emotional_snapshot.focus_state}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Strengths */}
            <div className="bg-card/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-4">Your Strengths</h3>
                  <div className="space-y-3">
                    {reportData.your_strengths.map((strength, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Focus */}
            <div className="bg-card/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-4">Growth Focus</h3>
                  <div className="space-y-3">
                    {reportData.growth_focus.map((focus, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground">{focus}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Micro Actions */}
            <div className="bg-card/50 rounded-xl p-6 border border-border/50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-4">Next Micro Actions</h3>
                  <div className="space-y-3">
                    {reportData.next_micro_actions.map((action, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                        <p className="text-muted-foreground">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Coach Reflection */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-border/50">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-3">Coach Reflection</h3>
                  <div className="bg-background/50 rounded-lg p-4 border-l-4 border-primary/30">
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{reportData.coach_reflection}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center py-4 border-t border-border/50">
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <span className="text-2xl">{reportData.mood_icon}</span>
                <span className="text-sm">Generated by MINA • {reportData.report_version}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
