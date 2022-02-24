import React from 'react'
import { toast } from 'react-toastify';
import { useState } from 'react/cjs/react.development';
import { registerUser } from '../../../../lib/auth';
import Input from '../../../molecules/input/Input';
import Button from '../../../utils/Button';
import { AuthWrapper } from '../AuthStyles';

const INIT_VALUES = {
    username: '',
    email: '',
    password: '',
}
export default function Register({ changeModalType, closeModal }) {
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState('');

    const [values, setValues] = useState(INIT_VALUES);
    const handleChangeValue = (e) => {
        setValues({
            ...values,
            // eslint-disable-next-line no-useless-escape
            [e.target.name]: e.target.value.replace(/\s/g, "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let errorArray = [];
        setLoading('Rejestrowanie')

        if (values.username.length < 3) {
            errorArray = [...errorArray, {
                message: 'Nazwa użytkownika jest za krótka.',
                type: 'username'
            }];
        }

        if (values.password.length < 6 || values.password.length > 64) {
            errorArray = [...errorArray, {
                type: 'password',
                message: 'Hasło powinno mieć od 6 znaków do 64.'
            }]
            setValues({
                ...values,
                password: '',
            });
        }

        if (errorArray.length > 0) {
            setError(errorArray)
            setLoading('')
            return false;
        }
        errorArray = [];
        await registerUser(values.username, values.email, values.password)
            .then(res => {
                toast.success('😏 I myyyk, masz konto na Bezbekowni. Jeszcze tylko musisz potwierdzić swojego maila (sprawdź spam).')
                closeModal();
            }).catch(error => {
                setLoading('');
                return error.response.data.message.map(message => {
                    message.messages.map(value => {
                        if (value.id === 'Auth.form.error.email.taken') {
                            toast.error('Podany adres email jest zajęty.')
                        }
                        if (value.id === 'Auth.form.error.email.format') {
                            toast.error('Podaj poprawny adres email.')
                        }
                        return setError(errorArray);
                    })
                    return false;
                })
            })
    }

    return (
        <AuthWrapper>
            <div className="heading">Rejestracja</div>
            <form onSubmit={handleSubmit} autoComplete='off'>
                <div className="errors" id='errors'>
                    {error.length > 0 && error.map((err, index) => (
                        <div className="error" key={index}>{ err.message }</div>
                    ))}
                </div>
                <Input label='E-mail*'>
                    <input
                        type="email"
                        placeholder='email@example.com'
                        name='email'
                        required
                        value={values.email}
                        onChange={handleChangeValue} />
                </Input>
                <Input label='Login (nazwa użytkownika)*'>
                    <input
                        type="text"
                        name='username'
                        minLength='3'
                        required
                        value={values.username}
                        onChange={handleChangeValue} />
                    <p className="small gray">Nazwy użytkownika nie można zmieniać.</p>
                </Input>
                <Input label='Hasło*'>
                    <input
                        type="password"
                        placeholder='••••••••'
                        minLength='6'
                        maxLength='64'
                        name='password'
                        id='password'
                        required
                        value={values.password}
                        onChange={handleChangeValue} />
                </Input>
                <Button type='submit' loading={loading}>Zarejestruj się</Button>
            </form>
            <div className="footer">
                <p>Masz konto? <span onClick={() => changeModalType()}>Zaloguj się</span></p>
            </div>
        </AuthWrapper>
    )
}
