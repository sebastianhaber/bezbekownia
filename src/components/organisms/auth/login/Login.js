import { Icon } from '@iconify/react'
import React from 'react'
import Input from '../../../molecules/input/Input'
import Button from '../../../utils/Button'
import { AuthWrapper } from '../AuthStyles'

export default function Login({changeModalType}) {
    return (
        <AuthWrapper>
            <div className="heading">Logowanie</div>
            <form>
                <Input>
                    <div className="icon">
                        <Icon icon="akar-icons:envelope" />
                    </div>
                    <input type="email" placeholder='Email' />
                </Input>
                <Input>
                    <div className="icon">
                        <Icon icon="akar-icons:lock-on" />
                    </div>
                    <input type="password" placeholder='Hasło' />
                </Input>
                <Button type='submit'>Zaloguj się</Button>
            </form>
            <div className="footer">
                <p>Nie masz konta? <span onClick={() => changeModalType()}>Zarejestruj się</span></p>
            </div>
        </AuthWrapper>
    )
}
