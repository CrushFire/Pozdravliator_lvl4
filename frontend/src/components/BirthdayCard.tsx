import type { BirthdayResponse } from '../types/birthday';
import { DeleteBirthday } from './DeleteBirthday';
import { useNavigate } from 'react-router-dom';

const typeColors = {
  'Семья': 'bg-pink-500 text-white',
  'Коллеги': 'bg-blue-600 text-white',
  'Друзья': 'bg-green-600 text-white',
  'Знакомые': 'bg-yellow-500 text-white',
};

export const BirthdayCard = ({
  birthday,
}: {
  birthday: BirthdayResponse;
}) => {
  const navigate = useNavigate();
  const { name, birthDate, age, dayBeforeBirthday, type, image } = birthday;
  const typeClass = typeColors[type as keyof typeof typeColors] ?? 'bg-gray-400 text-white';
  const baseUrl = 'https://localhost:7138/';

  const handleUpdateClick = () => {
  navigate(`/update/${birthday.id}`, {
        state: { birthday },
      });
    };

  return (
    <div className="bc-wrapper">
      <div className="bc-top-right">
        <div className={`bc-type ${typeClass}`}>
          {type}
        </div>
        <div className="bc-days-left">
          {dayBeforeBirthday} дн. осталось
        </div>
      </div>

      <div className="flex items-center gap-6 mb-4">
        {image ? (
          <img
            src={`${baseUrl}${image}`}
            alt={name}
            className="bc-image"
          />
        ) : (
          <div className="bc-image-placeholder">?</div>
        )}

        <div className="bc-info">
          <h2 className="bc-name">{name}</h2>
          <p className="bc-birthdate">Дата рождения: {birthDate}</p>
          <p className="bc-age">Исполнится: {age}</p>
        </div>
      </div>

      <div className="bc-buttons">
        <button onClick={handleUpdateClick} className="bc-btn-update">Обновить</button>
        <button className='bc-btn-delete'><DeleteBirthday birthdayId={birthday.id}/></button>
      </div>
    </div>
  );
};