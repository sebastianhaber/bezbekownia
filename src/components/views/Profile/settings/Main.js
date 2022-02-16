import { API_IP } from "../../../../App";
import Button from "../../../utils/Button";
import UserImage from '../../../../assets/user-image.png'
import Input from "../../../molecules/input/Input";
import { useContext, useEffect } from "react";
import AppContext from "../../../../context/AppContext";
import { StyledTab } from "./UserSettings.styles";

export default function Main({user}) {
    const { user: contextUser } = useContext(AppContext);
    useEffect(() => {
        window.scrollTo(0,0)
    }, []);
    if(!user) return null;

    return (
        <StyledTab>
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
                    <Button variant='ghost'>Usuń tło</Button>
                </div>
            </div>
            <div className="wrapper">
                <div className="image">
                    {user.image ? (
                        <img src={`${API_IP}${user.image.formats?.small.url || user.image.url}`} alt={`Zdjęcie profilowe ${user.username}`} />
                    ) : (
                        <img src={UserImage} alt={`Zdjęcie profilowe użytkownika ${user.username}`} />
                    )}
                </div>
                <div className="buttons">
                    <Button>Zmień zdjęcie profilowe</Button>
                    <Button variant='ghost'>Usuń zdjęcie profilowe</Button>
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
                <Button variant='ghost'>Anuluj</Button>
                <Button>Zapisz zmiany</Button>
            </div>
        </StyledTab>
    )
}
