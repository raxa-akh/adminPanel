import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/authHook';
import { login } from '@/store/authThunks';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAppSelector(state => state.auth.isAuthenticated);

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const from = (location.state as LocationState)?.from?.pathname || '/users';
  
  if (auth) {
    const from = (location.state as LocationState)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err || 'Не удалось войти');
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: '200px auto' }}>
      <h2 style={{marginBottom: "20px", fontSize: "25px"}}>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email<br/>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </label>
        </div>
        <div style={{ marginTop: 8 }}>
          <label>
            Пароль<br/>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        <button type="submit" style={{ marginTop: 16 }}>
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
