import React, { useContext, useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChatIcon from '@mui/icons-material/Chat';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VideocamIcon from '@mui/icons-material/Videocam';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from 'react-router-dom';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import userContext from '../../context/User/UserContext';

export default function UserDetailCard(props) {
    const status = props.status.toLowerCase();
    const userProfile = props.profile;
    const initials = props.firstName.charAt(0).toUpperCase() + props.lastName.charAt(0).toUpperCase();
    const [creationTime, setCreationTime] = useState("");
    const [imageUrl, setImageUrl] = useState(null);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const context = useContext(userContext);
    const { convertTime, user, setChatId } = context;

    const showProfile = () => {
        localStorage.setItem('userId', props.userId);
        localStorage.setItem('previousLink', '/people');
        navigate('/viewProfile');
    };

    useEffect(() => {
        const formatTime = async (time) => {
            try {
                const response = await convertTime(time);
                const data = await response.text();
                setCreationTime(data);
            } catch (error) {
                console.error('Error converting time:', error);
                setCreationTime("Error");
            }
        }

        formatTime(props.time);
    }, [props.userId, props.convertTime, props.firstName]);
    useEffect(() => {
        fetchProfilePhoto();
    }, [props.userId]);

    useEffect(() => {
        if (profile !== null) {
            fetchProfileSource(profile);
        }
    }, [profile]);
    const fetchProfilePhoto = () => {
        setProfile(userProfile);
    }
    const fetchProfileSource = (image) => {
        if (image) {
            const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
            const url = `data:${mimeType};base64,${image}`;
            setImageUrl(url);
        } else {
            console.error("Image is undefined");
        }
    }

    const openChatSettings = () => {
        generateChatId(props.userId, user[0]?.id);
        navigate("/viewChats");
    }
    const generateChatId = (receiverId, senderId) => {
        const sortedIds = [receiverId, senderId].sort();
        const id = sortedIds.join('_');
        setChatId(id);
    }

    return (
        <div className='col-md-3 my-2 mx-3'>
            <Card sx={{ width: 280, height: 200, display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                    avatar={
                        imageUrl === null ?
                            <>
                                <Avatar sx={{ backgroundColor: "lightblue", color: "black", position: "relative" }} aria-label="recipe">
                                    {initials}
                                    {status === "online" ?
                                        <>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                top: '26.5px',
                                                left: '26px',
                                                width: '11.5px',
                                                height: '11.5px',
                                                borderRadius: '50%',
                                                backgroundColor: "green",
                                                border: '2px solid white',
                                            }} />
                                        </>
                                        :
                                        <>
                                        </>}
                                </Avatar>
                            </>
                            :
                            <Avatar sx={{ position: "relative" }} aria-label="recipe" >
                                <img
                                    src={imageUrl}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                />
                                {status === "online" ?
                                    <>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            top: '26.5px',
                                            left: '26px',
                                            width: '11.5px',
                                            height: '11.5px',
                                            borderRadius: '50%',
                                            backgroundColor: "green",
                                            border: '2px solid white',
                                        }} />
                                    </>
                                    :
                                    <>
                                    </>}
                            </Avatar>
                    }
                    title={`${props.firstName} ${props.lastName}`}
                    subheader={`Joined: ${creationTime}`}
                />

                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {<><LocalOfferRoundedIcon/> {props.tagLine}</>}
                    </Typography>
                </CardContent>
                <div style={{ marginTop: 'auto' }}>
                    <CardActions disableSpacing>
                        <Tooltip title="Add a friend">
                            <IconButton aria-label="add friend" onClick={() => props.sendFriendRequest(props.userId)}>
                                <PersonAddIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Start a chat">
                            <IconButton aria-label="chat" onClick={openChatSettings}>
                                <ChatIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Start a video call">
                            <IconButton aria-label="video call">
                                <VideocamIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Profile">
                            <IconButton onClick={showProfile} aria-label='view profile'>
                                <VisibilityRoundedIcon />
                            </IconButton>
                        </Tooltip>
                    </CardActions>
                </div>
            </Card>
        </div>
    );
}
