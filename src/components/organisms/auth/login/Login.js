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

    const handleChangeValue = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value.replace(/\s/g, "")
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let errorArray = [];

        if (errorArray.length > 0) {
            setError(errorArray)
            return false;
        }
        errorArray = [];
        login( values.email, values.password)
            .then(res => {
                appContext.setUser(res.data.user);
                setValues(INIT_VALUES);
                closeModal();
            }).catch(error => {
                setValues({ ...values, password: '' })
                // console.log(error.response)
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
                        onChange={handleChangeValue} />
                </Input>
                <Button type='submit'>Zaloguj się</Button>
            </form>
            <div className="footer">
                <p>Nie masz konta? <span onClick={() => changeModalType()}>Zarejestruj się</span></p>
            </div>
        </AuthWrapper>
    )
}
