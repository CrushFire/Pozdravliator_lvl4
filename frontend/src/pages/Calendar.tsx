import { useEffect, useState } from 'react';
import api from '../api/axios';
import type { BirthdayResponse } from '../types/birthday';

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

interface DayCell {
  date: Date | null;
  birthdays: BirthdayResponse[];
}

export const Calendar = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [birthdays, setBirthdays] = useState<BirthdayResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBirthdays = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/birthdays/by-month?month=${month}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setBirthdays(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, [month]);

  const buildCalendar = (): DayCell[] => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const days: DayCell[] = [];
    const firstDayWeekday = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < firstDayWeekday; i++) {
      days.push({ date: null, birthdays: [] });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month - 1, d);
      const bds = birthdays.filter(b => {
        const bdDate = new Date(b.birthDate);
        return bdDate.getDate() === d && bdDate.getMonth() + 1 === month;
      });
      days.push({ date, birthdays: bds });
    }

    while (days.length % 7 !== 0) {
      days.push({ date: null, birthdays: [] });
    }

    return days;
  };

  const calendarDays = buildCalendar();

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const today = new Date();

  return (
    <form
      className="bg-gradient-to-tr from-cyan-100 to-blue-200 rounded-2xl shadow-lg flex flex-col h-full p-4 max-w-6xl mx-auto"
      onSubmit={e => e.preventDefault()}
    >
      <h2 className="text-3xl font-extrabold text-cyan-800 text-center tracking-wide drop-shadow-md">
        Календарь дней рождений — {year}
      </h2>

      <div className="flex justify-between items-center mb-1">
        <button
          type="button"
          onClick={prevMonth}
          className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
        >
          ← Назад
        </button>

        <div className="font-semibold text-cyan-700 text-lg">
          {MONTH_NAMES[month - 1]} {year}
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
        >
          Вперёд →
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : (
        <>
          <div className="grid grid-cols-7 border-b border-cyan-400 pb-2 mb-4 text-center font-semibold text-cyan-700 select-none rounded-t-lg">
            {WEEK_DAYS.map(day => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(({ date, birthdays }, idx) => {
              const isToday =
                date &&
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] border rounded-lg p-2 flex flex-col ${
                    date ? 'bg-white shadow' : 'bg-transparent'
                  } ${isToday ? 'border-cyan-600 border-2' : ''}`}
                >
                  {date && (
                    <>
                      <div className="text-right font-semibold text-sm text-cyan-700">
                        {date.getDate()}
                      </div>

                      <div className="flex flex-wrap mt-1 gap-1 justify-start">
                        {birthdays.slice(0, 2).map(bd => (
                          <div
                            key={bd.id}
                            className="flex flex-col items-center w-12"
                            title={`${bd.name} — ${new Date(bd.birthDate).toLocaleDateString()}`}
                          >
                            { bd.image ? (
                            <img
                              src={`https://localhost:7138/${bd.image}`}
                              alt={bd.name}
                              className="w-8 h-8 rounded-full border-2 border-cyan-500 object-cover"
                            />
                            ): (
                            <div className="image-calendar">?</div>
                            )}
                            <span className="text-xs truncate w-full text-center mt-1 text-cyan-800">
                              {bd.name}
                            </span>
                          </div>
                        ))}
                        {birthdays.length > 2 && (
                          <div className="text-xs text-cyan-500 ml-1 mt-2">
                            +{birthdays.length - 2}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </form>
  );
};