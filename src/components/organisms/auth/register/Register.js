import { Icon } from '@iconify/react';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useState } from 'react/cjs/react.development';
import AppContext from '../../../../context/AppContext';
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
    const appContext = useContext(AppContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState('');

    const [values, setValues] = useState(INIT_VALUES);
    const handleChangeValue = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value.replace(/\s/g, "")
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
        const asyncRegister = await registerUser(values.username, values.email, values.password)
            .then(res => {
                appContext.setUser(res.data.user);
                setValues(INIT_VALUES);
                closeModal();
                setLoading('');
            }).catch(error => {
                // todo
                console.log(error.response)
                setLoading('');
                return error.response.data.message.map(message => {
                    message.messages.map(value => {
                        if (value.id === 'Auth.form.error.email.taken') {
                            errorArray = [...errorArray, {
                                type: 'email',
                                message: 'Podany adres email jest zajęty.'
                            }]
                        }
                        if (value.id === 'Auth.form.error.email.format') {
                            errorArray = [...errorArray, {
                                type: 'email',
                                message: 'Podaj poprawny adres email.'
                            }]
                        }
                        return setError(errorArray);
                    })
                    return false;
                })
            })
        return asyncRegister;
    }
    const togglePassword = () => {
        let passwordField = document.getElementById('password');

        if (passwordField.type === 'password') {
            passwordField.type = 'text'
        } else {
            passwordField.type = 'password';
        }
    }
    useEffect(() => {
        if (appContext.isAuthenticated) {
            navigate('');
        }
    }, [appContext.isAuthenticated, navigate]);

    return (
        <AuthWrapper>
            <div className="heading">Rejestracja</div>
            <form onSubmit={handleSubmit}>
                <div className="errors" id='errors'>
                    {error.length > 0 && error.map((err, index) => (
                        <div className="error" key={index}>{ err.message }</div>
                    ))}
                </div>
                <Input>
                    <div className="icon">
                        <Icon icon="akar-icons:person" />
                    </div>
                    <input
                        type="text"
                        placeholder='Nazwa użytkownika'
                        name='username'
                        minLength='3'
                        required
                        value={values.username}
                        onChange={handleChangeValue} />
                </Input>
                <Input>
                    <div className="icon">
                        <Icon icon="akar-icons:envelope" />
                    </div>
                    <input
                        type="email"
                        placeholder='Email'
                        name='email'
                        required
                        value={values.email}
                        onChange={handleChangeValue} />
                </Input>
                <Input>
                    <div className="icon">
                        <Icon icon="akar-icons:lock-on" />
                    </div>
                    <input
                        type="password"
                        placeholder='Hasło'
                        minLength='6'
                        maxLength='64'
                        name='password'
                        id='password'
                        required
                        value={values.password}
                        onChange={handleChangeValue} />
                    <div className="icon pointer" onClick={()=>togglePassword()}>
                        <Icon icon="akar-icons:eye" />
                    </div>
                    
                </Input>
                <Button type='submit' loading={loading}>Zarejestruj się</Button>
            </form>
            <div className="footer">
                <p>Masz konto? <span onClick={() => changeModalType()}>Zaloguj się</span></p>
            </div>
        </AuthWrapper>
    )
}
