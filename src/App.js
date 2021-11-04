import Nav from "./components/organisms/nav/Nav";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path='/' element={<p>hehe</p>} />
        <Route path='pomoc' element={<p>pomoc</p>} />
      </Routes>
    </Router>
  );
}

export default App;
