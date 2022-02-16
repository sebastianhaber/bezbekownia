import { useForm } from "react-hook-form"
import Input from "../../../molecules/input/Input"
import Button from "../../../utils/Button"
import { StyledTab } from "./UserSettings.styles"
import axios from 'axios'
import { useContext } from 'react'
import AppContext from '../../../../context/AppContext';
import Cookies from "js-cookie"
import { toast } from 'react-toastify'

export default function Security() {
	const { register, handleSubmit, formState: { errors }, setError, clearErrors, reset } = useForm();
	const { user, setUser } = useContext(AppContext);
	
	const onSubmit = async (data) => {
		const token = Cookies.get('token');
		if(!data.currentPassword || !data.newPassword || !data.confirmNewPassword) {
			setError('global', {
				type: 'global',
				message: 'Każde pole jest wymagane.'
			})
			reset();
			return false;
		}
		if(!token) {
			reset();
			setError('global', {
				type: 'global',
				message: 'Wyloguj się i zaloguj ponownie, by zmienić hasło.'
			})
			return false;
		}
		if(data.currentPassword === data.newPassword){
			reset();
			setError('newPassword', {
				type: 'global',
				message: 'Nowe hasło nie może być takie samo jak stare.'
			})
			return false;
		}
		if(data.newPassword.includes(user.username)){
			reset();
			setError('newPassword', {
				type: 'global',
				message: 'Nowe hasło nie może zawierać nazwy użytkownika.'
			})
			return false;
		}
		if(data.newPassword === data.confirmNewPassword){
			axios.post('/custom/change-password', {
				"currentPassword": data.currentPassword,
				"newPassword": data.newPassword,
				"confirmNewPassword": data.confirmNewPassword
			}, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			}).then((res)=>{
				reset();
				clearErrors();
				setUser(res.data);
				const newToken = res.config.headers.Authorization.replace('Bearer ', '');
				Cookies.set('token', newToken)
				toast.success('Udało się zmienić hasło!')
			}).catch(err => {
				toast.success(err.response.data.message)
			})
		}
	}

	return (
		<StyledTab onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
			<div className="wrapper">
				{errors.global && (
					<div className="error">{errors.global.message}</div>
				)}
				<Input label='Hasło*'>
					<input 
						className={errors.currentPassword ? `border error` : `border`} 
						type="password" 
						required
						{...register('currentPassword', {
							required: true,
							minLength: 6
					})} />
					{errors.currentPassword && (
						<div className="error">{errors.currentPassword.message}</div>
					)}
				</Input>
				<Input label='Nowe hasło*'>
					<input 
						className={errors.newPassword ? `border error` : `border`} 
						type="password" 
						required
						{...register('newPassword', {
							required: true,
							minLength: 6
					})} />
					{errors.newPassword && (errors.newPassword.type === 'global') && (
						<div className="error">{errors.newPassword.message}</div>
					)}
				</Input>
				<Input label='Powtórz nowe hasło*'>
					<input 
						className={errors.confirmNewPassword ? `border error` : `border`}
						type="password"
						required
						{...register('confirmNewPassword')} />
				</Input>
			</div>
			<div className="buttons submit">
                <Button type='reset' variant='ghost' onClick={()=>{
					clearErrors();
					reset();
				}}>Resetuj</Button>
                <Button type='submit'>Zapisz zmiany</Button>
            </div>
		</StyledTab>
	)
}