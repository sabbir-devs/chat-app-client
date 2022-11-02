import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Chat from './Components/Chat/Chat';
import Signup from './Components/Signup/Signup';
import NotFound from './Components/NotFound/NotFound';
import LoginUsers from './Components/LoginUsers/LoginUsers';

function App() {
  // const {user, isLoading, error} = useSelector((state) => state.user)
  // console.log(user);
  return (
    <div className="App">
      {/* <Header /> */}
      <Routes>
        <Route path='/' element={<Chat />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<LoginUsers />}></Route>
        <Route path='/chat' element={<Chat />}></Route>
        <Route path='*' element={<NotFound />}></Route>
      </Routes>
      <Toaster
        position="top-right"
        reverseOrder={true}
      />
    </div>
  );
}

export default App;
