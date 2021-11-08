import React, { useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import AppContext from '../../../context/AppContext';

export default function EditProfile() {
    const { username } = useParams();
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!user || user.username !== username) {
            navigate('/');
            return null;
        }
    }, [navigate, user, username])
    
    return (
        <div>
            <p>{ username } edycja</p>
        </div>
    )
}
