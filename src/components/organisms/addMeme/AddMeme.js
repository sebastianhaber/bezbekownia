import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import Input from '../../molecules/input/Input';
import Button from '../../utils/Button';
import { useForm } from 'react-hook-form'
import { Icon } from '@iconify/react';
import Compressor from 'compressorjs'
import { useState } from 'react/cjs/react.development';
import AppContext from '../../../context/AppContext';
import axios from 'axios'
import Cookies from 'js-cookie';

const MAX_FILESIZE_AFTER_COMPRESSION = 500; // KB

export default function AddMeme({onClose}) {
    let { register, handleSubmit, formState: { errors }, setError } = useForm();
    const [compressedImage, setCompressedImage] = useState({});
    const { user, fetchPosts } = useContext(AppContext);
    const token = Cookies.get('token');
    const [isLoading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        if (!user) {
            return false;
        }

        setLoading(true);

        const imageName = data.title.replaceAll(" ", "_") + "_by_" + user.username + "_bezbekownia";

        // upload image
        let formData = new FormData();
        formData.append('files', compressedImage, imageName)

        let imageID;
        await axios.post('/upload', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then((res) => {
                imageID = res.data[0].id;
            }).catch(() => {
                setError('image', {
                    type: 'upload',
                    message: 'Nie można dodać pliku. Skontaktuj się z administratorem. (#001)'
                })
                setLoading(false);
                return false;
            })
        
        // upload meme
        let uploadData = {
            "title": `${data.title}`,
            "description": `${data.description}`,
            "user": {
                "id": user.id
            },
            "image": {
                "id": imageID
            },
            "hashtags": `${data.hashtags}`,
            "slug": `${data.title.replaceAll(" ", "-")}${data.id}`
        }

        axios.post('/posts', uploadData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8',
            }
        }).then(() => {
                fetchPosts();
                onClose();
            }).catch((error) => {
                axios.delete('/upload/files/' + imageID, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }).then(() => {
                    setError('upload', {
                        type: 'upload',
                        message: 'Nie można dodać pliku. Skontaktuj się z administratorem. (#002)'
                    })
                }).catch(() => {
                    setError('upload', {
                        type: 'upload',
                        message: 'Nie można dodać pliku. Skontaktuj się z administratorem. (#002)'
                    })
                })
                setLoading(false);
                return false;
            })
        setLoading(false);
    }
    const checkImage = (e) => {
        if (e.target.files.length > 0) {
            if (e.target.files[0].name.match(/.(jpg|jpeg|gif)$/i)) {
                compressImage(e.target.files[0])
                return true;
            }
            setError("image", {
                type: "extension",
                message: "Niedozwolone rozszerzenie pliku. Dozwolone typy: .jpg, .jpeg lub .gif",
            });
        }
    }
    const previewImage = () => {
        if (compressedImage && compressedImage.size) {
            const src = URL.createObjectURL(compressedImage);
            const preview = document.getElementById("preview-image");
            preview.src = src;
            preview.style.display = "block";
        }
    }
    const compressImage = (img) => {
        new Compressor(img, {
            quality: 0.8,
            success: (compressedResult) => {
                if (compressedResult.size > MAX_FILESIZE_AFTER_COMPRESSION*8192) {
                    setError("image", {
                        type: "compress",
                        message: "Rozmiar pliku po skompresowaniu jest za duży! Spróbuj zmniejszyć rozmiar pliku na https://tinypng.com/",
                    });
                    return false;
                }
                setCompressedImage(compressedResult)
                return true;
            },
            error: () => {
                setError("image", {
                    type: "compress",
                    message: "Nie można skomresować pliku.",
                });
                return false;
            }
        });
    }
    useEffect(() => {
        previewImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compressedImage])

    return (
        <StyledForm onSubmit={handleSubmit(onSubmit)} autoComplete='off'>
            <div className="inputs">
                <Input maxWidth='300px' className={errors.title && `error`}>
                    <input
                        type="text"
                        placeholder='Tytuł*'
                        defaultValue=''
                        maxLength={32}
                        {...register('title', {
                            required: true,
                            maxLength: 32,
                    })} />
                </Input>
                <Input maxWidth='300px'>
                    <input
                        type="text"
                        placeholder='Opis'
                        maxLength={128}
                        defaultValue=''
                        {...register('description', {
                            maxLength: 128
                        })} />
                </Input>
                <Input maxWidth='300px'>
                    <input
                        type="text"
                        maxLength={128}
                        placeholder='Hashtagi (np. #bezbekownia #memy)'
                        {...register('hashtags', {
                            maxLength: 128
                        })} />
                </Input>
            </div>
            <div className="image">
                <Input maxWidth='300px'>
                    <div className="preview">
                        <img id='preview-image' src='' alt='Podgląd mema' />
                    </div>
                    <label htmlFor="image-input" className={errors.image && `error`}>
                        <input 
                            id='image-input'
                            accept="image/gif, image/jpeg, image/jpg"
                            type="file"
                            {...register('image', {
                                required: true,
                                onChange: checkImage
                            })}
                        />
                        <div>
                            <Icon icon="akar-icons:cloud-upload" />
                            <p>
                                Wybierz obrazek
                                <span>(max. {MAX_FILESIZE_AFTER_COMPRESSION} KB po skompresowaniu)</span>
                            </p>
                        </div>
                        {errors.image && (
                            <span className="error">{ errors.image.message }</span>
                        )}
                        {errors.upload && (
                            <span className="error">{ errors.upload.message }</span>
                        )}
                    </label>
                </Input>
            </div>
            <div className="buttons">
                <Button variant='ghost' onClick={()=>onClose()}>Anuluj</Button>
                <Button type='submit' disabled={isLoading}>Dodaj mema</Button>
            </div>
        </StyledForm>
  );
}
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .inputs, .image{
        width: 50%;
    }
    .inputs{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
        input{
            margin-left: 1rem;
        }
    }
    .image{
        position: relative;
        display: grid;
        place-items: center;
        background-color: ${({theme}) => theme.colors.background.dark};
        width: 300px;
        height: 300px;
        border-radius: .5rem;
        .preview{
            display: grid;
            place-items: center;
            height: 300px;
            img{
                display: none;
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: center;
            }
        }
        label{
            position: absolute;
            width: 100%;
            height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            cursor: pointer;
            background-color: ${({ theme }) => theme.colors.rgba};
            border: 1px solid transparent;
            padding: 1rem;
            transition: background-color .2s ease, color .2s ease;
            &:hover{
                background-color: transparent;
                color: transparent;
                span.error{
                    color: transparent;
                }
            }
            &.error{
                border-color: ${({ theme }) => theme.colors.red.dark};
            }
            span.error{
                font-size: 14px;
                color: ${({ theme }) => theme.colors.red.light};
                text-align: center;
                transition: color .2s ease;
            }
            div{
                display: flex;
                align-items: center;
                gap: 0.5rem;
                svg{
                    font-size: 1.5rem;
                }
                p{
                    display: flex;
                    flex-direction: column;
                }
                span{
                    font-size: 14px;
                }
            }
        }
        #image-input{
            display: none;
        }
    }
    .buttons{
        display: flex;
        gap: 1rem;
    }
`;