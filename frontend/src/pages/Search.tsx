import { useEffect, useState } from 'react';
import type { BirthdayResponse, BirthdayFilterRequest } from '../types/birthday';
import { BirthdayCard } from '../components/BirthdayCard';
import api from '../api/axios';

const INTERVALS = ['Неделя', 'Месяц', 'Квартал', 'Полгода', 'Прошедшие'];
const TYPES = ['Все', 'Коллеги', 'Друзья', 'Знакомые', 'Семья', 'Другое'];
const pageSize = 15;

export const Search = () => {
  const [filter, setFilter] = useState<BirthdayFilterRequest>({
    timeInterval: 'Неделя',
    birthdayType: undefined,
    directionSort: 'desk',
    name: undefined,
    page: 1,
    pageSize: pageSize,
  });

  const [birthdays, setBirthdays] = useState<BirthdayResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(false);

  const fetchFiltered = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await api.post('/birthdays/by-filter', {
        ...filter,
        pageSize: pageSize + 1,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const data = response.data.data;
        const items = data.items || data;

        setBirthdays(items.slice(0, pageSize));
        setHasNextPage(items.length > pageSize);
      } else {
        setBirthdays([]);
        setHasNextPage(false);
      }
    } catch (e) {
      console.error('Ошибка при загрузке фильтрованных ДР:', e);
      setBirthdays([]);
      setHasNextPage(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltered();
  }, [filter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value === 'Все' ? undefined : value,
      page: 1,
    }));
  };

  const goToPrevPage = () => {
    if (filter.page > 1) {
      setFilter(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setFilter(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <div className="bc-container">
      <h2 className="bc-title">Фильтрация дней рождения</h2>

      <div className="filter-pos">
        <input
          type="text"
          name="name"
          placeholder="Имя именниника"
          className="filter"
          onChange={handleChange}
        />

        <select
          name="timeInterval"
          value={filter.timeInterval}
          className="filter"
          onChange={handleChange}
        >
          {INTERVALS.map(interval => (
            <option key={interval} value={interval}>
              {interval}
            </option>
          ))}
        </select>

        <select
          name="birthdayType"
          value={filter.birthdayType ?? 'Все'}
          className="filter"
          onChange={handleChange}
        >
          {TYPES.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          name="directionSort"
          value={filter.directionSort}
          className="filter"
          onChange={handleChange}
        >
          <option value="desk">Ближайшие в начале</option>
          <option value="ask">Ближайшие в конце</option>
        </select>
      </div>

      {loading && <p className="text-center">Загрузка...</p>}

      {!loading && birthdays.length === 0 && (
        <p className="text-center text-gray-500">Ничего не найдено</p>
      )}

      {!loading && birthdays.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {birthdays.map(birthday => (
              <BirthdayCard key={birthday.id} birthday={birthday} />
            ))}
          </div>

          <div className="bc-pagination mt-6">
            <button
              onClick={goToPrevPage}
              disabled={filter.page === 1}
              className="bc-button"
            >
              Предыдущая
            </button>

            <span className="bc-page-info">
              Страница {filter.page}
            </span>

            <button
              onClick={goToNextPage}
              disabled={!hasNextPage}
              className="bc-button"
            >
              Следующая
            </button>
          </div>
        </>
      )}
    </div>
  );
};