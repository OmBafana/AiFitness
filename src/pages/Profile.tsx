import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Weight, 
  Ruler, 
  Target,
  Edit3,
  Save,
  X,
  Camera,
  Settings,
  Award,
  TrendingUp
} from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    weight: user?.weight || '',
    height: user?.height || '',
    goals: user?.goals || []
  });

  const fitnessGoals = [
    { id: 'lose_weight', label: 'Lose Weight' },
    { id: 'build_muscle', label: 'Build Muscle' },
    { id: 'improve_endurance', label: 'Improve Endurance' },
    { id: 'increase_strength', label: 'Increase Strength' },
    { id: 'stay_healthy', label: 'Stay Healthy' },
    { id: 'sport_performance', label: 'Sport Performance' }
  ];

  const achievements = [
    { id: 1, title: 'First Workout', description: 'Completed your first workout', icon: Award, earned: true },
    { id: 2, title: 'Week Warrior', description: '7 days workout streak', icon: TrendingUp, earned: true },
    { id: 3, title: 'Goal Crusher', description: 'Achieved monthly goal', icon: Target, earned: false },
    { id: 4, title: 'Consistency King', description: '30 days workout streak', icon: Calendar, earned: false }
  ];

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      age: parseInt(formData.age) || undefined,
      weight: parseInt(formData.weight) || undefined,
      height: parseInt(formData.height) || undefined,
      goals: formData.goals
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      age: user?.age || '',
      weight: user?.weight || '',
      height: user?.height || '',
      goals: user?.goals || []
    });
    setIsEditing(false);
  };

  const handleGoalChange = (goalId: string) => {
    setFormData({
      ...formData,
      goals: formData.goals.includes(goalId)
        ? formData.goals.filter(id => id !== goalId)
        : [...formData.goals, goalId]
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in to access your profile</h2>
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600">
            Manage your personal information and fitness preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Picture */}
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-emerald-600" />
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-slate-900">{user.name}</h4>
                  <p className="text-slate-600">{user.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <User className="h-5 w-5 text-slate-400 mr-3" />
                      <span className="text-slate-900">{user.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                    <Mail className="h-5 w-5 text-slate-400 mr-3" />
                    <span className="text-slate-900">{user.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-slate-400 mr-3" />
                      <span className="text-slate-900">{user.age || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Weight (lbs)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <Weight className="h-5 w-5 text-slate-400 mr-3" />
                      <span className="text-slate-900">{user.weight || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Height (inches)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                      <Ruler className="h-5 w-5 text-slate-400 mr-3" />
                      <span className="text-slate-900">{user.height || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Fitness Goals */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Fitness Goals
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-3">
                    {fitnessGoals.map((goal) => (
                      <label key={goal.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.goals.includes(goal.id)}
                          onChange={() => handleGoalChange(goal.id)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                        />
                        <span className="ml-2 text-sm text-slate-700">{goal.label}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.goals?.map((goalId) => {
                      const goal = fitnessGoals.find(g => g.id === goalId);
                      return goal ? (
                        <span
                          key={goalId}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                        >
                          {goal.label}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Member Since</span>
                  <span className="font-medium">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total Workouts</span>
                  <span className="font-medium">28</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Current Streak</span>
                  <span className="font-medium">12 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Achievements</span>
                  <span className="font-medium">2/4</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-3 rounded-lg ${
                      achievement.earned ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${
                      achievement.earned ? 'bg-emerald-100' : 'bg-slate-200'
                    }`}>
                      <achievement.icon className={`h-5 w-5 ${
                        achievement.earned ? 'text-emerald-600' : 'text-slate-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.earned ? 'text-emerald-900' : 'text-slate-600'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;