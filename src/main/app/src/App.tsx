import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from './store/slice/userSlice'

function App() {

    const dispatch = useDispatch();
    const data = useSelector((state:any) => state.data.value);

    useEffect(() => {
        dispatch(register("roych.shao@gmail.com", "123456789"));
    }, [dispatch]);

  return (
    <>
        <h1>ChatApp</h1>
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </>
  )
}

export default App
