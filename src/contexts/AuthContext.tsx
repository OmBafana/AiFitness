import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SavedPlan {
  id: string;
  type: 'workout' | 'diet';
  title: string;
  content: string;
  createdAt: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  goals?: string[];
  savedPlans?: SavedPlan[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  savePlan: (plan: Omit<SavedPlan, 'id' | 'createdAt'>) => void;
  deletePlan: (planId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      age: 28,
      weight: 180,
      height: 70,
      goals: ['lose_weight', 'build_muscle'],
      savedPlans: []
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const register = async (userData: any) => {
    // Simulate API call
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      savedPlans: []
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const savePlan = (plan: Omit<SavedPlan, 'id' | 'createdAt'>) => {
    if (user) {
      const newPlan: SavedPlan = {
        ...plan,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      
      const updatedUser = {
        ...user,
        savedPlans: [...(user.savedPlans || []), newPlan]
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const deletePlan = (planId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        savedPlans: user.savedPlans?.filter(plan => plan.id !== planId) || []
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateProfile,
    savePlan,
    deletePlan
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};