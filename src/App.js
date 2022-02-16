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
import axios from "axios";
import 'simplebar/dist/simplebar.min.css';
import { useLazyQuery } from "@apollo/client";
import { GET_POSTS } from "./queries/Queries";
import MainNotification from "./components/molecules/main-notification/MainNotification";
import Rodo from "./components/views/legal/RODO/Rodo";
import PolicyPrivacy from "./components/views/legal/policy-privacy/PolicyPrivacy";
import Rules from "./components/views/legal/rules/Rules";
import Footer from "./components/molecules/footer/Footer";
import UserSettings from "./components/views/Profile/settings/UserSettings";
import Loader from "./components/molecules/loader/Loader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const API_IP = process.env.REACT_STRAPI_PUBLIC_API_URL || 'http://192.168.8.101:1337';
export const limitPosts = 10;
export const APP_URL = 'https://bezbekownia.pl';
export const MAX_FILESIZE_AFTER_COMPRESSION = 300;
export const MAX_PROFILE_SIZE_AFTER_COMPRESSION = 50;
const POSTS_QUERY_VARIABLES = {
    variables: {
      start: 0,
      limit: limitPosts
    }
  }

function App() {
  const [posts, setPosts] = useState([]);
  const [totalPostsLength, setTotalPostsLength] = useState(0);
  const [user, setUser] = useState(null);
  const [isUnderMaintenance, setMaintenance] = useState(null);
  const [loaderMessage, setLoaderMessage] = useState('');
  const [mainNotification, setMainNotification] = useState({});
  const [isNotificationHidden, setNotificationHidden] = useState(false);
  const [getPosts, { loading, data, fetchMore, refetch }] = useLazyQuery(GET_POSTS)
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
                setMainNotification(res.data)
            }
        });
      setLoaderMessage('Pobieranie memów...')
      axios.get(`/posts/count?user.blocked=false`)
      .then(res => {
        setTotalPostsLength(res.data);
      });
      getPosts(POSTS_QUERY_VARIABLES)
    }
  }, [isUnderMaintenance, getPosts])
  useEffect(() => {
    if (data) {
      setPosts(data.posts)
    }
  }, [data])

  if (loading || posts.length === 0) return <Loader message={loaderMessage} />

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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        />
      <Router>
        <Nav />
        <main>
          {!isNotificationHidden && (
            <MainNotification
              onClose={handleHideNotification}
              data={mainNotification} />
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
            <Route path='/@:username/ustawienia' element={<UserSettings />} />
            <Route path='/legal/rodo' element={<Rodo />} />
            <Route path='/legal/polityka-prywatnosci' element={<PolicyPrivacy />} />
            <Route path='/legal/regulamin' element={<Rules />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AppContext.Provider>
  );
}

export default App;
