import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import Loader from '../../molecules/loader/Loader';
import UserImage from '../../../assets/user-image.png'
import { API_IP } from '../../../App';
import { SEARCH_USER_QUERY } from '../../../queries/Queries';
import { SearchUsersWrapper } from './SearchUsersModal.styles';

export default function SearchUsersModal({username, onClose}) {
    const { loading, error, data } = useQuery(SEARCH_USER_QUERY, {
        variables: {
            username: username
        }
    });

    if (loading) return <Loader />;

    return (
        <div>
            <SearchUsersWrapper>
                <section>
                    <div className="heading">Użytkownicy</div>
                    {error && (
                        <div className="error">
                            <p>Wystąpił nieoczekiwany błąd podczas ładowania danych. (Błąd: #005)</p>
                        </div>
                    )}
                    {data.users.length > 0 ? (
                        <ul>{data.users.map((user, index) => (
                            <Link to={`/@${user.username}`} key={index} onClick={onClose}>
                                <li>
                                    {user.icon ? <img src={`${API_IP}${user.icon.url}`} alt={user.username} />
                                    : <img src={UserImage} alt={user.username} />}
                                    <p>{user.username}</p>
                                </li>
                            </Link>
                        )) }</ul>
                    ) : (
                        <div className="notFound">
                            <p>Nie znaleziono użytkownika o nazwie <div className="accent">${username}</div></p>
                        </div>
                    )}
                </section>
            </SearchUsersWrapper>
        </div>
    )
}
