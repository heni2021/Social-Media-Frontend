import React, { useContext, useEffect, useState } from 'react';
import userContext from '../../context/User/UserContext';
import { useNavigate } from 'react-router-dom';
import endCallIcon from '../../Photos/endCallIcon.jpg';
import unMuteMicIcon from '../../Photos/unmuteMic.png';
import muteMicIcon from '../../Photos/muteMic.png';
import chatIcon from '../../Photos/chatIcon.png';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import CallChat from './CallChat';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './motion.css';

const AcceptVoiceCall = (props) => {
  const context = useContext(userContext);
  const { roomId, endVoiceCall, receiverDetails, setRoomId, setReceiverDetails, user, setChats, isOtherPersonMuted, updateMuteStatus,chats } = context;
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPermissionGranted, setIsAudioPermissionGranted] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);
  const [userId, setUserID] = useState("");
  const [peerConnection, setPeerConnection] = useState(null); // State to store peer connection
  const [localStream, setLocalStream] = useState(null);
  const [stompClient, setStompClient] = useState(null);
  const [stompClientChat, setStompClientChat] = useState(null);
  const [callDuration, setCallDuration] = useState(0); // State to store call duration in seconds

  useEffect(() => {
    fetchProfileSource(receiverDetails.profilePhoto);
  }, [receiverDetails.profilePhoto]);

  useEffect(() => {
    if (!isConnectionEstablished) {
      setUpConnectionForChats();
    }
    return () => {
      stompClientChat && stompClientChat.deactivate();
    }
  }, [isConnectionEstablished]);

  useEffect(() => {
    requestAudioPermission();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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


  const createPeerConnection = async (stream) => {
    const socket = new SockJS(`${process.env.REACT_APP_SOCKJS_URL}`);
    let sc = Stomp.over(socket);
    setStompClient(sc);
    const brokerUrl = process.env.REACT_APP_WEBSOCKET_URL;
    sc.configure({
      brokerURL: brokerUrl,
      onConnect: async () => {
        var url = '/topic/signaling';
        sc.subscribe(url, async (response) => {
          const msg = JSON.parse(response.body);

          if (msg.type === 'offer') {
            await handleOffer(msg);
          } else if (msg.type === 'answer') {
            console.log("setting answer: ", msg.data);
            // Set the remote description
            await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.data));
          } else if (msg.type === 'candidate') {
            // Add ICE candidate
            console.log("Setting ICE Candidate: ", msg.data);
            await peerConnection.addIceCandidate(new RTCIceCandidate(msg.data));
          }
        });
        const peerConnection = new RTCPeerConnection();

        // Add the stream to the peer connection
        await stream.getTracks().forEach(track => {
          peerConnection.addTrack(track, stream);
        });

        // Create an offer
        await peerConnection.createOffer().then(offer => {
          peerConnection.setLocalDescription(offer);

          // Send the offer to the server
          const message = {
            type: 'offer',
            sender: user[0]?.id,
            receiver: receiverDetails.id,
            data: offer,
          };
          sc.publish({ destination: '/app/send', body: JSON.stringify(message) });
        });

        // Store the peer connection
        setPeerConnection(peerConnection);
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
      },
    });
    await sc.activate();
  };


  const fetchProfileSource = (image) => {
    if (image) {
      const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      const url = `data:${mimeType};base64,${image}`;
      setImageUrl(url);
    }
  };

  const requestAudioPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsAudioPermissionGranted(true);
      setLocalStream(stream);
      createPeerConnection(stream);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsAudioPermissionGranted(false);
    }
  };

  const handleOffer = async (offer) => {
    // Replace with your signaling server URL

    const peerConnection = new RTCPeerConnection();

    await localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // Create an answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    const message = {
      type: 'answer',
      sender: user[0]?.id,
      receiver: receiverDetails.id,
      data: answer,
    };
    console.log("Offer Received Sending answer: ", message);
    stompClient.publish({ destination: '/app/send', body: JSON.stringify(message) });

    setPeerConnection(peerConnection);
  };

  // Function to end the call
  const endCallAndReturn = () => {
    endCall(receiverDetails, user, roomId);
  };

  const endCall = async (receiver, caller, roomId) => {
    const response = await endVoiceCall(caller[0]?.id, receiver.id, roomId);
    const data = await response.json();
    if (data.success) {
      await setRoomId("default");
      await setReceiverDetails({});
      await setChats([]);
      stompClientChat && stompClientChat.deactivate();
      stompClient && stompClient.deactivate();
      setIsAudioPermissionGranted(false);
      props.showAlert("Call Ended Successfully...", "success");
      navigate("/people");
    } else {
      props.showAlert(data.message, "danger");
    }
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


  const startChatting = () => {
    setChatOpen(!isChatOpen);
  };

  // Function to format seconds to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
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
        <p>
          {isOtherPersonMuted? <p style={{color: 'grey', fontSize: '24px', fontWeight: 'bolder'}}>
            Muted
          </p> : <></>}
        </p>
      </div>

      <div style={{ position: 'absolute', top: 20, left: 10, color: 'black', fontWeight: 'bolder' }}>
        Call Duration: {formatTime(callDuration)}
      </div>

      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        {isAudioPermissionGranted && localStream && !isMuted && (
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

        {isAudioPermissionGranted && (
          <>
            {isMuted ?
              <Tooltip title='UnMute'>
                <IconButton onClick={switchBetweenMuteAndUnMute}>
                  <img src={muteMicIcon} alt='Mute Mic' style={{ width: 50, height: 50 }} />
                </IconButton>
              </Tooltip>
              :
              <Tooltip title='Mute'>
                <IconButton onClick={switchBetweenMuteAndUnMute}>
                  <img src={unMuteMicIcon} alt='UnMute Mic' style={{ width: 50, height: 50 }} />
                </IconButton>
              </Tooltip>
            }
          </>
        )}

        {/* Chat and end call buttons */}
        <Tooltip title='Open Chat Box'>
          <IconButton onClick={startChatting}>
            <img src={chatIcon} alt='Chat' style={{ width: 50, height: 50 }} />
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