import { useQuery } from '@apollo/client';
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router';
import AppContext from '../../../../context/AppContext';
import { GET_USER } from '../../../../queries/Queries';
import NotFound from '../../NotFound';
import Main from './Main';
import Security from './Security';
import { StyledLi, StyledSettings } from './UserSettings.styles';

export default function UserSettings() {
    const { username } = useParams();
    const { user } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('Ogólne');
    const { data: userData } = useQuery(GET_USER, {
        variables: {
            username: username
        }
    })
    
    if (!user || (user.username !== username)) return <NotFound />
    
    return (
        <StyledSettings activeTab={activeTab}>
            <ul className="nav">
                <StyledLi onClick={()=>setActiveTab('Ogólne')} isActive={activeTab === 'Ogólne'}>Ogólne</StyledLi>
                <StyledLi onClick={()=>setActiveTab('Bezpieczeństwo')} isActive={activeTab === 'Bezpieczeństwo'}>Bezpieczeństwo</StyledLi>
            </ul>
            <div id='settings'>
            { activeTab === 'Ogólne' ? 
                <Main user={userData?.users[0]} /> 
                : <Security />}
            </div>
        </StyledSettings>
    )
}