import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StyledNav } from './Nav.styles'
import { Icon } from '@iconify/react';
import UserImage from '../../../assets/user-image.png';
import Button from '../../utils/Button';
import DropdownMenu from '../../utils/DropdownMenu';

export default function Nav() {
    const [isSearchBoxOpen, setSearchBoxOpen] = useState(false);
    const [user, setUser] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const logout = () => {
        setUser(false);
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
    }

    return (
        <StyledNav>
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
                                <img src={UserImage} alt="" />
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
                                <li onClick={()=>setUser(true)}><Button variant='ghost' style={{marginBottom: '1rem'}}>Zaloguj się</Button></li>
                                <li><Button>Zarejestruj się</Button></li>
                            </DropdownMenu>
                        </li>
                    )}
                </ul>
            </div>
        </StyledNav>
    )
}
