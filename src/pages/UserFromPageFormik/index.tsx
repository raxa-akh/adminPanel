import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/store/authHook';
import { fetchUsers, createUser, updateUser } from '@/store/usersThunks';

interface Values {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  surName: string;
  fullName: string;
  birthDate?: string;
  telephone?: string;
  employment?: string;
  userAgreement: boolean;
}

const PHONE_REGEX = /^\+?\d{10,15}$/;

const UserFormFormik: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const users = useAppSelector(s => s.users.list);
  const existing = users.find(u => u.id === id);

  useEffect(() => {
    if (isEdit && !existing) dispatch(fetchUsers());
  }, [isEdit, existing, dispatch]);

  const createSchema = Yup.object<Values>({
    email: Yup.string().email('Неверный email').required('Обязательно'),
    password: Yup.string().required('Обязательно'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Пароли не совпадают')
      .required('Обязательно'),
    name: Yup.string().required('Обязательно'),
    surName: Yup.string().required('Обязательно'),
    fullName: Yup.string().required('Обязательно'),
    birthDate: Yup.date().nullable(),
    telephone: Yup.string().matches(PHONE_REGEX, 'Неверный телефон').nullable(),
    employment: Yup.string().default(""),
    userAgreement: Yup.boolean(),
  });

  const editSchema = Yup.object<Values>({
    email: Yup.string().email('Неверный email').required('Обязательно'),
    password: Yup.string(),
    confirmPassword: Yup.string(),
    name: Yup.string().required('Обязательно'),
    surName: Yup.string().required('Обязательно'),
    fullName: Yup.string().required('Обязательно'),
    birthDate: Yup.date().nullable(),
    telephone: Yup.string().matches(PHONE_REGEX, 'Неверный телефон').nullable(),
    employment: Yup.string().nullable(),
    userAgreement: Yup.boolean(),
  });

  const initialValues: Values = {
    email: existing?.email || '',
    password: '',
    confirmPassword: '',
    name: existing?.name || '',
    surName: existing?.surName || '',
    fullName: existing
      ? existing.fullName
      : `${existing?.name || ''} ${existing?.surName || ''}`.trim(),
    birthDate: existing?.birthDate?.slice(0, 10) || '',
    telephone: existing?.telephone || '',
    employment: existing?.employment || '',
    userAgreement: existing?.userAgreement || false,
  };

  const AutoFullName: React.FC<FormikProps<Values>> = ({ values, setFieldValue }) => {
    useEffect(() => {
      setFieldValue('fullName', `${values.name} ${values.surName}`.trim(), false);
    }, [values.name, values.surName, setFieldValue]);
    return null;
  };

  const handleSubmit = async (
    values: Values,
    { setSubmitting, setStatus }: FormikHelpers<Values>
  ) => {
    setStatus(null);
    try {
      const isoDate = values.birthDate
        ? new Date(values.birthDate).toISOString()
        : undefined;

      const base = {
        name: values.name,
        surName: values.surName,
        fullName: values.fullName,
        birthDate: isoDate,
        telephone: values.telephone || undefined,
        employment: values.employment || undefined,
        userAgreement: values.userAgreement,
      };

      const payload = isEdit
        ? base
        : {
            ...base,
            email: values.email,
            password: values.password,
          };

      if (isEdit && id) {
        await dispatch(updateUser({ id, changes: payload })).unwrap();
      } else {
        await dispatch(createUser(payload)).unwrap();
      }
      navigate('/users');
    } catch (err: any) {
      setStatus(err.message || 'Ошибка при сохранении');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 20 }}>
        {isEdit ? 'Редактировать' : 'Создать'} пользователя
      </h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={isEdit ? editSchema : createSchema}
        onSubmit={handleSubmit}
      >
        {formik => (
          <Form>
            <AutoFullName {...formik} />

            <label>
              Email
              <Field
                name="email"
                type="email"
                disabled={isEdit}
                style={{ width: '100%', padding: 8, marginBottom: 4 }}
              />
            </label>
            <ErrorMessage name="email" component="div" style={{ color: 'red' }} />

            {!isEdit && (
              <>
                <label>
                  Пароль
                  <Field
                    name="password"
                    type="password"
                    style={{ width: '100%', padding: 8, marginBottom: 4 }}
                  />
                </label>
                <ErrorMessage name="password" component="div" style={{ color: 'red' }} />

                <label>
                  Подтвердите пароль
                  <Field
                    name="confirmPassword"
                    type="password"
                    style={{ width: '100%', padding: 8, marginBottom: 4 }}
                  />
                </label>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  style={{ color: 'red' }}
                />
              </>
            )}

            {['name', 'surName', 'fullName', 'birthDate', 'telephone', 'employment'].map(
              key => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <label>
                    {key === 'surName'
                      ? 'Фамилия'
                      : key === 'fullName'
                      ? 'Полное имя'
                      : key === 'birthDate'
                      ? 'Дата рождения'
                      : key === 'telephone'
                      ? 'Телефон'
                      : key === 'employment'
                      ? 'Занятость'
                      : 'Имя'}{' '}
                    <Field
                      name={key}
                      type={key === 'birthDate' ? 'date' : 'text'}
                      style={{ width: '100%', padding: 8 }}
                    />
                  </label>
                  <ErrorMessage name={key} component="div" style={{ color: 'red' }} />
                </div>
              )
            )}

            <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <Field name="userAgreement" type="checkbox" style={{ marginRight: 8 }} />
              Согласие
            </label>

            {formik.status && (
              <div style={{ color: 'red', marginBottom: 8 }}>{formik.status}</div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting
                  ? 'Сохраняем…'
                  : isEdit
                  ? 'Сохранить'
                  : 'Создать'}
              </button>
              <Link to="/users">
                <button type="button">Отменить</button>
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserFormFormik;
