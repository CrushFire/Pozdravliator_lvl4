import React, { useState } from 'react';
import api from '../api/axios';
import type { RegistrationRequest } from '../types/auth';
import { AuthErrors } from '../utils/errors/AuthErrors';
import { useNavigate } from 'react-router-dom';

import '../styles/index.css';

export const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const requestBody: RegistrationRequest = {
        name,
        email,
        password,
      };

      const response = await api.post('/authentication/registration', requestBody);
      const token = response.data.data.token;
      localStorage.setItem('token', token);

      navigate('/main');
    } catch (err: unknown) {
          const errorMessage = AuthErrors(err);
          setError(errorMessage);
        }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Регистрация</h2>

        <input
          type="text"
          placeholder="Введите имя"
          value={name}
          onChange={e => setName(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="email"
          placeholder="Введите почту"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="login-input"
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-button">
          Войти
        </button>

        <div className="login-register-text">
          Есть аккаунт?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="login-register-button"
          >
            Войдите
          </button>
        </div>
      </form>
    </div>
  );
};