import React, { useContext, useEffect, useState } from 'react';
import endCallIcon from '../../Photos/endCallIcon.jpg';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userContext from '../../context/User/UserContext';

const VideoCall = (props) => {
    const navigate = useNavigate();
    const context = useContext(userContext);
    const { setReceiverDetails, endCall, user, receiverDetails, setRoomId } = context;

    const [isVideoPermissionGranted, setIsVideoPermissionGranted] = useState(false);
    const [localStream, setLocalStream] = useState(null);

    useEffect(() => {
        if (!isVideoPermissionGranted) {
            requestVideoPermission();
        }
    }, [isVideoPermissionGranted]);

    useEffect(() => {
        if (localStream) {
            const videoElement = document.getElementById('localVideo');
            if (videoElement) {
                videoElement.srcObject = localStream;
            }
        }
    }, [localStream]);

    const endCallAndReturn = () => {
        endCallOnly(receiverDetails, user);
        console.log("Call ended!");
    }

    const endCallOnly = async (receiverDetails, user) => {
        const response = await endCall(user[0]?.id, receiverDetails.id);
        const data = await response.json();
        if (data.success) {
            await setRoomId("default");
            await setReceiverDetails({});
            props.showAlert("Call ended successfully!", "success");
            navigate("/people");
        } else {
            props.showAlert(data.message, "danger");
        }
    }

    const requestVideoPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true});
            setIsVideoPermissionGranted(true);
            setLocalStream(stream);
            console.log("Video permission granted!");
        } catch (error) {
            setIsVideoPermissionGranted(false);
            console.error("Error accessing video:", error);
            props.showAlert("Error accessing video. Please check your camera permissions.", "danger");
        }
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white', // White background
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {isVideoPermissionGranted && localStream &&
                <video id="localVideo" autoPlay playsInline style={{ width: '100%', height: 'auto', backgroundColor: 'black' }}></video>
            }
            <div style={{
                position: 'absolute',
                top: 0, // Adjust as needed for vertical spacing from the top
                width: '100%',
                textAlign: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)', // Light black transparent background
                padding: '20px',
                borderRadius: '10px',
            }}>
                <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bolder' }}>
                    Calling {localStorage.getItem("Name")}...
                </p>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
                <Tooltip title='End Call'>
                    <IconButton onClick={endCallAndReturn}>
                        <img src={endCallIcon} alt='End call' style={{ width: 70, height: 70 }} />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    );
};

export default VideoCall;