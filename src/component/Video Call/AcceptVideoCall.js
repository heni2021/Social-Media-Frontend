import React, { useContext, useEffect, useState } from 'react';
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
import './AcceptVideoCall.css'; // Import the CSS file with the styles

const AcceptVideoCall = (props) => {
  const context = useContext(userContext);
  const { receiverDetails, user, roomId, isOtherPersonMuted, endCall, setChats, updateMuteStatus, setRoomId, setReceiverDetails, updateVideoStatus, isOtherPersonVideoOn } = context;
  const navigate = useNavigate();
  const [isAudio, setIsAudio] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [stompClientChat, setStompClientChat] = useState(null);
  const [isChatOpen, setChatOpen] = useState(false);
  const[isVideoOn , setIsVideoOn] = useState(true);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isConnectionEstablished, setIsConnectionEstablished] = useState(false);
  const [remoteStream, setRemoteStream] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!isAudio) {
      requestAudioVideoPermission();
    }
  }, []);

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
    if (isAudio && localStream) {
      createPeerConnection();
    }
  }, [isAudio, localStream]);

  useEffect(() => {
    if (remoteStream) {
      const videoElement = document.getElementById('remoteVideo');
      if (videoElement) {
        videoElement.srcObject = remoteStream;
      }
    }
  }, [remoteStream]);

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

  useEffect(() => {
    fetchProfileSource(receiverDetails.profilePhoto);
  }, [receiverDetails.profilePhoto]);

  const fetchProfileSource = (image) => {
    if (image) {
      const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      const url = `data:${mimeType};base64,${image}`;
      setImageUrl(url);
    }
  };

  // Inside useEffect for requesting audio and video permissions
  const requestAudioVideoPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      console.log("Accessed media devices:", stream);
      setIsAudio(true);
      setLocalStream(stream);
    } catch (error) {
      setIsAudio(false);
      console.error("Error accessing media devices:", error);
      props.showAlert("Error accessing media devices. Please check your camera and microphone permissions.", "danger");
    }
  };

  // Inside createPeerConnection function
  const createPeerConnection = async () => {
    const socket = new SockJS(`${process.env.REACT_APP_SOCKJS_URL}`);
    let sc = Stomp.over(socket);
    setStompClient(sc);
    const brokerUrl = process.env.REACT_APP_WEBSOCKET_URL;
    sc.configure({
      brokerURL: brokerUrl,
      onConnect: async () => {
        console.log("WebSocket connected successfully.");
        var url = '/topic/signaling';
        sc.subscribe(url, async (response) => {
          const msg = JSON.parse(response.body);
          if (msg.type === 'offer') {
            await handleOffer(msg);
          } else if (msg.type === 'answer') {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(msg.data));
          } else if (msg.type === 'candidate') {
            await peerConnection.addIceCandidate(new RTCIceCandidate(msg.data));
          }
        });
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.ontrack = (event) => {
          // console.log("Received remote track:", event.track);
          // const remoteStream = new MediaStream();
          // remoteStream.addTrack(event.track);
          setRemoteStream(event.streams[0]);
        };

        if (localStream) {
          console.log("Adding local tracks to peer connection:", localStream.getTracks());
          localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
          });
        } else {
          console.warn("Local stream is not available.");
        }

        await peerConnection.createOffer().then(offer => {
          peerConnection.setLocalDescription(offer);
          const message = {
            type: 'offer',
            sender: user[0]?.id,
            receiver: receiverDetails.id,
            data: offer,
          };
          sc.publish({ destination: '/app/send', body: JSON.stringify(message) });
        });

        setPeerConnection(peerConnection);

        // Setup onicecandidate event after peer connection is initialized
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            const message = {
              type: 'candidate',
              sender: user[0]?.id,
              receiver: receiverDetails.id,
              data: event.candidate,
            };
            sc.publish({ destination: '/app/send', body: JSON.stringify(message) });
          }
        };
      },
      onStompError: (error) => {
        console.error('WebSocket error:', error);
      },
    });
    sc.activate();
    setIsConnectionEstablished(true);
  };


  const handleOffer = async (offer) => {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        const message = {
          type: 'candidate',
          sender: user[0]?.id,
          receiver: receiverDetails.id,
          data: event.candidate,
        };
        stompClient.publish({ destination: '/app/send', body: JSON.stringify(message) });
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteStream = new MediaStream();
      remoteStream.addTrack(event.track);
      setRemoteStream(remoteStream);
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer.data));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    const message = {
      type: 'answer',
      sender: user[0]?.id,
      receiver: receiverDetails.id,
      data: answer,
    };
    stompClient.publish({ destination: '/app/send', body: JSON.stringify(message) });
    setPeerConnection(peerConnection);
  };


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
      await setIsAudio(false);
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

  useEffect(() => {
    if (remoteStream) {
      const videoElement = document.getElementById('remoteVideo');
      if (videoElement) {
        videoElement.srcObject = remoteStream;
      }
    }
  }, [remoteStream]);

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
        {isOtherPersonVideoOn? remoteStream && (
          <video id="remoteVideo" autoPlay playsInline className="video"></video>
        ) : 
        <div className="camera-off-message" style={{color:'white'}}>
          <p>The other person's camera is off</p>
        </div>
        }
        {/* {console.log("PERMISSION: ", isAudio)} */}
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

        {/* Chat and end call buttons */}
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
}

export default AcceptVideoCall;
