import { API_IP } from "../../../../App";
import Button from "../../../utils/Button";
import UserImage from '../../../../assets/user-image.png'
import Input from "../../../molecules/input/Input";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../../../context/AppContext";
import { useQuery } from "@apollo/client";
import { GET_ICONS_AVAILABLE, GET_ICONS_FORALL } from "../../../../queries/Queries";
import { StyledAvatars } from "./UserSettings.styles";
import { Icon } from "@iconify/react";
import {toast} from 'react-toastify'
import axios from "axios";
import Cookies from "js-cookie";

// todo: 
//      > save choosen files

export default function Main() {
    const { user, fetchMe } = useContext(AppContext);
    const { data: data_forAllIcons, error: error_forAllIcons } = useQuery(GET_ICONS_FORALL);
    const { data: data_availableIcons, error: error_availableIcons } = useQuery(GET_ICONS_AVAILABLE, {
        variables: {
            id: user.id
        }
    });
    const [showIcons, setShowIcons] = useState(false);
    const [icon, setIcon] = useState({
        choosen: false,
        data: {}
    });

    useEffect(() => {
        window.scrollTo(0,0)
    }, []);

    useEffect(() => {
        if(error_availableIcons){
            toast.error('Nie można załadować specjalnych ikon.')
        }
        if(error_forAllIcons){
            return toast.error('Nie można załadować ikon.')
        }
    }, [error_availableIcons, error_forAllIcons]);

    useEffect(() => {
        if(data_forAllIcons && data_availableIcons && user.icon){
            data_forAllIcons.icons.map((element) => {
                if(parseInt(element.image.id) === user.icon.id){
                    setIcon({
                        choosen: false,
                        data: element.image
                    })
                }
                return true;
            })
            data_availableIcons.user.availableIcons.map((element) => {
                if(parseInt(element.image.id) === user.icon.id){
                    setIcon({
                        choosen: false,
                        data: element.image
                    })
                }
                return true;
            })
        }
    }, [data_forAllIcons, user.icon, data_availableIcons]);

    const handleSubmit = ()=>{
        const token = Cookies.get('token');

        if(!user || !token) {
            toast.error('Wychodzi na to, że nie jesteś zalogowany. Zaloguj się i spróbuj ponownie.')
            return false;
        }
        if(!icon) {
            toast.error('Chyba było grzebane w kodzie i nie masz wybranego avatara 🤔')
            return false;
        }

        axios.put(`/users/${user.id}`, {
            icon: {
                "id": icon.data.id,
                "url": icon.data.url,
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(()=>{
            fetchMe();
            toast.success('Zmieniono avatar.')
        }).catch(()=>{
            toast.error('Coś poszło nie tak i nie można zmienić avatara 😟')
            setIcon({
                choosen: false,
                data: {}
            })
        })
    }

    const handleRenderAvatars = (exist, array) => {
        if(error_availableIcons){
            setShowIcons(false);
            return false;
        }
        if(exist){
            return array.map((element, index) => {
                return <div 
                    onClick={()=>{
                        if(icon.data && (parseInt(icon.data.id) === parseInt(element.image.id))){
                            setIcon({
                                choosen: false,
                                data: null
                            });
                        } else setIcon({
                            choosen: true,
                            data: element.image
                        });
                    }}
                    className={icon.data && (parseInt(icon.data.id) === parseInt(element.image.id)) ? `choosen` : ``}
                    key={index} 
                    style={{backgroundImage: `url(${API_IP}${element.image.url})`}}></div>
            })
        }
    }

    if(!user) return null;

    return (
        <div id='settings-wrapper'>
            <div className="title">Ustawienia konta: Ogólne</div>
            <div className="wrapper">
                <div className="image">
                    {user.icon ? (
                        <img src={`${API_IP}${user.icon.url}`} alt={`Ikona ${user.username}`} />
                    ) : (
                        <img src={UserImage} alt={`Awatar ${user.username}`} />
                    )}
                </div>
                <div className="buttons">
                    <Button onClick={()=>setShowIcons((prev) => !prev)}>
                        {showIcons ? (
                            <p>Ukryj dostępne awatary</p>
                        ) : (
                            <p>Pokaż dostępne awatary</p>
                        )}
                        <Icon icon="akar-icons:chevron-down" className={showIcons ? `rotating-arrow rotate` : `rotating-arrow`} />
                    </Button>
                </div>
                <div className="avatars">
                    {showIcons && (
                        <StyledAvatars>
                            {data_availableIcons && handleRenderAvatars(data_availableIcons, data_availableIcons.user.availableIcons)}
                            {data_forAllIcons && handleRenderAvatars(data_forAllIcons, data_forAllIcons.icons)}
                        </StyledAvatars>
                    )}
                </div>
            </div>
            <div className="wrapper">
                <Input label='Nazwa użytkownika'>
                    <input type="text" disabled defaultValue={`${user.username}`} />
                </Input>
                <Input label='Email'>
                    <input type="text" disabled defaultValue={`${user.email}`} />
                </Input>
            </div>
            <div className="buttons submit">
                <Button onClick={handleSubmit} disabled={!icon.choosen}>Zapisz zmiany</Button>
            </div>
        </div>
    )
}
