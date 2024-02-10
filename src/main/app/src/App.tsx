import { Routes, Route } from 'react-router-dom'
import Signin from './pages/Signin/Signin';
import Register from './pages/Register/Register';

function App() {


    return (
        <>
          <>
            <Routes>
              <Route path='/' element={<Signin />}/>
              <Route path='/register' element={<Register />}/>
            </Routes>
          </>
        </>
    );
}

export default App
