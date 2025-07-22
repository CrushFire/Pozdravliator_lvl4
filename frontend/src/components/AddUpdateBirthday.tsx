import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { BirthdayErrors } from '../utils/errors/BirthdayErrors';
import type { BirthdayAddRequest, BirthdayUpdateRequest } from '../types/birthday';
import { useNavigate } from 'react-router-dom';

const types = ['Семья', 'Коллеги', 'Друзья', 'Знакомые', 'Другое'];

interface AddUpdateBirthdayProps {
  initialData?: {
    id?: number;
    name: string;
    birthDate: string;
    type: string;
    imageUrl?: string | null;
  };
  onSuccess: () => void;
  onCancel?: () => void;
}

export const AddUpdateBirthday: React.FC<AddUpdateBirthdayProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  // Тип состояния в зависимости от наличия initialData.id
  type FormType = BirthdayAddRequest | BirthdayUpdateRequest;

  const [formData, setFormData] = useState<FormType>(
    initialData && initialData.id
      ? {
          name: initialData.name,
          birthDate: initialData.birthDate,
          type: initialData.type,
          imageFile: null,
          removeImage: false,
        }
      : {
          name: '',
          birthDate: '',
          type: '',
          imageFile: null,
        }
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [preview, setPreview] = useState<string | null>(
    initialData?.imageUrl ? `https://localhost:7138/${initialData.imageUrl}` : null
  );
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formData.imageFile) {
      const objectUrl = URL.createObjectURL(formData.imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if ('removeImage' in formData && formData.removeImage) {
      setPreview(null);
    } else {
      setPreview(initialData?.imageUrl ? `https://localhost:7138/${initialData.imageUrl}` : null);
    }
  }, [formData.imageFile, ('removeImage' in formData ? formData.removeImage : undefined), initialData?.imageUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === 'file') {
      setFormData((prev: FormType) => ({
        ...prev,
        imageFile: target.files ? target.files[0] : null,
        // При загрузке нового файла снимаем флаг удаления, если есть
        ...('removeImage' in prev ? { removeImage: false } : {}),
      }));
    } else {
      setFormData((prev: FormType) => ({
        ...prev,
        [name]: target.value,
      }));
    }
    setError(null);
    setSuccess(null);
  };

  const handleRemoveImage = () => {
    setFormData((prev: FormType) => ({
      ...prev,
      imageFile: null,
      ...('removeImage' in prev ? { removeImage: true } : {}),
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreview(null);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const data = new FormData();
      data.append('name', formData.name ?? '');
      data.append('birthDate', formData.birthDate);
      data.append('type', formData.type);

      if (formData.imageFile) {
        data.append('imageFile', formData.imageFile);
      } else if ('removeImage' in formData && formData.removeImage) {
        data.append('imageFile', new Blob(), ''); // пустой файл для удаления
      }
      // Добавляем флаг removeImage явно
      data.append('removeImage', ('removeImage' in formData && formData.removeImage) ? 'true' : 'false');

      const token = localStorage.getItem('token');

      if (initialData?.id) {
        await api.put(`/birthdays/update/${initialData.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('День рождения успешно обновлён!');
      } else {
        await api.post('/birthdays/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('День рождения успешно добавлен! Хотите добавить ещё?');
        setFormData({ name: '', birthDate: '', type: '', imageFile: null } as BirthdayAddRequest);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }

      onSuccess();
    } catch (err: unknown) {
      setError(BirthdayErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auf-form">
  <h2 className="auf-heading">
    {initialData?.id ? 'Редактировать день рождения' : 'Добавить день рождения'}
  </h2>

      {success && (
        <div className="text-green-700 bg-green-100 border border-green-300 rounded-md p-3 font-semibold text-center animate-fade-in">
          {success}
        </div>
      )}

      {error && (
        <div className="text-red-700 bg-red-100 border border-red-300 rounded-md p-3 font-semibold text-center animate-fade-in">
          {error}
        </div>
      )}

  <div className="auf-input-group">
    <label htmlFor="name" className="text-gray-700 font-semibold">Имя:</label>
    <input
      id="name"
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Введите имя"
      className="auf-input"
      required
    />
  </div>

  <div className="auf-input-group">
    <label htmlFor="birthDate" className="text-gray-700 font-semibold">Дата рождения:</label>
    <input
      id="birthDate"
      type="date"
      name="birthDate"
      value={formData.birthDate}
      onChange={handleChange}
      className="auf-input"
      required
    />
  </div>

  <div className="auf-input-group">
    <label htmlFor="type" className="text-gray-700 font-semibold">Категория:</label>
    <select
      id="type"
      name="type"
      value={formData.type}
      onChange={handleChange}
      className="auf-input"
      required
    >
      <option value="" disabled>Выберите...</option>
      {types.map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  </div>

  <div className="auf-input-group">
    <label htmlFor="imageFile" className="text-gray-700 font-semibold">Фото (не обязательно):</label>
    <input
      ref={fileInputRef}
      id="imageFile"
      type="file"
      name="imageFile"
      accept="image/*"
      onChange={handleChange}
      className="auf-file-input"
    />
    {preview && (
      <div className="auf-preview-wrapper">
        <img src={preview} alt="preview" className="auf-preview-img" />
        <button
          type="button"
          onClick={handleRemoveImage}
          className="auf-remove-button"
        >×</button>
      </div>
    )}
  </div>

  <button type="submit" disabled={loading} className="auf-submit-btn">
    {loading ? (initialData?.id ? 'Обновление...' : 'Добавление...') : initialData?.id ? 'Обновить' : 'Добавить'}
  </button>

  <button type="button" onClick={handleCancel} className="auf-cancel-btn">
    Отмена
  </button>
</form>
  );
};