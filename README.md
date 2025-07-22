# Поздравлятор 🎉

Поздравлятор - это SPA веб-приложение для хранения списка дней рождения друзей, знакомых, семьи, коллег и т.д.

# Технологии и инструменты

- Backend: ASP.NET Core (C#)
- Аутентификация: JWT (JSON Web Tokens)
- База данных: PostgreSQL
- API: REST API (+ Swagger)
- Frontend: React + TypeScript(v3) + Axios + Vite
- Стилизация: Tailwind CSS

# Подготовка к запуску

Backend:
- В app.settings, в строке подключения, указать актуальные данные для подключения к СУБД;
- В консоле, выбрав среду DataAccess, ввести команду: Update-Database;

Frontend:
- cd ../frontend
- npm install
- npm start

# Демонстрация приложения

Авторизация

<img width="1920" height="926" alt="image" src="https://github.com/user-attachments/assets/4ae41ed4-8d1c-4716-bd7e-b72606820b3e" />

Регистрация

<img width="1920" height="924" alt="image" src="https://github.com/user-attachments/assets/fbde5834-12a3-4647-b75d-8c3e31449004" />

На главной странице /main представлены все дни рождения (сначала ближайшие) за 2025 год

<img width="1920" height="924" alt="image" src="https://github.com/user-attachments/assets/07e5cedc-8ece-4acc-aa07-211b3b5fe139" />

Есть возможность поиска по имени именника, временному промежутку, когда должно натупить ДР, по категории, а также выбор в каком порядке их показывать(сначала ближайшие или нет)

<img width="1920" height="912" alt="image" src="https://github.com/user-attachments/assets/ed45334c-0a58-4c3d-bb96-ddae8a673a82" />

Отображение ввиде календаря

<img width="1920" height="869" alt="image" src="https://github.com/user-attachments/assets/efdffbba-db54-4af8-b55c-ef5fc31b866c" />

Добавление ДР

<img width="1920" height="923" alt="image" src="https://github.com/user-attachments/assets/e94919ef-d70b-43a6-a4e6-e72ea6190adb" />

Обновление

<img width="1920" height="872" alt="image" src="https://github.com/user-attachments/assets/8adf7087-f982-4e6b-b867-b5b317f68449" />

Удаление

<img width="1920" height="923" alt="image" src="https://github.com/user-attachments/assets/c4264937-a11e-4879-a01b-6b6cd73ec295" />
