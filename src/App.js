import Nav from "./components/organisms/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/views/HomePage";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Meme from "./components/views/Meme";
import NotFound from "./components/views/NotFound";
import Hashtag from "./components/views/Hashtag";
import Search from "./components/organisms/search/Search";
import Cookies from "js-cookie";
import AppContext from "./context/AppContext";

export const API_IP = process.env.REACT_STRAPI_PUBLIC_API_URL || 'http://192.168.0.45:1337';

function App() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      fetch(`${API_IP}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (!res.ok) {
          Cookies.remove("token");
          setUser({});
          return null;
        }
        const user = await res.json();
        setUser(user);
      });
    }
    fetch(API_IP +'/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      });
  }, []);
  return (
    <AppContext.Provider value={{
      user,
      isAuthenticated: !!user,
      setUser
    }}>
      <Router>
        <Nav />
        <main>
          <Routes>
            <Route path='/' element={<HomePage posts={posts} />} />
            <Route path='pomoc' element={<Helmet>
                  <title>Bezbekownia | Pomoc</title>
                  <meta name="description" content="Pomoc w serwisie Bezbekownia.pl" />
            </Helmet>} />
            <Route path='/meme/:slug' element={<Meme />} />
            <Route path='/hashtag/:hashtag' element={<Hashtag />} />
            <Route path='/search/:value' element={<Search />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
