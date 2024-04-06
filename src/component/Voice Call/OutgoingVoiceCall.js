import React, { useContext, useEffect } from 'react'
import endCallIcon from '../../Photos/endCallIcon.jpg';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userContext from '../../context/User/UserContext';

const OutgoingVoiceCall = (props) => {
    const navigate = useNavigate();

    const context = useContext(userContext);
    const { endVoiceCall, user,stompClient, receiverDetails, roomId, setRoomId, setReceiverDetails , setChats} = context;
    const endCallAndReturn = () => {
        endCall(receiverDetails, user, roomId);
    }

    const endCall = async(receiver, caller, roomId) => {
        const response = await endVoiceCall(caller[0]?.id, receiver.id, roomId);
        const data = await response.json();
        if(data.success){
            await setRoomId("default");
            await setReceiverDetails({});
            props.showAlert("Call Ended Successfully...", "success");
            navigate("/people");
        }
        else{
            props.showAlert(data.message, "danger");
        }
    }

  return (
      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'lightgreen',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
      }}>
          <p style={{ color: 'black', fontSize: '24px', fontWeight: 'bolder', textAlign: 'center' }}>
              Calling {localStorage.getItem("Caller Name")}...
          </p>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <Tooltip title='End Call'>
                  <IconButton onClick={endCallAndReturn}>
                      <img src={endCallIcon} alt='End call' style={{ width: 70, height: 70 }} />
                  </IconButton>
              </Tooltip>
          </div>
      </div>
  )
}

export default OutgoingVoiceCall
