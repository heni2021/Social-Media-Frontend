import React, { useContext, useState } from 'react';
import endCallIcon from '../../Photos/endCallIcon.jpg';
import { IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userContext from '../../context/User/UserContext';

const VideoCall = () => {
    const navigate = useNavigate();
    const context = useContext(userContext);
    const { roomId, endCall, user } = context;

    const [receiverId, setReceiverId] = useState("");

    const endCallAndReturn = () => {
        // endCallOnly(roomId);
        navigate("/people");
    }

    // const endCallOnly= async(roomId)=>{
    //     fetchReceiverIdFromRoomId(roomId);
    //     const response = await endCall(user[0]?.id, receiverId);
    // }

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
            <p style={{ color: 'white', fontSize: '24px', fontWeight: 'bolder', textAlign: 'center' }}>
                Calling {localStorage.getItem("Name")}...
            </p>
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
