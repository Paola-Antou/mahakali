import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import bcrypt from 'bcryptjs';
import { getDatabase, initDatabase, saveDatabase } from '@/lib/db';

interface User {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

interface UserPermissions {
  can_stock: boolean;
  can_movements: boolean;
  can_expenses: boolean;
  can_dashboard: boolean;
  can_sales: boolean;
  can_debtors: boolean;
  can_invoices: boolean;
}

interface AuthContextType {
  user: User | null;
  permissions: UserPermissions | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, role?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize database and check for existing session
  useEffect(() => {
    const initAuth = async () => {
      try {
        await initDatabase();
        
        // Check for stored session
        const storedUser = localStorage.getItem('mahakali_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          await loadUserData(userData.id);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUserData = async (userId: number) => {
    try {
      const db = getDatabase();
      
      // Load user data
      const userResult = db.exec(`
        SELECT id, email, role, created_at 
        FROM users 
        WHERE id = ?
      `, [userId]);

      if (userResult.length > 0 && userResult[0].values.length > 0) {
        const userData = userResult[0].values[0];
        const user: User = {
          id: userData[0] as number,
          email: userData[1] as string,
          role: userData[2] as string,
          created_at: userData[3] as string,
        };
        setUser(user);

        // Load permissions
        const permResult = db.exec(`
          SELECT can_stock, can_movements, can_expenses, can_dashboard, 
                 can_sales, can_debtors, can_invoices
          FROM user_permissions 
          WHERE user_id = ?
        `, [userId]);

        if (permResult.length > 0 && permResult[0].values.length > 0) {
          const permData = permResult[0].values[0];
          const permissions: UserPermissions = {
            can_stock: Boolean(permData[0]),
            can_movements: Boolean(permData[1]),
            can_expenses: Boolean(permData[2]),
            can_dashboard: Boolean(permData[3]),
            can_sales: Boolean(permData[4]),
            can_debtors: Boolean(permData[5]),
            can_invoices: Boolean(permData[6]),
          };
          setPermissions(permissions);
        }

        // Store session
        localStorage.setItem('mahakali_user', JSON.stringify({ id: user.id, email: user.email }));
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      logout();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const db = getDatabase();
      
      // Find user by email
      const result = db.exec(`
        SELECT id, email, password_hash, role, created_at 
        FROM users 
        WHERE email = ?
      `, [email]);

      if (result.length === 0 || result[0].values.length === 0) {
        return false;
      }

      const userData = result[0].values[0];
      const storedHash = userData[2] as string;

      // Verify password
      const isValid = bcrypt.compareSync(password, storedHash);
      if (!isValid) {
        return false;
      }

      // Load user data and permissions
      await loadUserData(userData[0] as number);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setPermissions(null);
    localStorage.removeItem('mahakali_user');
  };

  const register = async (email: string, password: string, role: string = 'user'): Promise<boolean> => {
    try {
      const db = getDatabase();
      
      // Check if user already exists
      const existingUser = db.exec(`
        SELECT id FROM users WHERE email = ?
      `, [email]);

      if (existingUser.length > 0 && existingUser[0].values.length > 0) {
        return false; // User already exists
      }

      // Hash password
      const passwordHash = bcrypt.hashSync(password, 10);

      // Insert new user
      db.run(`
        INSERT INTO users (email, password_hash, role) 
        VALUES (?, ?, ?)
      `, [email, passwordHash, role]);

      // Get the new user ID
      const newUserResult = db.exec(`
        SELECT id FROM users WHERE email = ?
      `, [email]);

      if (newUserResult.length > 0 && newUserResult[0].values.length > 0) {
        const userId = newUserResult[0].values[0][0] as number;

        // Create default permissions
        db.run(`
          INSERT INTO user_permissions (
            user_id, can_stock, can_movements, can_expenses, 
            can_dashboard, can_sales, can_debtors, can_invoices
          ) VALUES (?, 1, 1, 1, 1, 1, 1, 1)
        `, [userId]);

        saveDatabase();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    permissions,
    isLoading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;