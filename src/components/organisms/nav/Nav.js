import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StyledNav } from './Nav.styles'
import { Icon } from '@iconify/react';
import UserImage from '../../../assets/user-image.png';
import Button from '../../utils/Button';
import DropdownMenu from '../../utils/DropdownMenu';
import { API_IP } from '../../../App';
import AppContext from '../../../context/AppContext';
import Modal from '../modal/Modal';
import Register from '../auth/register/Register';
import Login from '../auth/login/Login';
import { logout as AuthLogout } from '../../../lib/auth'; 

const INIT_MODAL = {
    isOpen: false,
    type: ''
}
export default function Nav() {
    const [isSearchBoxOpen, setSearchBoxOpen] = useState(INIT_MODAL);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [modal, setModal] = useState(false);

    const logout = () => {
        AuthLogout();
        setUser(null);
    }
    const handleChangeSearchValue = (target) => {
        setSearchValue(target.target.value)
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchValue.trim().length === 0) {
            return;
        }
        navigate('search/' + searchValue)

        setSearchValue('');
        setSearchBoxOpen(false);
    }
    const handleOpenLoginModal = (type) => {
        document.querySelector('html').classList.add('no-scroll');
        setModal({
            isOpen: true,
            type: type
        })
         setTimeout(() => {
            document.getElementById('wrapper').classList.remove('hide');
        }, 100);
    }
    const handleCloseLoginModal = () => {
        document.getElementById('wrapper').classList.add('hide');
        document.querySelector('html').classList.remove('no-scroll');

        setTimeout(() => {
            setModal(INIT_MODAL)
        }, 500);
    }
    const changeModalType = () => {
        if (modal.type === 'register') {
            handleCloseLoginModal();
            setTimeout(() => {
                handleOpenLoginModal('login')
            }, 500);
        } else {
            handleCloseLoginModal();
            setTimeout(() => {
                handleOpenLoginModal('register')
            }, 500);
        }
    }
    // https://strapi.io/blog/nextjs-react-hooks-strapi-auth-4 -> rejestracja i logowanie
    return (
        <>
            <StyledNav>
                {modal && modal.isOpen && (
                    <Modal onClose={() => handleCloseLoginModal()}>
                        {modal.type === 'register' ? (
                            <Register changeModalType={changeModalType} closeModal={handleCloseLoginModal} />
                        ) : (
                            <Login changeModalType={changeModalType} />
                        )}
                    </Modal>
                )}
                <div className="wrapper">
                    <Link to='/' className='logo'>Bezbekownia</Link>
                    <form onSubmit={handleSubmit} id="search-box">
                        <div className={isSearchBoxOpen ? `search-box active` : `search-box`}>
                            <div className="icon"><Icon icon="akar-icons:search" /></div>
                            <input type="search" autoComplete='off' placeholder='Szukaj...' value={searchValue} onChange={handleChangeSearchValue} />
                            <button type='submit'><Icon icon="akar-icons:send" /></button>
                        </div>
                    </form>
                    <ul className="right">
                        <li className={isSearchBoxOpen ? `square search active` : `square search`} onClick={() => setSearchBoxOpen(!isSearchBoxOpen)}>
                            <Icon icon="akar-icons:search" />
                        </li>
                        <li className="square more">
                            <Icon icon="akar-icons:more-horizontal" />
                            <DropdownMenu>
                                <li><Link to='/pomoc'>O Bezbekowni</Link></li>
                                <li>
                                    <Link to='/generator'>
                                        <p>Meme Generator <span className="soon">Wkrótce</span></p>
                                    </Link>
                                </li>
                            </DropdownMenu>
                        </li>
                        {user ? (
                            <>
                                <li className="square plus" title='Dodaj mema'>
                                    <Icon icon="akar-icons:plus" />
                                </li>
                                <li className="square profile">
                                    <img src={(user.image && `${API_IP}${user.image?.url}`) || UserImage} alt={user.username} />
                                    <DropdownMenu>
                                        <li><Link to='/'>Profil</Link></li>
                                        <li><Link to='/'>Ustawienia profilu</Link></li>
                                        <hr />
                                        <li><Link to='/'>Moje memy</Link></li>
                                        <li><Link to='/'>Moje polubienia</Link></li>
                                        <hr />
                                        <li onClick={()=>logout()}><Link to='/'>Wyloguj się</Link></li>
                                    </DropdownMenu>
                                </li>
                            </>
                        ) : (
                            <li className="square buttons">
                                <Icon icon="akar-icons:people-group" />
                                <DropdownMenu centerItems>
                                    <li onClick={()=>handleOpenLoginModal('login')}><Button variant='ghost' style={{marginBottom: '1rem'}}>Zaloguj się</Button></li>
                                    <li><Button onClick={()=>handleOpenLoginModal('register')}>Zarejestruj się</Button></li>
                                </DropdownMenu>
                            </li>
                        )}
                    </ul>
                </div>
            </StyledNav>
        </>
    )
}
