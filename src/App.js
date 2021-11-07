import Nav from "./components/organisms/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/views/HomePage";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Meme from "./components/views/Meme";
import NotFound from "./components/views/NotFound";
import Hashtag from "./components/views/Hashtag";
import Search from "./components/organisms/search/Search";

export const API_IP = '192.168.43.238';

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://' + API_IP +':1337/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
      });
  }, []);
  return (
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
  );
}

export default App;
