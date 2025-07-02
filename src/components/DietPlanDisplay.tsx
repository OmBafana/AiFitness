import React from 'react';
import { Apple, Clock, Target, CheckCircle, Bookmark, Utensils } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DietPlanDisplayProps {
  plan: string;
  isLoading: boolean;
}

const DietPlanDisplay: React.FC<DietPlanDisplayProps> = ({ plan, isLoading }) => {
  const { savePlan } = useAuth();

  const saveMealPlan = () => {
    const planTitle = `Diet Plan - ${new Date().toLocaleDateString()}`;
    savePlan({
      type: 'diet',
      title: planTitle,
      content: plan
    });
    alert('Diet plan saved successfully!');
  };

  if (isLoading) {
    return (
      <div className="diet-loading bg-gradient-to-br from-orange-50 to-emerald-50 rounded-2xl p-8 shadow-lg border border-orange-200">
        <div className="loading-wrapper text-center">
          <div className="spinner-wrapper relative">
            <div className="diet-spinner animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mx-auto mb-6"></div>
            <div className="spinner-apple absolute inset-0 flex items-center justify-center">
              <Apple className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="loading-heading text-xl font-bold text-slate-900 mb-3">
            🍎 AI Nutritionist at Work
          </h3>
          <p className="loading-description text-slate-600 text-lg">
            Creating a delicious and nutritious meal plan tailored to your goals...
          </p>
          <div className="bounce-dots mt-4 flex justify-center space-x-2">
            <div className="bounce-dot w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="bounce-dot w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="bounce-dot w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  // Enhanced formatting for better visual appeal
  const formatMealPlan = (text: string) => {
    return text.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <div key={index} className="diet-main-heading mb-6">
            <h2 className="diet-title text-2xl font-bold text-slate-900 bg-gradient-to-r from-orange-600 to-emerald-600 bg-clip-text text-transparent">
              {trimmedLine.replace(/^#+\s*/, '')}
            </h2>
            <div className="diet-underline h-1 w-20 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full mt-2"></div>
          </div>
        );
      } else if (trimmedLine.startsWith('## ')) {
        return (
          <h3 key={index} className="diet-section text-xl font-bold text-slate-800 mt-6 mb-3 flex items-center">
            <div className="section-dot w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
            {trimmedLine.replace(/^#+\s*/, '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('### ')) {
        return (
          <h4 key={index} className="diet-subsection text-lg font-semibold text-slate-700 mt-4 mb-2 pl-4 border-l-3 border-orange-400">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h4>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        return (
          <div key={index} className="diet-list-item flex items-start mb-2 ml-4">
            <div className="diet-bullet w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            <span className="diet-item-text text-slate-700 leading-relaxed">
              {trimmedLine.replace(/^[-*]\s*/, '')}
            </span>
          </div>
        );
      } else if (trimmedLine.match(/^\d+\./)) {
        return (
          <div key={index} className="diet-numbered flex items-start mb-2 ml-4">
            <div className="diet-number bg-orange-100 text-orange-700 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 flex-shrink-0 mt-0.5">
              {trimmedLine.match(/^\d+/)?.[0]}
            </div>
            <span className="diet-numbered-text text-slate-700 leading-relaxed">
              {trimmedLine.replace(/^\d+\.\s*/, '')}
            </span>
          </div>
        );
      } else if (trimmedLine) {
        return (
          <p key={index} className="diet-paragraph text-slate-700 mb-3 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
      return <div key={index} className="diet-spacer mb-2"></div>;
    });
  };

  return (
    <div className="diet-plan-wrapper bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="diet-header bg-gradient-to-r from-orange-600 to-emerald-600 p-6 text-white">
        <div className="diet-header-content flex items-center justify-between">
          <div className="diet-header-info flex items-center">
            <div className="diet-icon-wrapper p-3 bg-white/20 rounded-lg mr-4">
              <Apple className="h-8 w-8" />
            </div>
            <div className="diet-header-text">
              <h3 className="diet-plan-title text-2xl font-bold mb-1">
                🥗 Your AI-Generated Diet Plan
              </h3>
              <p className="diet-subtitle text-orange-100">Nutritionally balanced for your goals</p>
            </div>
          </div>
          <button
            onClick={saveMealPlan}
            className="diet-save-btn flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save Plan
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="diet-content p-6">
        <div className="diet-formatted prose prose-slate max-w-none">
          {formatMealPlan(plan)}
        </div>

        {/* Footer */}
        <div className="diet-footer mt-8 p-6 bg-gradient-to-r from-orange-50 to-emerald-50 rounded-xl border border-orange-200">
          <div className="diet-footer-content flex items-center text-orange-800">
            <CheckCircle className="h-6 w-6 mr-3 text-orange-600" />
            <div className="diet-footer-text">
              <p className="diet-footer-title font-semibold text-lg">🌟 Nutrition Success Tips</p>
              <p className="diet-footer-message text-orange-700">
                Stay hydrated, listen to your hunger cues, and adjust portions based on your energy levels!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanDisplay;