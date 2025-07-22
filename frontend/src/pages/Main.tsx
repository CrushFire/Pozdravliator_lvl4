import { useEffect, useState } from 'react';
import type { BirthdayResponse } from '../types/birthday';
import { BirthdayCard } from '../components/BirthdayCard';
import api from '../api/axios';

export const Main = () => {
  const [birthdays, setBirthdays] = useState<BirthdayResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [curPage, setCurPage] = useState(1);
  const pageSize = 15;
  const [hasNextPage, setHasNextPage] = useState(false);

  const currentYear = new Date().getFullYear();

  const fetchBirthdays = async (page: number) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const response = await api.get(`/birthdays?curPage=${page}&pageSize=${pageSize + 1}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const data: BirthdayResponse[] = response.data.data;

        setHasNextPage(data.length > pageSize);

        setBirthdays(data.slice(0, pageSize));
      }
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBirthdays(curPage);
  }, [curPage]);

  const goToPrevPage = () => {
    if (curPage > 1) setCurPage(curPage - 1);
  };

  const goToNextPage = () => {
    if (hasNextPage) setCurPage(curPage + 1);
  };

  return (
    <div className="bc-container">
      <h1 className="bc-title">
        Дни рождения на <span className="text-cyan-500">{currentYear}</span> 🎉
      </h1>

      {loading && <p className="text-center">Загрузка...</p>}

      {!loading && birthdays.length === 0 && (
        <p className="text-center text-gray-500">Нет записей</p>
      )}

      {!loading && birthdays.length > 0 && (
        <>
          <div>
            {birthdays.map(birthday => (
              <BirthdayCard key={birthday.id} birthday={birthday} />
            ))}
          </div>

          <div className="bc-pagination">
            <button
              onClick={goToPrevPage}
              disabled={curPage === 1}
              className="bc-button"
            >
              Предыдущая
            </button>

            <span className="bc-page-info">Страница {curPage}</span>

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