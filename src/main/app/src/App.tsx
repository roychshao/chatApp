import { Routes, Route } from 'react-router-dom'
import Signin from './pages/Signin/Signin';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';

function App() {


    return (
        <>
          <>
            <Routes>
              <Route path='/' element={<Signin />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/home' element={<Home/>}/>
            </Routes>
          </>
        </>
    );
}

export default App
