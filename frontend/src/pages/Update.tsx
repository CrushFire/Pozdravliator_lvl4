import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { AddUpdateBirthday } from '../components/AddUpdateBirthday';
import type { BirthdayResponse } from '../types/birthday';

export const Update = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { birthday?: BirthdayResponse };

  if (!id) {
    return <div>Записи с таким айди не существует</div>;
  }

  if (!state?.birthday) {
    return <div>Нет данных</div>;
  }

  return (
      <AddUpdateBirthday
        initialData={{
          id: state.birthday.id,
          name: state.birthday.name ?? '',
          birthDate: state.birthday.birthDate,
          type: state.birthday.type,
          imageUrl: state.birthday.image ?? null,
        }}
        onSuccess={() => navigate('/main')}
      />
  );
};