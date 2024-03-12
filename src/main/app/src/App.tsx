import { Routes, Route } from 'react-router-dom'
import Signin from './pages/Signin/Signin';
import Register from './pages/Register/Register';
import RoomList from './pages/RoomList/RoomList';

function App() {


    return (
        <>
          <>
            <Routes>
              <Route path='/' element={<Signin />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/roomlist' element={<RoomList/>}/>
            </Routes>
          </>
        </>
    );
}

export default App
