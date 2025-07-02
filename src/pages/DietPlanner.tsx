import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { geminiService, DietRequest } from '../services/geminiService';
import DietPlanDisplay from '../components/DietPlanDisplay';
import { 
  Apple, 
  Target, 
  Clock, 
  Utensils, 
  Plus,
  ChefHat,
  Calendar,
  TrendingUp,
  Scale,
  Zap
} from 'lucide-react';

const DietPlanner = () => {
  const { user } = useAuth();
  const [nutritionGoal, setNutritionGoal] = useState('');
  const [dailyMeals, setDailyMeals] = useState('');
  const [eatingStyle, setEatingStyle] = useState('');
  const [mealPlan, setMealPlan] = useState('');
  const [planGenerating, setPlanGenerating] = useState(false);

  const nutritionGoals = [
    { id: 'weight_loss', label: 'Weight Loss', icon: TrendingUp, color: 'bg-red-500' },
    { id: 'muscle_gain', label: 'Muscle Gain', icon: Target, color: 'bg-blue-500' },
    { id: 'maintenance', label: 'Maintenance', icon: Scale, color: 'bg-emerald-500' },
    { id: 'performance', label: 'Performance', icon: Zap, color: 'bg-purple-500' }
  ];

  const mealFrequency = [
    { id: '3', label: '3 Meals/Day' },
    { id: '4', label: '4 Meals/Day' },
    { id: '5', label: '5 Meals/Day' },
    { id: '6', label: '6 Meals/Day' }
  ];

  const dietaryStyles = [
    { id: 'balanced', label: 'Balanced' },
    { id: 'keto', label: 'Ketogenic' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'mediterranean', label: 'Mediterranean' }
  ];

  const buildMealPlan = async () => {
    if (!nutritionGoal || !dailyMeals || !eatingStyle) {
      return;
    }

    setPlanGenerating(true);
    setMealPlan('');

    try {
      const dietRequest = {
        goal: nutritionGoal,
        meals: dailyMeals,
        dietType: eatingStyle,
        weight: user?.weight,
        height: user?.height,
        age: user?.age,
        preferences: user?.goals || []
      };

      const newMealPlan = await geminiService.generateDietPlan(dietRequest);
      setMealPlan(newMealPlan);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      alert('Failed to generate diet plan. Please try again.');
    } finally {
      setPlanGenerating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in to access diet planner</h2>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">🍎 Smart Diet Planner</h1>
          <p className="text-slate-600">
            Get personalized meal plans and nutrition advice tailored to your goals and preferences.
          </p>
        </div>

        <div className="nutrition-builder space-y-8">
          {/* Diet Configuration */}
          <div className="meal-setup space-y-6">
            {/* Goal Selection */}
            <div className="nutrition-goals bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="section-header text-xl font-semibold text-slate-900 mb-4">🎯 Select Your Goal</h3>
              <div className="goals-layout grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {nutritionGoals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setNutritionGoal(goal.id)}
                    className={`nutrition-card p-4 rounded-xl border-2 transition-all duration-200 ${
                      nutritionGoal === goal.id
                        ? 'border-emerald-500 bg-emerald-50 transform scale-105'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className="card-content flex flex-col items-center">
                      <div className={`icon-wrapper p-3 rounded-lg ${goal.color} mb-3`}>
                        <goal.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="goal-text font-medium text-slate-900">{goal.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Meals and Diet Type Selection */}
            <div className="preferences-row grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Meals Per Day */}
              <div className="meal-frequency bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="section-header text-xl font-semibold text-slate-900 mb-4">🍽️ Meals Per Day</h3>
                <div className="frequency-grid grid grid-cols-2 gap-3">
                  {mealFrequency.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setDailyMeals(option.id)}
                      className={`meal-option p-3 rounded-lg border-2 transition-all duration-200 ${
                        dailyMeals === option.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Utensils className="h-5 w-5 mx-auto mb-1" />
                      <span className="option-text text-sm font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Type */}
              <div className="diet-styles bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <h3 className="section-header text-xl font-semibold text-slate-900 mb-4">🥗 Diet Type</h3>
                <div className="styles-grid grid grid-cols-2 gap-3">
                  {dietaryStyles.map((diet) => (
                    <button
                      key={diet.id}
                      onClick={() => setEatingStyle(diet.id)}
                      className={`diet-choice p-4 rounded-lg border-2 transition-all duration-200 ${
                        eatingStyle === diet.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Apple className="h-5 w-5 mx-auto mb-2" />
                      <span className="diet-label text-sm font-medium">{diet.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="create-plan text-center">
              <button
                onClick={buildMealPlan}
                disabled={!nutritionGoal || !dailyMeals || !eatingStyle || planGenerating}
                className="create-btn bg-gradient-to-r from-orange-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-orange-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center mx-auto"
              >
                <ChefHat className="h-5 w-5 mr-2" />
                {planGenerating ? '🤖 Generating AI Meal Plan...' : '✨ Generate AI Meal Plan'}
              </button>
            </div>
          </div>

          {/* Diet Plan Display */}
          {(mealPlan || planGenerating) && (
            <div className="meal-plan-area">
              <DietPlanDisplay 
                plan={mealPlan} 
                isLoading={planGenerating}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;