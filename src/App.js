import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import Login from './component/Login/Login';
import { useContext, useState } from 'react';
import Alert from './component/Alert';
import UserState from './context/User/UserState';
import SignUp from './component/Login/SignUp';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import HomePage from './component/HomePage';
import ResetPassword from './component/Login/ResetPassword';
import User from './component/People/User';
import CallHistory from './component/Calls/CallHistory';
import FriendRequest from './component/Friends Request/FriendRequest';
import ViewProfile from './component/Account/ViewProfile';
import PersonalAccountDetails from './component/Account/PersonalAccountDetails';
import Post from './component/Posts/Post';
import ShowLikes from './component/LikesShow/ShowLikes';
import { useEffect } from 'react';
import Chat from './component/Chats/Chat';
import ViewChats from './component/Chats/ViewChats';
import Search from './component/Search Functionality/Search';
import VideoCall from './component/Video Call/VideoCall';
import OutgoingVoiceCall from './component/Voice Call/OutgoingVoiceCall';
import IncomingVoiceCall from './component/Voice Call/IncomingVoiceCall';
import AcceptVoiceCall from './component/Voice Call/AcceptVoiceCall';

function App() {
  const theme = createTheme(); // for material Ui

  // for alert
  const [alert, setAlert] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setShowProgress(false);
      }, 500);
    } else {
      setShowProgress(true);
    }
  }, [progress]);
  const showAlertMessage = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  }
  return (
    <UserState>
      <Router>
        <ThemeProvider theme={theme}>
          <Alert message={alert} />
          <Routes>
            <Route path='/login' element={<Login showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/signup' element={<SignUp showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/home' element={<HomePage showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/resetPassword' element={<ResetPassword showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route index element={<Navigate to='/login' />} />
            <Route path='/people' element={<User showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/callHistory' element={<CallHistory showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/viewRequests' element={<FriendRequest showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/viewProfile' element={<ViewProfile showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/view' element={<Navigate to='/viewProfile' />} />
            <Route path='/goToChat' element={<Navigate to='/chat'/>} />
            <Route path='/accountDetails' element={<PersonalAccountDetails showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/addPost' element={<Post showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/showUser' element={<ShowLikes showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/chat' element={<Chat showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/viewChats' element={<ViewChats showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/search' element={<Search showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/videoCall' element={<VideoCall showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/voice/call' element={<OutgoingVoiceCall showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/voice/call/incoming' element={<IncomingVoiceCall showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
            <Route path='/voice/call/receive' element={<AcceptVoiceCall showAlert={showAlertMessage} setProgress={setProgress} progress={progress} showProgress={showProgress} />} />
          </Routes>
        </ThemeProvider>
      </Router>
    </UserState>
  );
}

export default App;
