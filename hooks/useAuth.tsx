'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '@/types/models';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserData({ id: userDoc.id, ...userDoc.data() } as any);
          } else {
            // Fallback for authenticated users without a firestore document
            setUserData({
              uid: firebaseUser.uid,
              companyId: 'default',
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
              email: firebaseUser.email || '',
              role: 'Admin',
              status: 'active',
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.warn("User document not found or access denied, using fallback data.");
          // Still allow them to be authenticated
          setUserData({
            uid: firebaseUser.uid,
            companyId: 'default',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Admin',
            email: firebaseUser.email || '',
            role: 'Admin',
            status: 'active',
            createdAt: new Date(),
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
