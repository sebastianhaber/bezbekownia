import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AppContext from '../../../../context/AppContext';
import Loader from '../../../molecules/loader/Loader';
import Main from './Main';
import Security from './Security';
import { StyledLi, StyledSettings } from './UserSettings.styles';

export default function UserSettings() {
    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Ogólne');
    const navigate = useNavigate();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!user) navigate('/')
        }, 2000);

        return ()=> clearTimeout(timeout);
    }, [user, navigate]);

    if (!user) return <Loader message='Ładowanie danych...' />
    
    return (
        <StyledSettings activeTab={activeTab}>
            <ul className="nav">
                <StyledLi onClick={()=>setActiveTab('Ogólne')} isActive={activeTab === 'Ogólne'}>Ogólne</StyledLi>
                <StyledLi onClick={()=>setActiveTab('Bezpieczeństwo')} isActive={activeTab === 'Bezpieczeństwo'}>Bezpieczeństwo</StyledLi>
            </ul>
            <div id='settings'>
            { activeTab === 'Ogólne' ? 
                <Main /> 
                : <Security />}
            </div>
        </StyledSettings>
    )
}