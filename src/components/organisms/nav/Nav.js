import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { StyledNav } from './Nav.styles'
import { Icon } from '@iconify/react';
import UserImage from '../../../assets/user-image.png';
import Button from '../../utils/Button';
import DropdownMenu from '../../utils/DropdownMenu';

export default function Nav() {
    const [isSearchBoxOpen, setSearchBoxOpen] = useState(false);
    const [user, setUser] = useState(false);
    const logout = () => {
        setUser(false);
    }

    return (
        <StyledNav>
            <div className="wrapper">
                <Link to='/' className='logo'>Bezbekownia</Link>
                <div id="search-box">
                    <div className={isSearchBoxOpen ? `search-box active` : `search-box`}>
                        <input type="search" autoComplete='off' placeholder='Szukaj...' />
                    </div>
                </div>
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
                            <DropdownMenu>
                                <li onClick={()=>setUser(true)}><Button variant='ghost'>Zaloguj się</Button></li>
                                <li><Button>Zarejestruj się</Button></li>
                            </DropdownMenu>
                        </li>
                    )}
                </ul>
            </div>
        </StyledNav>
    )
}
