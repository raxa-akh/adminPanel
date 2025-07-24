import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/store/authHook';
import { fetchUsers, createUser, updateUser } from '@/store/usersThunks';

type FormValues = {
  email: string;
  password?: string;
  confirmPassword?: string;
  name: string;
  surName: string;
  fullName: string;
  birthDate?: string;
  telephone?: string;
  employment?: string;
  userAgreement: boolean;
};

const PHONE_REGEX = /^\+?\d{10,15}$/;

const UserFormRHF: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector(s => s.users.list);
  const existing = users.find(u => u.id === id);

  useEffect(() => {
    if (isEdit && !existing) dispatch(fetchUsers());
  }, [isEdit, existing, dispatch]);

  const { control, handleSubmit, watch, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: {
      email: existing?.email || '',
      password: '',
      confirmPassword: '',
      name: existing?.name || '',
      surName: existing?.surName || '',
      fullName: existing
        ? existing.fullName
        : `${existing?.name || ''} ${existing?.surName || ''}`.trim(),
      birthDate: existing?.birthDate?.slice(0, 10),
      telephone: existing?.telephone || '',
      employment: existing?.employment || '',
      userAgreement: existing?.userAgreement || false,
    }
  });

  useEffect(() => {
    if (existing) {
      reset({
        email: existing.email,
        password: '',
        confirmPassword: '',
        name: existing.name,
        surName: existing.surName,
        fullName: existing.fullName,
        birthDate: existing.birthDate?.slice(0, 10),
        telephone: existing.telephone || '',
        employment: existing.employment || '',
        userAgreement: existing.userAgreement || false,
      });
    }
  }, [existing, reset]);

  const watchName = watch('name');
  const watchSurName = watch('surName');
  useEffect(() => {
    setValue('fullName', `${watchName} ${watchSurName}`.trim());
  }, [watchName, watchSurName, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (!isEdit && data.password !== data.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    const isoDate = data.birthDate
      ? new Date(data.birthDate).toISOString()
      : undefined;

    const base = {
      name: data.name,
      surName: data.surName,
      fullName: data.fullName,
      birthDate: isoDate,
      telephone: data.telephone || undefined,
      employment: data.employment || undefined,
      userAgreement: data.userAgreement,
    };

    const payload = isEdit
      ? base
      : { ...base, email: data.email, password: data.password! };

    try {
      if (isEdit && id) {
        await dispatch(updateUser({ id, changes: payload })).unwrap();
      } else {
        await dispatch(createUser(payload)).unwrap();
      }
      navigate('/users');
    } catch (err: any) {
      alert(err.message || 'Ошибка при сохранении');
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 20 }}>
        {isEdit ? 'Редактировать' : 'Создать'} пользователя
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Обязательно',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Неверный email' }
          }}
          render={({ field }) => (
            <div style={{ marginBottom: 8 }}>
              <label>Email</label>
              <input {...field} type="email" disabled={isEdit} style={{ width: '100%', padding: 8 }} />
              {errors.email && <div style={{ color: 'red' }}>{errors.email.message}</div>}
            </div>
          )}
        />

        {!isEdit && (
          <>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Обязательно' }}
              render={({ field }) => (
                <div style={{ marginBottom: 8 }}>
                  <label>Пароль</label>
                  <input {...field} type="password" style={{ width: '100%', padding: 8 }} />
                  {errors.password && <div style={{ color: 'red' }}>{errors.password.message}</div>}
                </div>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ required: 'Обязательно' }}
              render={({ field }) => (
                <div style={{ marginBottom: 8 }}>
                  <label>Подтвердите пароль</label>
                  <input {...field} type="password" style={{ width: '100%', padding: 8 }} />
                  {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword.message}</div>}
                </div>
              )}
            />
          </>
        )}

        {[
          { name: 'name', label: 'Имя' },
          { name: 'surName', label: 'Фамилия' },
          { name: 'fullName', label: 'Полное имя' },
        ].map(({ name, label }) => (
          <Controller
            key={name}
            name={name as keyof FormValues}
            control={control}
            rules={{ required: 'Обязательно' }}
            render={({ field }) => (
              <div style={{ marginBottom: 8 }}>
                <label>{label}</label>
                <input {...field} type="text" style={{ width: '100%', padding: 8 }} />
                {errors[name as keyof FormValues] && (
                  <div style={{ color: 'red' }}>
                    {(errors[name as keyof FormValues] as any).message}
                  </div>
                )}
              </div>
            )}
          />
        ))}

        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <div style={{ marginBottom: 8 }}>
              <label>Дата рождения</label>
              <input {...field} type="date" style={{ width: '100%', padding: 8 }} />
            </div>
          )}
        />

        <Controller
          name="telephone"
          control={control}
          rules={{
            pattern: { value: PHONE_REGEX, message: 'Неверный телефон' }
          }}
          render={({ field }) => (
            <div style={{ marginBottom: 8 }}>
              <label>Телефон</label>
              <input {...field} type="text" style={{ width: '100%', padding: 8 }} />
              {errors.telephone && <div style={{ color: 'red' }}>{errors.telephone.message}</div>}
            </div>
          )}
        />

        <Controller
          name="employment"
          control={control}
          render={({ field }) => (
            <div style={{ marginBottom: 8 }}>
              <label>Занятость</label>
              <input {...field} type="text" style={{ width: '100%', padding: 8 }} />
            </div>
          )}
        />

        <Controller
          name="userAgreement"
          control={control}
          render={({ field }) => (
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <input {...field} type="checkbox" style={{ marginRight: 8 }} />
              Согласие
            </label>
          )}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Сохраняем…' : isEdit ? 'Сохранить' : 'Создать'}
          </button>
          <Link to="/users">
            <button type="button">Отменить</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UserFormRHF;
