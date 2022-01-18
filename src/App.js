import Nav from "./components/organisms/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/views/HomePage";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Meme from "./components/views/Meme";
import NotFound from "./components/views/NotFound";
import Hashtag from "./components/views/Hashtag";
import Search from "./components/organisms/search/Search";
import Cookies from "js-cookie";
import AppContext from "./context/AppContext";
import Profile from "./components/views/Profile/Profile";
import EditProfile from "./components/views/Profile/EditProfile";
import Loader from "./components/molecules/loader/Loader";
import axios from "axios";

export const API_IP = process.env.REACT_STRAPI_PUBLIC_API_URL || 'http://192.168.8.101:1337';

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const fetchPosts = () => {
    axios.get(`/posts?_sort=created_at:DESC`)
    .then(res => {
      setPosts(res.data);
    });
  }
  
  const fetchMe = () => {
    const token = Cookies.get("token");

    axios.get(`/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      })
      .then(res => {
          console.log('res', res)
          if (res.status !== 200) {
            Cookies.remove("token");
            setUser(null);
            return false;
          }
          setUser(res.data);
      })
  }
  useEffect(() => {
    const token = Cookies.get("token");
    axios.defaults.baseURL = API_IP;

    if (token) {
      fetchMe();
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    console.log(posts)
  }, [posts])

  if (posts.length === 0) return <Loader />

  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      setUser,
      posts,
      setPosts
    }}>
      <Router>
        <Nav />
        <main>
          <Routes>
            <Route path='/' element={<HomePage posts={posts} fetchPosts={fetchPosts} />} />
            <Route path='pomoc' element={<Helmet>
                  <title>Bezbekownia | Pomoc</title>
                  <meta name="description" content="Pomoc w serwisie Bezbekownia.pl" />
            </Helmet>} />
            <Route path='/meme/:slug' element={<Meme />} />
            <Route path='/hashtag/:hashtag' element={<Hashtag />} />
            <Route path='/search/:value' element={<Search />} />
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
