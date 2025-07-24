# User Management SPA

**: Клиент – Работа с формами и аутентификацией**  
Одностраничное приложение на React + TypeScript для CRUD-операций над пользователями с аутентификацией, двумя вариантами форм (Formik и React Hook Form) и валидацией.

---

## Стек технологий

- **Фреймворк**: React 18 + TypeScript  
- **Маршрутизация**: React Router v6  
- **Сборка**: Vite  
- **State-менеджер**: Redux Toolkit + Thunk  
- **HTTP-клиент**: Axios (`withCredentials: true`)  
- **Формы**: Formik + Yup и React Hook Form  
- **Стили**: CSS Modules  
- **UI-компоненты**: самописные (Header, Sidebar, Table)  

---




## Маршруты

| Путь               | Описание                                    | Доступ     |
|--------------------|---------------------------------------------|------------|
| `/login`           | Страница логина                             | Public     |
| `/users`           | Главная: таблица пользователей              | Private    |
| `/users/newReact`  | Создать пользователя (React Hook Form)      | Private    |
| `/users/newFormik` | Создать пользователя (Formik + Yup)         | Private    |
| `/users/:id/edit`  | Редактировать пользователя (RHF)            | Private    |
| `*`                | Все прочие — редирект на `/login`           | —          |

- **Layout** (Header + Sidebar) отображается на всех приватных страницах.
- `ProtectedRoute` проверяет `isAuthenticated` и хранит в `state.from`.

---

## Функционал

- **CRUD пользователей**:
  - **Список**: таблица с колонками `ID`, `Email`, кнопки «Редактировать»/«Удалить»
  - **Создание**:
    - Два варианта формы:  
      – **Formik + Yup** (`/users/newFormik`)  
      – **React Hook Form** (`/users/newReact`)
    - Поля: `email`, `password`, `confirmPassword`, `name`, `surName`, `fullName`, `birthDate`, `telephone`, `employment`, `userAgreement`
    - **Валидация**:
      - `email` — корректный формат
      - `password` + `confirmPassword` — совпадают (при создании)
      - `name`, `surName`, `fullName` — обязательны, `maxLength`
      - `telephone` — regex `+7XXXXXXXXXX` или 10–15 цифр
    - **FullName**:  
      – Автоматически собирается из `name + surName`  
      – Остаётся редактируемым
    - После успешного создания — редирект на `/users`.
  - **Редактирование** (`/users/:id/edit`):
    - Форма на React Hook Form
    - `email` и `password` недоступны к редактированию
    - Все остальные поля редактируются аналогично созданию
  - **Удаление** — кнопка в каждой строке списка.
- **Валидация** настроена через **Yup** (Formik) и **встроенные правила** (RHF).

---

## Скрипты

- `npm run dev` — запустить Vite-сервер (http://localhost:5173)  
- `npm run build` — собрать продакшн-версию в папку `dist`  
- `npm run preview` — запустить локальный сервер для проверки `dist`

---

## Примечание
на сервере изменил DTO юзеров, DateString, иначе не работало
