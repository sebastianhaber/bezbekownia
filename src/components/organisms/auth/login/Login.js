import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
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
    const { setUser } = useContext(AppContext);
    const [loading, setLoading] = useState('');

    const handleChangeValue = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value.replace(/\s/g, "")
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('Logowanie')

        const loginUser = () => login(values.email, values.password)
            .then(res => {
                setUser(res.data.user);
                closeModal();
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
                        if (value.id === 'Auth.form.error.confirmed') {
                            setError('Twój adres email nie został potwierdzony.')
                        }
                        return error;
                    })
                    return false;
                })
            })
        return loginUser();
    }
    useEffect(()=>{
        if(error.length){
            return toast.error(error)
        }
    }, [error])

    return (
        <AuthWrapper>
            <div className="heading">Logowanie</div>
            <form onSubmit={handleSubmit}>
                <Input label='E-mail'>
                    <input
                        type="email"
                        name='email'
                        placeholder='email@example.com'
                        value={values.email}
                        required
                        onChange={handleChangeValue} />
                </Input>
                <Input label='Hasło'>
                    <input
                        type="password"
                        name='password'
                        placeholder='••••••••'
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
