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
import AddMeme from '../addMeme/AddMeme';
import SearchUserModal from '../searchUsers/SearchUsersModal'

const INIT_MODAL = {
    isOpen: false,
    type: ''
}
export default function Nav() {
    const [isSearchBoxOpen, setSearchBoxOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const { user, setUser, refetch, posts } = useContext(AppContext);
    const [modal, setModal] = useState(INIT_MODAL);
    const [searchModal, setSearchModal] = useState(false);
    const [addMemeModal, setMemeModal] = useState(false);

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
        if (searchValue.startsWith('#')) {
            setSearchValue('');
            setSearchBoxOpen(false);
            handleCloseModal('search');
            return navigate(`/hashtag/${searchValue.substring(1)}`)
        }
        setSearchBoxOpen(false);
        handleOpenModal('search');
    }
    const handleOpenModal = (modal, type) => {
        if (modal === 'login') {
            setModal({
                isOpen: true,
                type: type
            })
        } else if (modal === 'addmeme') {
            setMemeModal(true)
        } else if (modal === 'search') {
            setSearchModal(true)
        }
    }
    const handleCloseModal = (modal) => {
        if (modal === 'login') {
            setModal(INIT_MODAL)
        } else if (modal === 'addmeme') {
            setMemeModal(false)
        } else if (modal === 'search') {
            setSearchModal(false)
            setSearchValue('');
        }
        
    }
    const changeModalType = () => {
        if (modal.type === 'register') {
            handleCloseModal('login');
            handleOpenModal('login', 'login')
        } else {
            handleCloseModal('login');
            handleOpenModal('login', 'register')
        }
    }
    return (
        <>
            <StyledNav>
                {modal && modal.isOpen && (
                    <Modal onClose={() => handleCloseModal('login')}>
                        {modal.type === 'register' ? (
                            <Register changeModalType={changeModalType} closeModal={()=>handleCloseModal('login')} />
                        ) : (
                            <Login changeModalType={changeModalType} closeModal={()=>handleCloseModal('login')} />
                        )}
                    </Modal>
                )}
                {addMemeModal && (
                    <Modal onClose={() => handleCloseModal('addmeme')}>
                        <AddMeme onClose={() => handleCloseModal('addmeme')} />
                    </Modal>
                )}
                {searchModal && (
                    <Modal onClose={() => handleCloseModal('search')}>
                        <SearchUserModal username={searchValue} onClose={()=>handleCloseModal('search')} />
                    </Modal>
                )}
                <div className='nav'>
                    <div className="wrapper">
                        {posts.length ? (
                            <Link to='/' className='logo' onClick={()=>refetch()}>Bezbekownia</Link>
                            ) : (
                            <Link to='/' className='logo'>Bezbekownia</Link>
                        )}
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
                                    <li><Link to='/legal/regulamin'>Regulamin</Link></li>
                                    <li><Link to='/legal/polityka-prywatnosci'>Polityka prywatności</Link></li>
                                    <li><Link to='/legal/rodo'>Rodo</Link></li>
                                </DropdownMenu>
                            </li>
                            {user && user.username ? (
                                <>
                                    <li className="square plus" title='Dodaj mema' onClick={()=>handleOpenModal('addmeme')}>
                                        <Icon icon="akar-icons:plus" />
                                    </li>
                                    <li className="square profile">
                                        <img src={user.icon ? `${API_IP}${user.icon.url}` : UserImage} alt={user.username} />
                                        <DropdownMenu>
                                            <li>
                                                <Link to={`/@${user.username}`}>
                                                    <Icon icon="akar-icons:person" /> Pokaż profil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={`/ustawienia`}>
                                                    <Icon icon="akar-icons:gear" /> Ustawienia
                                                </Link>
                                            </li>
                                            <hr />
                                            <li>
                                                <Link to='/moje-polubienia'>
                                                    <Icon icon="akar-icons:thumbs-up" /> Moje polubienia
                                                </Link>
                                            </li>
                                            <hr />
                                            <li onClick={()=>logout()}>
                                                <Link to='/'>
                                                    <Icon icon="akar-icons:sign-out" /> Wyloguj się
                                                </Link></li>
                                        </DropdownMenu>
                                    </li>
                                </>
                            ) : (
                                <li className="square buttons">
                                    <Icon icon="akar-icons:people-group" />
                                    <DropdownMenu centerItems>
                                        <li onClick={()=>handleOpenModal('login', 'login')}><p>Zaloguj się</p></li>
                                        <li onClick={()=>handleOpenModal('login', 'register')}><p>Zarejestruj się</p></li>
                                    </DropdownMenu>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </StyledNav>
        </>
    )
}
