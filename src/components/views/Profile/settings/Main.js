import { API_IP, MAX_PROFILE_SIZE_AFTER_COMPRESSION } from "../../../../App";
import { toast } from 'react-toastify'
import Button from "../../../utils/Button";
import UserImage from '../../../../assets/user-image.png'
import Input from "../../../molecules/input/Input";
import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../../../context/AppContext";
import { StyledTab } from "./UserSettings.styles";
import Compressor from "compressorjs";
import { MAX_FILESIZE_AFTER_COMPRESSION } from '../../../../App'

const COMPRESSED_IMAGE_INIT = {
    profile: null,
    background: null
}

export default function Main({user}) {
    const { user: contextUser } = useContext(AppContext);
    const [compressedImage, setCompressedImage] = useState(COMPRESSED_IMAGE_INIT);
    const profileRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0,0)
    }, []);

    const checkImage = (e) => {
        if (e.target.files.length && e.target.dataset.for) {
            if (e.target.files[0].name.match(/.(jpg|jpeg|gif)$/i)) {
                compressImage(e.target.files[0], e.target.dataset.for)
                return true;
            }
            toast.error('Niedozwolone rozszerzenie pliku. Dozwolone typy: .jpg, .jpeg lub .gif');
        }
    }
    const compressImage = (img, dataset) => {
        new Compressor(img, {
            quality: 0.8,
            success: (compressedResult) => {
                if(dataset && dataset === 'profile'){
                    if (compressedResult.size > MAX_PROFILE_SIZE_AFTER_COMPRESSION*8192) {
                        toast.error('Rozmiar pliku za duży! Spróbuj zmniejszyć profilowe do 256x256px');
                        return false;
                    }
                    setCompressedImage({
                        ...compressedImage,
                        profile: compressedResult
                    })
                } else if(dataset && dataset === 'background'){
                    if (compressedResult.size > MAX_FILESIZE_AFTER_COMPRESSION*8192) {
                        toast.error('Rozmiar tła za duży! Spróbuj skomresować tło na https://tinypng.com/');
                        return false;
                    }
                    setCompressedImage({
                        ...compressedImage,
                        background: compressedResult
                    })
                } else{
                    toast.error('Coś poszło nie tak... Spróbuj ponownie.');
                    return false;
                }
                return true;
            },
            error: () => {
                toast.error('Wystąpił błąd podczas obróbki pliku.');
                return false;
            }
        });
    }

    const onSubmit = (e)=>{
        e.preventDefault();
        console.log(compressedImage)
    }
    const trimString = (string) => {
        if(string.length > 10){
            return `${string.substring(0, 10)}...`
        }
        return string
    }

    if(!user) return null;

    return (
        <StyledTab onSubmit={onSubmit} autoComplete='off'>
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
                    <input
                        id='background-image-input'
                        data-for="background"
                        accept="image/gif, image/jpeg, image/jpg"
                        type="file"
                        onChange={checkImage}
                        style={{display: 'none'}}
                    />
                </div>
                <div className="buttons">
                    <div className="label max">
                        <label htmlFor="background-image-input"></label>
                        {compressedImage.background
                            ? <Button>Wybrane tło: { trimString(compressedImage.background.name) }</Button>
                            : <Button>Zmień tło</Button>}
                    </div>
                    {user.backgroundImage && (
                        <Button variant='ghost'>Usuń tło</Button>
                    )}
                </div>
            </div>
            <div className="wrapper">
                <div className="image">
                    {user.image ? (
                        <img src={`${API_IP}${user.image.formats?.small.url || user.image.url}`} alt={`Zdjęcie profilowe ${user.username}`} />
                    ) : (
                        <img src={UserImage} alt={`Zdjęcie profilowe użytkownika ${user.username}`} />
                    )}
                        <input 
                            id='profile-image-input'
                            data-for="profile"
                            accept="image/gif, image/jpeg, image/jpg"
                            type="file"
                            onChange={checkImage}
                            ref={profileRef}
                            style={{display: 'none'}}
                        />
                </div>
                <div className="buttons">
                    <div className="label">
                        <label htmlFor="profile-image-input"></label>
                        {compressedImage.profile
                            ? <Button>Wybrane zdjęcie: { trimString(compressedImage.profile.name) }</Button>
                            : <Button>Zmień zdjęcie profilowe</Button>}
                    </div>
                    {user.image && (
                        <Button variant='ghost'>Usuń zdjęcie profilowe</Button>
                    )}
                </div>
            </div>
            <p className="small gray">Zalecana wielkość zdjęcia to 256x256px</p>
            <div className="wrapper">
                <Input label='Nazwa użytkownika'>
                    <input type="text" disabled defaultValue={`${contextUser.username}`} />
                </Input>
                <Input label='Email'>
                    <input type="text" disabled defaultValue={`${contextUser.email}`} />
                </Input>
            </div>
            <div className="buttons submit">
                <Button type='reset' variant='ghost' onClick={()=>setCompressedImage(COMPRESSED_IMAGE_INIT)}>Anuluj</Button>
                <Button type='submit'>Zapisz zmiany</Button>
            </div>
        </StyledTab>
    )
}
