import Nav from "./components/organisms/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/views/HomePage";
import { useEffect, useState } from "react";

export const API_IP = '192.168.0.45';

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
          <Route path='pomoc' element={<p>pomoc</p>} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
