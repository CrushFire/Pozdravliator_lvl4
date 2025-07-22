import axios from 'axios';

export function AuthErrors(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;

    switch (status) {
      case 401:
        return 'Неверный пароль';
      case 404:
        return 'Данная почта не зарегестрирована';
      case 409:
        return 'Эта почта уже используется';
      default:
        return err.response?.data?.message || 'Ошибка при выполнении запроса';
    }
  }

  return 'Произошла неизвестная ошибка';
}