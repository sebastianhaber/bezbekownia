import Nav from "./components/organisms/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/views/HomePage";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Meme from "./components/views/Meme";
import NotFound from "./components/views/NotFound";
import Hashtag from "./components/views/Hashtag";
import Cookies from "js-cookie";
import AppContext from "./context/AppContext";
import Profile from "./components/views/Profile/Profile";
import EditProfile from "./components/views/Profile/EditProfile";
import Loader from "./components/molecules/loader/Loader";
import axios from "axios";
import 'simplebar/dist/simplebar.min.css';
import TopNotification from "./components/molecules/top-notification/TopNotification";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "./components/queries/Queries";

export const API_IP = process.env.REACT_STRAPI_PUBLIC_API_URL || 'http://192.168.8.101:1337';
export const limitPosts = 10;
export const APP_URL = 'https://bezbekownia.pl';
export const FLOATING_NOTIFICATION_INITIALS = {
  isActive: false,
  message: '',
  type: 'success'
}

function App() {
  const [posts, setPosts] = useState([]);
  const [totalPostsLength, setTotalPostsLength] = useState(0);
  const [user, setUser] = useState(null);
  const [isUnderMaintenance, setMaintenance] = useState(null);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [topNotificationMessage, setTopNotificationMessage] = useState('');
  const [isNotificationHidden, setNotificationHidden] = useState(false);
  const { loading, data, fetchMore, refetch } = useQuery(GET_POSTS, {
    variables: {
      start: 0,
      limit: limitPosts
    }
  })
  const onLoadMore = () => {
    fetchMore({
      variables: {
        start: data.posts.length
      },
      updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
        return {
          ...previousResult,
          posts: [
            ...previousResult.posts,
            ...fetchMoreResult.posts,
          ],
        };
      },
    })
  }
  const fetchMe = () => {
    const token = Cookies.get("token");

    setLoaderMessage('Pobieranie danych urzytkownika...')
    axios.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      })
      .then(res => {
          if (res.status !== 200) {
            Cookies.remove("token");
            setUser(null);
            return false;
          }
          setUser(res.data);
      })
  }
  const checkMaintenanceMode = () => {
    axios.get(`/maintenance-mode`)
      .then(res => {
        if (res.data.isUnderMaintenance) {
          setLoaderMessage('Trwają prace administracyjne.');
        }
        setMaintenance(res.data.isUnderMaintenance);
      });
  }
  const handleHideNotification = () => {
    setNotificationHidden(true);
  }

  useEffect(() => {
    axios.defaults.baseURL = API_IP;

    setLoaderMessage('Łączenie z serwerem...')
    checkMaintenanceMode();
    axios.get(`/posts/count?user.blocked=false`)
      .then(res => {
        setTotalPostsLength(res.data);
      });
  }, []);
  useEffect(() => {
    const token = Cookies.get("token");

    if (isUnderMaintenance === false) {
      if (token) {
        fetchMe();
      }
      axios.get(`/top-notification`)
        .then(res => {
            if (res.data.message.length !== 0) {
                setTopNotificationMessage(res.data.message)
            }
        });
      setLoaderMessage('Pobieranie memów...')
    }
  }, [isUnderMaintenance])
  useEffect(() => {
    if (data) {
      setPosts(data.posts)
    }
  }, [data])

  if (loading) return <Loader message={loaderMessage} />

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      setUser,
      posts,
      setPosts,
      onLoadMore,
      refetch,
      totalPostsLength,
    }}>
      <Router>
        <Nav />
        <main>
          {!isNotificationHidden && (
            <TopNotification
              onClose={handleHideNotification}
              message={topNotificationMessage} />
          )}
          <Routes>
            <Route path='/' element={
              <HomePage totalPostsLength={totalPostsLength} />
            } />
            <Route path='pomoc' element={<Helmet>
                  <title>Bezbekownia | Pomoc</title>
                  <meta name="description" content="Pomoc w serwisie Bezbekownia.pl" />
            </Helmet>} />
            <Route path='/meme/:slug' element={<Meme />} />
            <Route path='/hashtag/:hashtag' element={<Hashtag />} />
            <Route path='/@:username' element={<Profile />} />
            <Route path='/@:username/edytuj' element={<EditProfile />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
