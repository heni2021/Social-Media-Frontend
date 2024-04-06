import React, { useContext, useEffect, useState } from 'react';
import userContext from '../../context/User/UserContext';
import { useNavigate } from 'react-router-dom';
import endCallIcon from '../../Photos/endCallIcon.jpg';
import unMuteMicIcon from '../../Photos/unmuteMic.png';
import muteMicIcon from '../../Photos/muteMic.png';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import CallChat from './CallChat';

const AcceptVoiceCall = (props) => {
  const context = useContext(userContext);
  const { roomId, endVoiceCall, receiverDetails, setRoomId, setReceiverDetails, user, setChats, setUpWebSocket, stompClient, chats } = context;
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPermissionGranted, setIsAudioPermissionGranted] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);

  // FIXME-Connection for chat is established multiple times

  useEffect(() => {
    fetchProfileSource(receiverDetails.profilePhoto);
  }, [receiverDetails.profilePhoto]);

  useEffect(() => {
    if (!isConnectionEstablished) {
      const url = `${process.env.REACT_APP_CALL_CHAT_SUBSCRIBE}/${roomId}`;
      setUpWebSocket(url, async (response) => {
        const receivedResponse = await JSON.parse(response.body);
        await setChats((prevChats) => [...prevChats, receivedResponse]);
      });
      setIsConnectionEstablished(true);
    }
  },[]); // Add isConnectionEstablished to the dependency array


  // useEffect(() => {
  //   if (!isConnectionEstablished) {
  //     subscribeToChatRoom(roomId);
  //     setIsConnectionEstablished(true);
  //   }
  //   // return () => {
  //   //   closeWebSocket();
  //   // };
  // });

  // // const closeWebSocket = () => {
  // //   stompClient && stompClient.deactivate();
  // // };

  // const subscribeToChatRoom = async (roomId) => {
  //   // if (roomId) {
  //   const url = `${process.env.REACT_APP_CALL_CHAT_SUBSCRIBE}/${roomId}`;
  //   await setUpWebSocket(url, async (response) => {
  //     const receivedResponse = await JSON.parse(response.body);
  //     await setChats((prevChats) => [...prevChats, receivedResponse]);
  //   });
  //   console.log("Subscription for chats is sucessfull");
  //   // }
  // };

  useEffect(() => {
    if (!isAudioPermissionGranted) {
      requestAudioPermission();
    }

    return () => {
     setIsAudioPermissionGranted(false);
    }
  }, []);

  const fetchProfileSource = (image) => {
    if (image) {
      const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      const url = `data:${mimeType};base64,${image}`;
      setImageUrl(url);
    }
  };

  const endCallAndReturn = () => {
    endCall(receiverDetails, user, roomId);
  };

  const requestAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Permission granted
      setIsAudioPermissionGranted(true);
      // Release the stream
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      // Permission denied or error occurred
      console.error('Error accessing microphone:', error);
      setIsAudioPermissionGranted(false);
    }
  };

  const endCall = async (receiver, caller, roomId) => {
    const response = await endVoiceCall(caller[0]?.id, receiver.id, roomId);
    const data = await response.json();
    if (data.success) {
      await setRoomId("default");
      await setReceiverDetails({});
      await setChats([]);
      props.showAlert("Call Ended Successfully...", "success");
      navigate("/people");
    } else {
      props.showAlert(data.message, "danger");
    }
  };

  const initials = receiverDetails.firstName.charAt(0).toUpperCase() + receiverDetails.lastName.charAt(0).toUpperCase();

  const switchBetweenMuteAndUnMute = () => {
    console.log("Mic Muted");
    setIsMuted(!isMuted);
  };

  const startChatting = () => {
    setChatOpen(!isChatOpen);
  };

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
        <p style={{ color: 'black', fontSize: '24px', fontWeight: 'bolder' }}>
          {receiverDetails.firstName + " " + receiverDetails.lastName}
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        {isAudioPermissionGranted && (
          <>
            {isMuted ?
              <Tooltip title='Mute'>
                <IconButton onClick={switchBetweenMuteAndUnMute}>
                  <img src={muteMicIcon} alt='Mute Mic' style={{ width: 50, height: 50 }} />
                </IconButton>
              </Tooltip>
              :
              <Tooltip title='unMute'>
                <IconButton onClick={switchBetweenMuteAndUnMute}>
                  <img src={unMuteMicIcon} alt='unMute Mic' style={{ width: 50, height: 50 }} />
                </IconButton>
              </Tooltip>
            }
          </>
        )}
        <Tooltip title='Open Chat Box'>
          <IconButton onClick={startChatting}>
            <MessageRoundedIcon fontSize='50' />
          </IconButton>
        </Tooltip>
        <Tooltip title='End Call'>
          <IconButton onClick={endCallAndReturn}>
            <img src={endCallIcon} alt='End call' style={{ width: 70, height: 70 }} />
          </IconButton>
        </Tooltip>
      </div>

      {isChatOpen && <CallChat />}
    </div>
  );
};

export default AcceptVoiceCall;
