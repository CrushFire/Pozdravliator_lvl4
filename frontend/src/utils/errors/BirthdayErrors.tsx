import axios from 'axios';

export function BirthdayErrors(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;

    switch (status) {
        case 400:
            return 'Дата не может быть больше текущей'
      case 404:
        return 'Не удалось найти запись';
      case 500:
        return 'Ошибка сервера при обработке запроса';
      default:
        return err.response?.data?.message || 'Произошла ошибка';
    }
  }

  return 'Произошла неизвестная ошибка';
}