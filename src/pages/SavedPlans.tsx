import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Dumbbell, 
  Apple, 
  Calendar,
  Trash2,
  Eye,
  Search,
  Filter
} from 'lucide-react';

const SavedPlans = () => {
  const { user, deletePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'workout' | 'diet'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in to view your saved plans</h2>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const savedPlans = user.savedPlans || [];
  
  const filteredPlans = savedPlans.filter(plan => {
    const matchesType = filterType === 'all' || plan.type === filterType;
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      deletePlan(planId);
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
      }
    }
  };

  const formatPlanContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <h2 key={index} className="text-xl font-bold text-slate-900 mt-4 mb-2">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h2>
        );
      } else if (trimmedLine.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-slate-800 mt-3 mb-2">
            {trimmedLine.replace(/^#+\s*/, '')}
          </h3>
        );
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        return (
          <li key={index} className="text-slate-700 mb-1 ml-4">
            {trimmedLine.replace(/^[-*]\s*/, '')}
          </li>
        );
      } else if (trimmedLine) {
        return (
          <p key={index} className="text-slate-700 mb-2 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">📚 Saved Plans</h1>
          <p className="text-slate-600">
            Access all your saved workout and diet plans in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plans List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              {/* Search and Filter */}
              <div className="mb-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search plans..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterType === 'all'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('workout')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterType === 'workout'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Workouts
                  </button>
                  <button
                    onClick={() => setFilterType('diet')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterType === 'diet'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Diet
                  </button>
                </div>
              </div>

              {/* Plans List */}
              <div className="space-y-3">
                {filteredPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">No saved plans found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Create some workout or diet plans to see them here!
                    </p>
                  </div>
                ) : (
                  filteredPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPlan?.id === plan.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <div className={`p-2 rounded-lg mr-3 ${
                            plan.type === 'workout' ? 'bg-blue-100' : 'bg-orange-100'
                          }`}>
                            {plan.type === 'workout' ? (
                              <Dumbbell className={`h-4 w-4 ${
                                plan.type === 'workout' ? 'text-blue-600' : 'text-orange-600'
                              }`} />
                            ) : (
                              <Apple className="h-4 w-4 text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900 mb-1">
                              {plan.title}
                            </h3>
                            <div className="flex items-center text-xs text-slate-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlan(plan.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="lg:col-span-2">
            {selectedPlan ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className={`p-6 ${
                  selectedPlan.type === 'workout'
                    ? 'bg-gradient-to-r from-blue-600 to-emerald-600'
                    : 'bg-gradient-to-r from-orange-600 to-emerald-600'
                } text-white`}>
                  <div className="flex items-center">
                    <div className="p-3 bg-white/20 rounded-lg mr-4">
                      {selectedPlan.type === 'workout' ? (
                        <Dumbbell className="h-6 w-6" />
                      ) : (
                        <Apple className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{selectedPlan.title}</h2>
                      <p className="text-white/80">
                        Created on {new Date(selectedPlan.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="prose prose-slate max-w-none">
                    {formatPlanContent(selectedPlan.content)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 text-center">
                <Eye className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Select a Plan to View
                </h3>
                <p className="text-slate-600">
                  Choose a saved workout or diet plan from the list to view its details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPlans;