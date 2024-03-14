import React, { useContext } from 'react'
import userContext from '../../context/User/UserContext';
import BottomNavigationBar from '../BottomNavigation';
import PersonalProfile from './PersonalProfile';
import { LinearProgress } from '@mui/material';

const PersonalAccountDetails = (props) => {
    const{showAlert, setProgress, showProgress, progress} = props;
    const context = useContext(userContext);
    const {user} = context;
  return (
    <div>
          <BottomNavigationBar showAlert={showAlert} value={"account"} />
      <PersonalProfile id={user[0]?.id} showAlert={showAlert} setProgress={setProgress} progress={progress} showProgress={showProgress} />
    </div>
  )
}

export default PersonalAccountDetails
