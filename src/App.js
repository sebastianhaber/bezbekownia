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

export const API_IP = process.env.REACT_STRAPI_PUBLIC_API_URL || 'http://192.168.0.45:1337';
export const limitPosts = 10;
export const APP_URL = 'https://bezbekownia.pl';
export const MAX_FILESIZE_AFTER_COMPRESSION = 300;
export const MAX_PROFILE_SIZE_AFTER_COMPRESSION = 50;
export const POSTS_QUERY_VARIABLES = {
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
  const [mainNotification, setMainNotification] = useState({});
  const [isNotificationHidden, setNotificationHidden] = useState(false);
  const [getPosts, { data, fetchMore, refetch }] = useLazyQuery(GET_POSTS)
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
        setMaintenance(res.data.isUnderMaintenance);
      });
  }
  const handleHideNotification = () => {
    setNotificationHidden(true);
  }

  useEffect(() => {
    axios.defaults.baseURL = API_IP;
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnderMaintenance])
  useEffect(() => {
    if (data) {
      setPosts(data.posts)
    }
  }, [data])

  if(isUnderMaintenance) return <Loader message='Trwają prace administracyjne.' />

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      setUser,
      posts,
      setPosts,
      getPosts,
      onLoadMore,
      refetch,
      totalPostsLength,
      setTotalPostsLength,
      fetchMe,
      isUnderMaintenance
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
            <Route path='/ustawienia' element={<UserSettings />} />
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
