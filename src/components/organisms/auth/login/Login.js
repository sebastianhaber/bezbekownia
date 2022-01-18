import { Icon } from '@iconify/react'
import React, { useContext, useState } from 'react'
import AppContext from '../../../../context/AppContext'
import { login } from '../../../../lib/auth'
import Input from '../../../molecules/input/Input'
import Button from '../../../utils/Button'
import { AuthWrapper } from '../AuthStyles'

const INIT_VALUES = {
    email: '',
    password: ''
}
export default function Login({ changeModalType, closeModal }) {
    const [values, setValues] = useState(INIT_VALUES);
    const [error, setError] = useState('');
    const appContext = useContext(AppContext);
    const [loading, setLoading] = useState('');
    let errorArray = [];

    const handleChangeValue = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value.replace(/\s/g, "")
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('Logowanie')

        if (errorArray.length > 0) {
            setError(errorArray)
            setLoading('')
            return false;
        }
        errorArray = [];
        const loginUser = () => login(values.email, values.password)
            .then(res => {
                closeModal();
                setValues(INIT_VALUES);
                setLoading('');
                appContext.setUser(res.data.user);
            }).catch(error => {
                setValues({ ...values, password: '' })
                setLoading('');
                return error.response.data.message.map(message => {
                    message.messages.map(value => {
                        if (value.id === 'Auth.form.error.blocked') {
                            setError('Twoje konto jest zablokowane.')
                        }
                        if (value.id === 'Auth.form.error.invalid') {
                            setError('Email lub hasło jest niepoprawne.')
                        }
                        return error;
                    })
                    return false;
                })
            })
        return loginUser();
    }
    return (
        <AuthWrapper>
            <div className="heading">Logowanie</div>
            <form onSubmit={handleSubmit}>
                {error.length > 0 && (
                    <div className="errors">
                        <div className="error">{ error }</div>
                    </div>
                )}
                <Input>
                    <div className="icon">
                        <Icon icon="akar-icons:envelope" />
                    </div>
                    <input
                        type="email"
                        placeholder='Email'
                        name='email'
                        value={values.email}
                        required
                        onChange={handleChangeValue} />
                </Input>
                <Input>
                    <div className="icon">
                        <Icon icon="akar-icons:lock-on" />
                    </div>
                    <input
                        type="password"
                        placeholder='Hasło'
                        name='password'
                        value={values.password}
                        required
                        onChange={handleChangeValue} />
                </Input>
                <Button type='submit' loading={loading}>Zaloguj się</Button>
            </form>
            <div className="footer">
                <p>Nie masz konta? <span onClick={() => changeModalType()}>Zarejestruj się</span></p>
            </div>
        </AuthWrapper>
    )
}
