import { Outlet } from 'react-router-dom';
import Footer from './components/footer';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="container pt-5">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
