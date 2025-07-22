import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { BirthdayErrors } from '../utils/errors/BirthdayErrors';
import type { BirthdayAddUpdateRequest } from '../types/birthday';

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
  const [formData, setFormData] = useState<BirthdayAddUpdateRequest & { removeImage: boolean }>({
  name: initialData?.name ?? '',
  birthDate: initialData?.birthDate ?? '',
  type: initialData?.type ?? '',
  imageFile: null,
  removeImage: false,
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.imageUrl ? `https://localhost:7138/${initialData.imageUrl}` : null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (formData.imageFile) {
      const objectUrl = URL.createObjectURL(formData.imageFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (formData.removeImage) {
      setPreview(null);
    } else {
      setPreview(initialData?.imageUrl ? `https://localhost:7138/${initialData.imageUrl}` : null);
    }
  }, [formData.imageFile, formData.removeImage, initialData?.imageUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;

    if (target instanceof HTMLInputElement && target.type === 'file') {
      setFormData(prev => ({
        ...prev,
        imageFile: target.files ? target.files[0] : null,
        removeImage: false,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: target.value,
      }));
    }
    setError(null);
    setSuccess(null);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      imageFile: null,
      removeImage: true,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setPreview(null);
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
      } else if (formData.removeImage) {
        data.append('imageFile', new Blob(), '');
      }

      const token = localStorage.getItem('token');

      if (initialData?.id) {
        // update
        await api.put(`/birthdays/update/${initialData.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('День рождения успешно обновлён!');
      } else {
        // create
        await api.post('/birthdays/create', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        setSuccess('День рождения успешно добавлен! Хотите добавить еще?');
        // сброс формы после создания
        setFormData({ name: '', birthDate: '', type: '', imageFile: null, removeImage: false });
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }

      onSuccess();
    } catch (err: unknown) {
      const msg = BirthdayErrors(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-8 bg-gradient-to-tr from-cyan-100 to-blue-200 rounded-2xl shadow-lg space-y-8"
    >
      <h2 className="text-3xl font-extrabold text-cyan-800 mb-6 text-center tracking-wide drop-shadow-md">
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

      <div className="flex flex-col space-y-1">
        <label htmlFor="name" className="text-gray-700 font-semibold">
          Имя:
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Введите имя"
          className="w-full rounded-lg border border-cyan-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition shadow-sm"
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="birthDate" className="text-gray-700 font-semibold">
          Дата рождения:
        </label>
        <input
          id="birthDate"
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="w-full rounded-lg border border-cyan-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition shadow-sm"
          required
        />
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="type" className="text-gray-700 font-semibold">
          Категория:
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full rounded-lg border border-cyan-400 px-4 py-3 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition shadow-sm"
          required
        >
          <option value="" disabled>
            Выберите...
          </option>
          {types.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="imageFile" className="text-gray-700 font-semibold">
          Фото (не обязательно):
        </label>
        <input
          ref={fileInputRef}
          id="imageFile"
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-cyan-700"
        />
        {preview && (
          <div className="relative mt-3 w-32 h-32 rounded-xl shadow-md border-4 border-cyan-400 overflow-hidden">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-gray-600 transition"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold py-3 rounded-xl shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (initialData?.id ? 'Обновление...' : 'Добавление...') : initialData?.id ? 'Обновить' : 'Добавить'}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-xl shadow transition"
        >
          Отмена
        </button>
      )}
    </form>
  );
};