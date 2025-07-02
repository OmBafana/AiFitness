import React from 'react';
import { Clock, Target, Dumbbell, CheckCircle, Save, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface WorkoutPlanDisplayProps {
  plan: string;
  isLoading: boolean;
  onStartWorkout?: () => void;
}

const WorkoutPlanDisplay: React.FC<WorkoutPlanDisplayProps> = ({ 
  plan, 
  isLoading, 
  onStartWorkout 
}) => {
  const { savePlan } = useAuth();

  const saveWorkoutPlan = () => {
    const planTitle = `Workout Plan - ${new Date().toLocaleDateString()}`;
    savePlan({
      type: 'workout',
      title: planTitle,
      content: plan
    });
    alert('Workout plan saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="workout-loading bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 shadow-lg border border-emerald-200">
        <div className="loading-content text-center">
          <div className="spinner-container relative">
            <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
            <div className="spinner-icon absolute inset-0 flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <h3 className="loading-title text-xl font-bold text-slate-900 mb-3">
            🤖 AI is Crafting Your Perfect Workout
          </h3>
          <p className="loading-text text-slate-600 text-lg">
            Analyzing your goals and creating a personalized routine...
          </p>
          <div className="loading-dots mt-4 flex justify-center space-x-2">
            <div className="dot w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
            <div className="dot w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="dot w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  // Enhanced formatting for better visual appeal
  const formatWorkoutPlan = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <div key={index} className="main-heading mb-6">
            <h2 className="plan-title text-2xl font-bold text-slate-900 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              {trimmedLine.replace(/^#+\s*/, '')}
            </h2>
            <div className="title-underline h-1 w-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mt-2"></div>
          </div>
        );
      } else if (trimmedLine.startsWith('## ')) {
        return (
          <h3 key={index} className="section-heading text-xl font-bold text-slate-800 mt-6 mb-3 flex items-center">
            <div className="heading-dot w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            {trimmedLine.replace(/^#+\s*/, '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('### ')) {
        return (
          <h4 key={index} className="subsection-heading text-lg font-semibold text-slate-700 mt-4 mb-2 pl-4 border-l-3 border-emerald-400">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h4>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        return (
          <div key={index} className="list-item flex items-start mb-2 ml-4">
            <div className="bullet w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="item-text text-slate-700 leading-relaxed">
              {trimmedLine.replace(/^[-*]\s*/, '')}
            </span>
          </div>
        );
      } else if (trimmedLine.match(/^\d+\./)) {
        return (
          <div key={index} className="numbered-item flex items-start mb-2 ml-4">
            <div className="number-badge bg-emerald-100 text-emerald-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">
              {trimmedLine.match(/^\d+/)?.[0]}
            </div>
            <span className="numbered-text text-slate-700 leading-relaxed">
              {trimmedLine.replace(/^\d+\.\s*/, '')}
            </span>
          </div>
        );
      } else if (trimmedLine) {
        return (
          <p key={index} className="paragraph text-slate-700 mb-3 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
      return <div key={index} className="spacer mb-2"></div>;
    });
  };

  return (
    <div className="workout-plan-container bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="plan-header bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-white">
        <div className="header-content flex items-center justify-between">
          <div className="header-info flex items-center">
            <div className="header-icon p-3 bg-white/20 rounded-lg mr-4">
              <Dumbbell className="h-8 w-8" />
            </div>
            <div className="header-text">
              <h3 className="plan-heading text-2xl font-bold mb-1">
                🎯 Your AI-Generated Workout Plan
              </h3>
              <p className="plan-subtitle text-emerald-100">Personalized just for you</p>
            </div>
          </div>
          <div className="header-actions flex space-x-3">
            <button
              onClick={saveWorkoutPlan}
              className="save-button flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Save Plan
            </button>
            {onStartWorkout && (
              <button
                onClick={onStartWorkout}
                className="start-button flex items-center px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-semibold"
              >
                <Target className="h-4 w-4 mr-2" />
                Start Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="plan-content p-6">
        <div className="formatted-plan prose prose-slate max-w-none">
          {formatWorkoutPlan(plan)}
        </div>

        {/* Footer */}
        <div className="plan-footer mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
          <div className="footer-content flex items-center text-emerald-800">
            <CheckCircle className="h-6 w-6 mr-3 text-emerald-600" />
            <div className="footer-text">
              <p className="footer-title font-semibold text-lg">💪 Ready to Transform?</p>
              <p className="footer-message text-emerald-700">
                Remember to listen to your body, stay hydrated, and adjust intensity as needed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDisplay;