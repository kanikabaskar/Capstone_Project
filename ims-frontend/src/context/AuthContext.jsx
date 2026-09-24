import { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('imsUser') || 'null'));
  useEffect(() => { if (user) localStorage.setItem('imsUser', JSON.stringify(user)); else localStorage.removeItem('imsUser'); }, [user]);
  const login = (username, password, remember) => {
    if (!username.trim() || !password) return { ok: false, message: 'Username and password are required.' };
    // Demo-only authentication: no authentication API exists in the supplied backend.
    const registered = JSON.parse(localStorage.getItem('imsRegisteredUser') || 'null');
    if (registered && (registered.username !== username || registered.password !== password)) return { ok: false, message: 'Invalid username or password.' };
    const next = { username, name: registered?.fullName || username };
    setUser(next);
    if (remember) localStorage.setItem('imsRemembered', 'true');
    return { ok: true };
  };
  const register = data => { localStorage.setItem('imsRegisteredUser', JSON.stringify(data)); return { ok: true }; };
  const logout = () => { setUser(null); localStorage.removeItem('imsRemembered'); };
  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
