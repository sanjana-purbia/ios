import React, {createContext, useState, useEffect} from 'react';
import {MMKV} from 'react-native-mmkv';

const mmkv = new MMKV();

interface User {
  id: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  role: string;
}
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  userRole: string | null;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  userRole: null,
});

export const UserProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = mmkv.getString('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const {role} = user;
      setUserRole(role);
    }
  }, [user]);

  const setUserAndStore = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      mmkv.set('user', JSON.stringify(newUser));
    } else {
      mmkv.clearAll();
    }
  };

  const logout = () => {
    setUserAndStore(null);
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{user, setUser: setUserAndStore, logout, userRole}}>
      {children}
    </UserContext.Provider>
  );
};
