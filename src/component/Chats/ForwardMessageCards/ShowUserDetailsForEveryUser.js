import { Avatar, Card, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import userContext from '../../../context/User/UserContext'

const ShowUserDetailsForEveryUser = (props) => {
    const { userDetail, closeChattingModal } = props;
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(null);
    const [previousChatId, setPreviousChatId] = useState("");
    const [sender, setSender] = useState({});

    const context = useContext(userContext);
    const { user, setChatId, forwardMsg, chatId , messageId} = context;

    useEffect(() => {
        fetchProfileSource(userDetail.profilePhoto);
        setSender(user[0]?.id);
        setPreviousChatId(chatId);
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

    const generateChatId = async(receiverId, senderId) => {  
        const sortedIds = [receiverId, senderId].sort();
        const id = sortedIds.join('_');
        await setChatId(id);
        forwardMessage(id, previousChatId, messageId, user[0]?.id);
    }

    const forwardMessage = async (chatId, previousChatId, messageId, id) => {
        const response = await forwardMsg(chatId, previousChatId, messageId, id);
        const data = await response.json();
        if (data.success) {
            if (closeChattingModal !== null && closeChattingModal.current !== null) {
                closeChattingModal.current.click();
            }
            navigate("/viewChats");
        }
        else {
            await setChatId(previousChatId);
            if (closeChattingModal !== null && closeChattingModal.current !== null) {
                closeChattingModal.current.click();
            }

            navigate("/viewChats");

        }
    }
    const startChatWindow = (event) => {
        event.stopPropagation();
        console.log(userDetail);
        closeChattingModal.current.click();
        if (userDetail.id !== user[0]?.id) {
            generateChatId(userDetail.id, user[0]?.id);
        }
        else {
            if (closeChattingModal !== null && closeChattingModal.current !== null) {
                closeChattingModal.current.click();
            }

            navigate("/accountDetails");
        }
    }

    return (
        <div className='my-3 mx-3'>
            <Card sx={{ width: 590, cursor: "pointer" }} onClick={startChatWindow}>
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
                                // action={userDetail.id !== user[0]?.id &&
                                //     <Tooltip title='Start Chatting'>
                                //         <IconButton onClick={startChatWindow} sx={{ marginRight: 1, marginTop: 2 }} >
                                //             <ChatIcon />
                                //         </IconButton>
                                //     </Tooltip>
                                // }
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

export default ShowUserDetailsForEveryUser
