import React, { useContext, useEffect, useState } from 'react'
import userContext from '../../context/User/UserContext'
import endCallIcon from '../../Photos/endCallIcon.jpg';
import receiveCallIcon from '../../Photos/receiveCall.png';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './motion.css';

const IncomingVoiceCall = (props) => {

  const navigate = useNavigate();
  const context = useContext(userContext);
  const { endVoiceCall, user, receiverDetails, roomId, setRoomId, setReceiverDetails, answerVoiceCall, setChats, stompClient, chats } = context;

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchProfileSource(receiverDetails.profilePhoto);
  }, [receiverDetails.profilePhoto]);

  const endCallAndReturn = () => {
    endCall(receiverDetails, user, roomId);
  }

  const endCall = async (receiver, caller, roomId) => {
    const response = await endVoiceCall(caller[0]?.id, receiver.id, roomId);
    const data = await response.json();
    if (data.success) {
      await setRoomId("default");
      await setReceiverDetails({});
      props.showAlert("Call Ended Successfully...", "success");
      navigate("/people");
    }
    else {
      props.showAlert(data.message, "danger");
    }
  }

  const fetchProfileSource = (image) => {
    if (image) {
      const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      const url = `data:${mimeType};base64,${image}`;
      setImageUrl(url);
    }
  }

  const receiveCall = () => { 
      console.log("Receiving Call");
      receiveVoiceCall(user[0]?.id, roomId);
  }

  const receiveVoiceCall = async (userId, roomId) => {
    const response = await answerVoiceCall(userId, roomId);
    const data = await response.json();
    if(data.success){
      navigate("/voice/call/receive");
    }
    else{
      props.showAlert(data.message, "danger");
    }
  }

  const initials = receiverDetails.firstName.charAt(0).toUpperCase() + receiverDetails.lastName.charAt(0).toUpperCase();

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
      <div style={{ position: 'absolute', top: 40 }}>
        {
          imageUrl === null ?
            <Avatar sx={{ fontSize: "40px", backgroundColor: "lightblue", color: "black", width: "80px", height: "80px", position: "relative" }} aria-label="recipe">
              {initials}
            </Avatar>
            :
            <Avatar sx={{ width: "80px", height: "80px", position: "relative" }} aria-label="recipe">
              <img
                src={imageUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: '0',
                  left: '0',
                }}
              />
            </Avatar>
        }
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'black', fontSize: '24px', fontWeight: 'bolder', display: 'inline-block' }}>
          {receiverDetails.firstName + " " + receiverDetails.lastName} is &nbsp;
        </p>
        <p className='calling-text' style={{ color: 'black', fontSize: '24px', fontWeight: 'bolder', display: 'inline-block', margin: 0 }}>
          Calling ...
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <Tooltip title='Receive Call'>
          <IconButton onClick={receiveCall}>
            <img src={receiveCallIcon} alt='End call' style={{ width: 60, height: 60 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='End Call'>
          <IconButton onClick={endCallAndReturn}>
            <img src={endCallIcon} alt='End call' style={{ width: 70, height: 70 }} />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default IncomingVoiceCall
