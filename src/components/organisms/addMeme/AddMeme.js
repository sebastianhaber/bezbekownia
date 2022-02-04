import React, { useContext, useEffect } from 'react';
import Input from '../../molecules/input/Input';
import Button from '../../utils/Button';
import { useForm } from 'react-hook-form'
import { Icon } from '@iconify/react';
import Compressor from 'compressorjs'
import { useState } from 'react/cjs/react.development';
import AppContext from '../../../context/AppContext';
import axios from 'axios'
import Cookies from 'js-cookie';
import removeDiacritics from './RemoveDiacritics'
import { StyledForm } from './AddMeme.styles';

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
        const noDiacriticsTitle = removeDiacritics(data.title)
        const slug = `${noDiacriticsTitle.replaceAll(" ", "-")}${imageID}`;
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
            "slug": slug
        }

        axios.post('/posts', uploadData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json; charset=utf-8',
            }
        }).then(() => {
                fetchPosts();
                onClose('success');
        }).catch(() => {
            setError('upload', {
                type: 'upload',
                message: 'Nie można dodać pliku. Skontaktuj się z administratorem. (#002)'
            })
            axios.delete('/upload/files/' + imageID, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).catch(() => {
                setError('upload', {
                    type: 'upload',
                    message: 'Nie można dodać pliku. Skontaktuj się z administratorem. (#004)'
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
