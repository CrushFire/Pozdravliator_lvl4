export interface BirthdayResponse {
    id: number;
    name?: string;
    birthDate: string;
    image?: string;
    type: string;
    age: number;
    dayBeforeBirthday: number;
}

export interface BirthdayAddRequest {
  name?: string;
  birthDate: string; // в формате YYYY-MM-DD
  imageFile?: File | null;
  type: string;
}

export interface BirthdayUpdateRequest extends BirthdayAddRequest {
  removeImage: boolean;
}

export interface BirthdayFilterRequest {
  timeInterval: string;
  birthdayType?: string;
  directionSort: 'ask' | 'desk';
  name?: string;
  page: number;
  pageSize: number;
}
