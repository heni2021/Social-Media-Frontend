import React, { useContext, useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk';
import userContext from '../../context/User/UserContext';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import CallChat from '../Voice Call/CallChat';
import endCallIcon from '../../Photos/endCallIcon.jpg';
import unMuteMicIcon from '../../Photos/unmuteMic.png';
import muteMicIcon from '../../Photos/muteMic.png';
import chatIcon from '../../Photos/chatIcon.png';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';
import videoOn from '../../Photos/videoOn.png';
import videoOff from '../../Photos/videoOff.png';
import './AcceptVideoCall.css';
import LocalVideo from './LocalVideo';
import RemoteVideo from './RemoteVideo';

const AcceptVideoCall = (props) => {
  const context = useContext(userContext);
  const { receiverDetails, user, roomId, isOtherPersonMuted, endCall, setChats, updateMuteStatus, setRoomId, setReceiverDetails, updateVideoStatus, isOtherPersonVideoOn } = context;
  const navigate = useNavigate();
  const [isAudio, setIsAudio] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [stompClientChat, setStompClientChat] = useState(null);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isConnectionEstablished) {
      setUpConnectionForChats();
    }
    return () => {
      stompClientChat && stompClientChat.deactivate();
    }
  }, [isConnectionEstablished]);

  useEffect(() => {
    connectAgoraClient();
    return () => {
      if(client){
      client.leave();
      client.unpublish(localStream);
      localStream && localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    fetchProfileSource(receiverDetails.profilePhoto);
  }, [receiverDetails.profilePhoto]);

  const connectAgoraClient = async() => {
    const appId = "c1bdc9afcfc745c880375d19a2517658";
    const channelName = 'live';
    const token = null; // Set to null for testing, or generate a token for secure communication

    const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    agoraClient.init(appId, () => {
      console.log('Client initialized');
      agoraClient.join(token, channelName, null, async(uid) => {
        console.log('User ' + uid + ' has joined channel: ' + channelName);

        await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(async(stream) => {
          if (stream.getVideoTracks().length > 0) {
            console.log("Setting local Stream: ", stream);
            setLocalStream(stream);
            await agoraClient.publish(stream);
            console.log('Published local stream');
          } else {
            console.error('Error: No video tracks found in the stream');
          }
        }).catch((error) => {
          console.error('Error accessing user media:', error);
        });

      });
    });

     agoraClient.on('stream-added', async(evt) => {
       const remoteStream = evt.stream;
       console.log("Adding Remote Stream: ",remoteStream);
      await agoraClient.subscribe(remoteStream);
      console.log("Addedd!!");
      setRemoteStream(remoteStream);
      console.log('Subscribed remote stream');
    });

    agoraClient.on('stream-subscribed', async(evt) => {
      const remoteStream = evt.stream;
      await setRemoteStream(remoteStream);
      console.log('Received remote stream');
    });

    await setClient(agoraClient);
  }

  const fetchProfileSource = (image) => {
    if (image) {
      const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      const url = `data:${mimeType};base64,${image}`;
      setImageUrl(url);
    }
  };

  const setUpConnectionForChats = async () => {
    const url = `${process.env.REACT_APP_CALL_CHAT_SUBSCRIBE}/${roomId}`;
    const socket = new SockJS(`${process.env.REACT_APP_SOCKJS_URL}`);
    let sc = Stomp.over(socket);
    setStompClientChat(sc);
    const brokerUrl = process.env.REACT_APP_WEBSOCKET_URL;
    sc.configure({
      brokerURL: brokerUrl,
      onConnect: async () => {
        sc.subscribe(url, async (response) => {
          const receivedResponse = await JSON.parse(response.body);
          await setChats((prevChats) => [...prevChats, receivedResponse]);
        });
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
      },
    });
    sc.activate();
    setIsConnectionEstablished(true);
  }

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const initials = receiverDetails.firstName.charAt(0).toUpperCase() + receiverDetails.lastName.charAt(0).toUpperCase();

  const switchBetweenMuteAndUnMute = () => {
    if (isMuted) {
      updateMuteStatus(receiverDetails.id, "false").
        then(() => {
          setIsMuted(false);
        });
    } else {
      updateMuteStatus(receiverDetails.id, "true").
        then(() => {
          setIsMuted(true);
        });
    }
  };

  const endCallAndReturn = () => {
    endCallOnly(receiverDetails, user);
    console.log("Call ended!");
  };

  const endCallOnly = async (receiverDetails, user) => {
    const response = await endCall(user[0]?.id, receiverDetails.id);
    const data = await response.json();
    if (data.success) {
      await setRoomId("default");
      await setReceiverDetails({});
      setIsAudio(false);
      if(client){
        client.leave();
        client.unpublish(localStream);
        localStream && localStream.getTracks().forEach((track) => track.stop());
      }
      props.showAlert("Call ended successfully!", "success");
      navigate("/people");
    }
    else {
      props.showAlert(data.message, "danger");
    }
  };

  const startChatting = () => {
    setChatOpen(!isChatOpen);
  };

  const switchVideoStates = () => {
    if (isVideoOn) {
      updateVideoStatus(receiverDetails.id, "false").
        then(() => {
          setIsVideoOn(false);
        });
    } else {
      updateVideoStatus(receiverDetails.id, "true").
        then(() => {
          setIsVideoOn(true);
        });
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
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
        <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bolder' }}>
          {receiverDetails.firstName + " " + receiverDetails.lastName}
        </p>
        <p>
          {isOtherPersonMuted ? <p style={{ color: 'grey', fontSize: '24px', fontWeight: 'bolder' }}>
            Muted
          </p> : <></>}
        </p>
      </div>

      <div style={{ position: 'absolute', top: 20, left: 10, color: 'white', fontWeight: 'bolder' }}>
        Call Duration: {formatTime(callDuration)}
      </div>
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        {isAudio && localStream && !isMuted && (
          <audio
            ref={(audioRef) => {
              if (audioRef && audioRef.srcObject !== localStream) {
                audioRef.srcObject = localStream;
              }
            }}
            autoPlay
            controls
            hidden={true}
            style={{ width: '100%', maxWidth: '200px', marginBottom: '10px' }}
          />
        )}
        {isOtherPersonVideoOn ? (
            <>
          { client && localStream && <LocalVideo stream={localStream} muted={isMuted} />}
          {client && remoteStream && <RemoteVideo stream={remoteStream} />}
            </>
        ) :
          <div className="camera-off-message" style={{ color: 'white' }}>
            <p>The other person's camera is off</p>
          </div>
        }
        {isVideoOn ? (
          <Tooltip title='Turn Video off'>
            <IconButton className='mx-2' onClick={switchVideoStates} sx={
              {
                background: 'white'
              }
            }>
              <img src={videoOn} alt='videoOn' style={{ width: 50, height: 50 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Turn Video On'>
            <IconButton className='mx-2' onClick={switchVideoStates} sx={
              {
                background: 'white'
              }
            }>
              <img src={videoOff} alt='Video Off' style={{ width: 50, height: 50 }} />
            </IconButton>
          </Tooltip>
        )}
        {isMuted ?
          <Tooltip title='UnMute'>
            <IconButton className='mx-2' onClick={switchBetweenMuteAndUnMute} sx={
              {
                background: 'white'
              }
            }>
              <img src={muteMicIcon} alt='Mute Mic' style={{ width: 50, height: 50 }} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title='Mute'>
            <IconButton className='mx-2' onClick={switchBetweenMuteAndUnMute} sx={
              {
                background: 'white'
              }
            }>
              <img src={unMuteMicIcon} alt='UnMute Mic' style={{ width: 50, height: 50 }} />
            </IconButton>
          </Tooltip>
        }

        <Tooltip title='Open Chat Box'>
          <IconButton className='mx-2' onClick={startChatting} sx={
            {
              background: 'white'
            }
          }>
            <img src={chatIcon} alt='Chat' style={{ width: 50, height: 50 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title='End Call'>
          <IconButton className='mx-2' onClick={endCallAndReturn} sx={
            {
              background: 'white'
            }
          }>
            <img src={endCallIcon} alt='End call' style={{ width: 50, height: 50 }} />
          </IconButton>
        </Tooltip>
      </div>
      {isChatOpen && <CallChat />}
    </div>
  );
};


export default AcceptVideoCall;
