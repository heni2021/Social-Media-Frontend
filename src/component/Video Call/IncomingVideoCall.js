import React, { useContext, useEffect, useState } from 'react'
import userContext from '../../context/User/UserContext'
import endCallIcon from '../../Photos/endCallIcon.jpg';
import receiveCallIcon from '../../Photos/receiveCall.png';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Voice Call/motion.css';

const IncomingVideoCall = (props) => {

    const navigate = useNavigate();
    const context = useContext(userContext);
    const { endCall, user, receiverDetails, roomId, setRoomId, setReceiverDetails, answerCall, setChats, stompClient, chats } = context;

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        fetchProfileSource(receiverDetails.profilePhoto);
    }, [receiverDetails.profilePhoto]);

    useEffect(() => {
        requestVideoPermission();
    },[]);
    const endCallAndReturn = () => {
        endCallOnly(receiverDetails, user);
        console.log("Call ended!");
    }

    const requestVideoPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            console.log("Video permission granted!");
        } catch (error) {
            // setIsVideoPermissionGranted(false);
            console.error("Error accessing video:", error);
            props.showAlert("Error accessing video. Please check your camera permissions.", "danger");
        }
    }


    const endCallOnly = async (receiverDetails, user) => {
        const response = await endCall(user[0]?.id, receiverDetails.id);
        const data = await response.json();
        if (data.success) {
            await setRoomId("default");
            await setReceiverDetails({});
            props.showAlert("Call ended successfully!", "success");
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
        receiveVideoCall(user[0]?.id, roomId);
    }

    const receiveVideoCall = async (userId, roomId) => {
        const response = await answerCall(userId, roomId);
        const data = await response.json();
        if (data.success) {
            navigate(`/video/call/receive`);
        }
        else {
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
            </div>
            <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light black background
                padding: '20px',
                borderRadius: '10px',
            }}>
                <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bolder', display: 'inline-block' }}>
                    {receiverDetails.firstName + " " + receiverDetails.lastName} is Calling &nbsp;
                </p>
                <p className='calling-text' style={{ color: 'white', fontSize: '24px', fontWeight: 'bolder', display: 'inline-block', margin: 0 }}>
                     ...
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

export default IncomingVideoCall
