// DeleteBirthday.tsx
import React, { useState } from 'react';
import api from '../api/axios';

interface Props {
  birthdayId: number;
}

export const DeleteBirthday: React.FC<Props> = ({ birthdayId }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    await api.delete('/birthdays', {
      params: { id: birthdayId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setShowModal(false);
    window.location.reload();
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
      >
        Удалить
      </button>

      {showModal && (
        <div className="dbc-modal-overlay">
          <div className="dbc-modal-content">
            <p className="dbc-modal-text">Удалить запись?</p>
            <div className="dbc-modal-buttons">
              <button
                onClick={handleDelete}
                className="dbc-btn-confirm"
              >
                Да
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="dbc-btn-cancel"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};