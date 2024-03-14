import { Avatar, Card, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import userContext from '../../context/User/UserContext'
import ChatIcon from '@mui/icons-material/Chat';

const ShowUsersDetailsCard = (props) => {
    const { userDetail, closeChattingModal } = props;
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);

    const context = useContext(userContext);
    const { user, setChatId } = context;

    useEffect(() => {
        fetchProfileSource(userDetail.profilePhoto);
    }, [userDetail]);
    const status = userDetail.status.toLowerCase();
    const initials = userDetail.firstName.charAt(0).toUpperCase() + userDetail.lastName.charAt(0).toUpperCase();

    const fetchProfileSource = (image) => {
        if (image) {
            const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
            const url = `data:${mimeType};base64,${image}`;
            setImageUrl(url);
        }
    }

    const openViewUserInterface = () => {
        if (closeChattingModal) {
            closeChattingModal.current.click();
            localStorage.setItem("previousLink", "/viewChats");
        }
        else {
            localStorage.setItem("previousLink", "/search");
        }
        if (userDetail.id === user[0]?.id) {
            navigate("/accountDetails");
        }
        else {
            localStorage.setItem("userId", userDetail.id);
            navigate("/viewProfile")
        }
    }
    const generateChatId = (receiverId, senderId) => {
        const sortedIds = [receiverId, senderId].sort();
        const id = sortedIds.join('_');
        setChatId(id);
    }

    const startChatWindow = (event) => {
        event.stopPropagation();
        generateChatId(userDetail.id, user[0]?.id);
        if (closeChattingModal) {
            closeChattingModal.current.click();
        }
        navigate("/viewChats");
    }

    return (
        <div className='my-3 mx-3'>
            <Card sx={{ width: 590, cursor: "pointer" }} onClick={openViewUserInterface}>
                <CardContent>
                    <Grid container alignItems="center">
                        <Grid item xs={10}>
                            <CardHeader
                                avatar={
                                    imageUrl === null ?
                                        <Avatar sx={{ backgroundColor: "lightblue", color: "black", position: "relative", width: 60, height: 60, fontSize: 30 }} aria-label="recipe">
                                            {initials}
                                            {status === "online" &&
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    top: '37px',
                                                    left: '37px',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    backgroundColor: "green",
                                                    border: '2px solid white',
                                                }} />
                                            }
                                        </Avatar>
                                        :
                                        <Avatar sx={{ position: "relative", width: 60, height: 60, fontSize: 30 }} aria-label="recipe" >
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
                                            {status === "online" &&
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    right: 0,
                                                    top: '37px',
                                                    left: '37px',
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    backgroundColor: "green",
                                                    border: '2px solid white',
                                                }} />
                                            }
                                        </Avatar>
                                }
                                action={userDetail.id !== user[0]?.id &&
                                    <Tooltip title='Start Chatting'>
                                        <IconButton onClick={startChatWindow} sx={{ marginRight: 1, marginTop: 2}} >
                                            <ChatIcon/>
                                        </IconButton>
                                    </Tooltip>
                                }
                                title={
                                    <h5 style={{ fontSize: 20 }}>
                                        {userDetail.firstName + " " + userDetail.lastName}
                                        <Chip sx={{ backgroundColor: "lightgreen" }} icon={<FaceIcon />} label={userDetail.userName} />
                                    </h5>
                                }
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowUsersDetailsCard;
