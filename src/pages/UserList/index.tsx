import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/authHook';
import { fetchUsers, deleteUser } from '@/store/usersThunks';
import { User } from '@/types/types';

const UsersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list: users, loading } = useAppSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return <div>Загрузка пользователей…</div>;
  }

  return (
    <div style={{borderRadius: "20px"}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Список пользователей</h1>
        <Link to="/users/newReact">
          <button>+ Создать пользователя</button>
        </Link>
      </div>
      {users.length === 0 ? (
        <div>Пользователи не найдены.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Email</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Имя</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Фамилия</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Полое имя</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Дата рождения</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Занятость</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Телефон</th>
              <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: 8 }}>Согласие</th>
              <th style={{ borderBottom: '1px solid #ccc', padding: 8 }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: User) => (
              <tr key={u.id}>
                {/* <td style={{ padding: 8 }}>{u.id}</td> */}
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.name}</td>
                <td style={{ padding: 8 }}>{u.surName}</td>
                <td style={{ padding: 8 }}>{u.fullName}</td>
                <td style={{ padding: 8 }}>{u.birthDate}</td>
                <td style={{ padding: 8 }}>{u.employment}</td>
                <td style={{ padding: 8 }}>{u.telephone}</td>
                <td style={{ padding: 8 }}>{u.userAgreement ? "ДА" : "НЕТ"}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>
                  <Link to={`/users/${u.id}/edit`}>
                    <button style={{ marginRight: 8 }}>Редактировать</button>
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Удалить пользователя?')) {
                        dispatch(deleteUser(u.id));
                      }
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
