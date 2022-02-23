import { API_IP } from "../../../../App";
import Button from "../../../utils/Button";
import UserImage from '../../../../assets/user-image.png'
import Input from "../../../molecules/input/Input";
import { useContext, useEffect, useState } from "react";
import AppContext from "../../../../context/AppContext";
import { useQuery } from "@apollo/client";
import { GET_AVAILABLE_AVATARS, GET_AVATARS__FORALL } from "../../../../queries/Queries";
import { StyledAvatars } from "./UserSettings.styles";
import { Icon } from "@iconify/react";
import {toast} from 'react-toastify'
import axios from "axios";
import Cookies from "js-cookie";

// todo: 
//      > save choosen files

export default function Main() {
    const { user, fetchMe } = useContext(AppContext);
    const { data: data_forAllAvatars, error: error_forAllAvatars } = useQuery(GET_AVATARS__FORALL);
    const { data: data_availableAvatars, error: error_availableAvatars } = useQuery(GET_AVAILABLE_AVATARS, {
        variables: {
            id: user.id
        }
    });
    const [showAvatars, setShowAvatars] = useState(false);
    const [avatar, setAvatar] = useState({
        choosen: false,
        data: {}
    });
    // const [showBackgrounds, setShowBackgrounds] = useState(false);
    // const [background, setBackground] = useState({
    //     choosen: false,
    //     data: {}
    // });

    useEffect(() => {
        window.scrollTo(0,0)
    }, []);

    useEffect(() => {
        if(error_availableAvatars){
            toast.error('Nie można załadować specjalnych awatarów.')
        }
        if(error_forAllAvatars){
            return toast.error('Nie można załadować awatarów.')
        }
    }, [error_availableAvatars, error_forAllAvatars]);

    useEffect(() => {
        if(data_forAllAvatars && data_availableAvatars && user.avatar){
            data_forAllAvatars.avatars.map((element) => {
                if(parseInt(element.image.id) === user.avatar.id){
                    setAvatar({
                        choosen: false,
                        data: element.image
                    })
                }
                return true;
            })
            data_availableAvatars.user.availableAvatars.map((element) => {
                if(parseInt(element.image.id) === user.avatar.id){
                    setAvatar({
                        choosen: false,
                        data: element.image
                    })
                }
                return true;
            })
        }
    }, [data_forAllAvatars, user.avatar, data_availableAvatars]);

    const handleSubmit = ()=>{
        console.log(avatar)
        const token = Cookies.get('token');

        if(!user || !token) {
            toast.error('Wychodzi na to, że nie jesteś zalogowany. Zaloguj się i spróbuj ponownie.')
            return false;
        }
        if(!avatar) {
            toast.error('Chyba było grzebane w kodzie i nie masz wybranego avatara 🤔')
            return false;
        }

        axios.put(`/users/${user.id}`, {
            avatar: {
                "id": avatar.data.id,
                "url": avatar.data.url,
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
            setAvatar({
                choosen: false,
                data: {}
            })
        })
    }

    const handleRenderAvatars = (exist, array) => {
        if(error_availableAvatars){
            setShowAvatars(false);
            return false;
        }
        if(exist){
            return array.map((element, index) => {
                return <div 
                    onClick={()=>{
                        if(avatar.data && (parseInt(avatar.data.id) === parseInt(element.image.id))){
                            setAvatar({
                                choosen: false,
                                data: null
                            });
                        } else setAvatar({
                            choosen: true,
                            data: element.image
                        });
                    }}
                    className={avatar.data && (parseInt(avatar.data.id) === parseInt(element.image.id)) ? `choosen` : ``}
                    key={index} 
                    style={{backgroundImage: `url(${API_IP}${element.image.url})`}}></div>
            })
        }
    }

    if(!user) return null;

    return (
        <div id='settings-wrapper'>
            <div className="title">Ustawienia konta: Ogólne</div>
            <div className="wrapper background">
                <div className="background">
                    {user.backgroundImage ? (
                        <img src={`${API_IP}${user.backgroundImage.formats?.small.url || user.backgroundImage.url}`} alt={`Tło użytkownika ${user.username}`} />
                    ) : (
                        <div className="bg-none">
                            <p>Nie masz ustawionego tła.</p>
                        </div>
                    )}
                </div>
                <div className="buttons">
                    <Button>Zmień tło</Button>
                </div>
            </div>
            <div className="wrapper">
                <div className="image">
                    {user.avatar ? (
                        <img src={`${API_IP}${user.avatar.url}`} alt={`Awatar ${user.username}`} />
                    ) : (
                        <img src={UserImage} alt={`Awatar ${user.username}`} />
                    )}
                </div>
                <div className="buttons">
                    <Button onClick={()=>setShowAvatars((prev) => !prev)}>
                        {showAvatars ? (
                            <p>Ukryj dostępne awatary</p>
                        ) : (
                            <p>Pokaż dostępne awatary</p>
                        )}
                        <Icon icon="akar-icons:chevron-down" className={showAvatars ? `rotating-arrow rotate` : `rotating-arrow`} />
                    </Button>
                </div>
                <div className="avatars">
                    {showAvatars && (
                        <StyledAvatars>
                            {handleRenderAvatars(data_availableAvatars, data_availableAvatars.user.availableAvatars)}
                            {handleRenderAvatars(data_forAllAvatars, data_forAllAvatars.avatars)}
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
                <Button onClick={handleSubmit} disabled={!avatar.choosen}>Zapisz zmiany</Button>
            </div>
        </div>
    )
}
