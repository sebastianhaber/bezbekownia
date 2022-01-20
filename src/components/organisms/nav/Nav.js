import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StyledNav } from './Nav.styles'
import { Icon } from '@iconify/react';
import UserImage from '../../../assets/user-image.png';
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
    const [isSearchBoxOpen, setSearchBoxOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useContext(AppContext);
    const [modal, setModal] = useState(INIT_MODAL);

    const logout = () => {
        AuthLogout();
        setUser(null);
    }
    const handleChangeSearchValue = (target) => {
        setSearchValue(target.target.value)
    }
    const handleSearchSubmit = (event) => {
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
    }
    const handleCloseLoginModal = () => {
        document.querySelector('html').classList.remove('no-scroll');
        setModal(INIT_MODAL)
    }
    const changeModalType = () => {
        if (modal.type === 'register') {
            handleCloseLoginModal();
            handleOpenLoginModal('login')
        } else {
            handleCloseLoginModal();
            handleOpenLoginModal('register')
        }
    }
    return (
        <>
            <StyledNav>
                {modal && modal.isOpen && (
                    <Modal onClose={() => handleCloseLoginModal()}>
                        {modal.type === 'register' ? (
                            <Register changeModalType={changeModalType} closeModal={handleCloseLoginModal} />
                        ) : (
                            <Login changeModalType={changeModalType} closeModal={handleCloseLoginModal} />
                        )}
                    </Modal>
                )}
                <div className="wrapper">
                    <Link to='/strona/1' className='logo'>Bezbekownia</Link>
                    <form onSubmit={handleSearchSubmit} id="search-box" data-testid="search-box">
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
                                <li><Link to='/pomoc'>Regulamin</Link></li>
                                <li><Link to='/pomoc'>Polityka prywatności</Link></li>
                            </DropdownMenu>
                        </li>
                        {user && user.username ? (
                            <>
                                <li className="square plus" title='Dodaj mema'>
                                    <Icon icon="akar-icons:plus" />
                                </li>
                                <li className="square profile">
                                    <img src={user.image ? `${API_IP}${user.image?.url}` : UserImage} alt={user.username} />
                                    <DropdownMenu>
                                        <li><Link to={`/@${user.username}`}>Profil</Link></li>
                                        <li><Link to={`/@${user.username}/edytuj`}>Ustawienia profilu</Link></li>
                                        <hr />
                                        <li><Link to='/moje-memy'>Moje memy</Link></li>
                                        <li><Link to='/moje-polubienia'>Moje polubienia</Link></li>
                                        <hr />
                                        <li onClick={()=>logout()}><Link to='/'>Wyloguj się</Link></li>
                                    </DropdownMenu>
                                </li>
                            </>
                        ) : (
                            <li className="square buttons">
                                <Icon icon="akar-icons:people-group" />
                                <DropdownMenu centerItems>
                                    <li onClick={()=>handleOpenLoginModal('login')}><p>Zaloguj się</p></li>
                                    <li onClick={()=>handleOpenLoginModal('register')}><p>Zarejestruj się</p></li>
                                </DropdownMenu>
                            </li>
                        )}
                    </ul>
                </div>
            </StyledNav>
        </>
    )
}
