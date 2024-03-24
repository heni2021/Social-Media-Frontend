import { Avatar, Badge, Card, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Tooltip } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import FaceIcon from '@mui/icons-material/Face';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import userContext from '../../context/User/UserContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { Face } from '@mui/icons-material';

const ChatPersonalDetailCard = (props) => {
    const { users, chat, showAlert } = props;
    const context = useContext(userContext);
    const { user, setChatId, deleteChat, chatId, countUnreadMsg } = context;
    const [imageUrl, setImageUrl] = useState(null);
    const [showChatCard, setShowChatCard] = useState(true);
    const [unreadCount, setUnreadCount ] = useState("0");
    const initials = users.firstName.charAt(0).toUpperCase() + users.lastName.charAt(0).toUpperCase();
    const status = users.status.toLowerCase();

    useEffect(() => {
        fetchProfileSource(users.profile);
    }, [users, users.profile]);

    useEffect(() => {
        findChatIDForCount();
    },[users]);

    const findChatIDForCount = async() => {
        const sortedIds = [users.id, user[0]?.id].sort();
        const id = sortedIds.join('_');
        const response = await countUnreadMsg(id, user[0]?.id);
        const data = await response.json();
        if(data.success){
            setUnreadCount(data.message);
        }
        else{
            showAlert(data.message, "danger");
        }
    }

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
    }

    const navigate = useNavigate();
    const openChatInterface = () => {
        generateChatId(users.id, user[0]?.id);
        navigate("/viewChats");
    }

    const deleteAChat = async () => {
        generateChatId(users.id, user[0]?.id);
        console.log(chatId);
        const response = await deleteChat(chatId, user[0]?.id);
        const data = await response.json();
        if (data.success) {
            // setShowChatCard(false);
            navigate("/goToChat");
            showAlert(data.message, "success");
        }
        else {
            showAlert(data.message, "danger");
        }
        refCloseDeleteModal.current.click();
    }

    const refCloseDeleteModal = useRef(null);
    const deleteRefOpen = useRef(null);

    const openDeleteChatModal = (event)=> {
        event.stopPropagation();
        deleteRefOpen.current.click();
    }

    return (
        <div className='my-3'>
            <div className="modal fade" id="deleteAccountConfirmationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Chats?</h5>
                        </div>
                        <div className="modal-body text-center">
                            <p className='text-center' style={{ color: "red" }}>Are you sure you want to delete chats?</p>
                            <p className='text-center' style={{ color: "grey" }}>This action can't be undone!</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={deleteAChat}>Yes</button>
                            <button ref={refCloseDeleteModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>
            {showChatCard ?
                <div>
                    <Card sx={{ minWidth: "1020px", cursor: "pointer" }} onClick={openChatInterface} >
                        <CardContent>
                            <Grid container alignItems="center">
                                <Grid item xs={10}>
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
                                                                    top: '45px',
                                                                    left: '43px',
                                                                    width: '20px',
                                                                    height: '20px',
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
                                                                top: '45px',
                                                                left: '43px',
                                                                width: '20px',
                                                                height: '20px',
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
                                        title={
                                            <>

                                                {   unreadCount!=='0'? 
                                                    <Tooltip title="Unread Messages">
                                                <Badge badgeContent={unreadCount} color="secondary">
                                                <h5 style={{ fontSize: 25 }}>{users.firstName + " " + users.lastName} <Chip sx={{ backgroundColor: "lightgreen" }} icon={
                                                <FaceIcon />
                                                } label={users.userName} /></h5>
                                                </Badge>
                                                </Tooltip>
                                                :
                                                    // :<Badge badgeContent={unreadCount} color="secondary">
                                                <h5 style={{ fontSize: 25 }}>{users.firstName + " " + users.lastName} <Chip sx={{ backgroundColor: "lightgreen" }} icon={
                                                <FaceIcon />
                                                } label={users.userName} /></h5>
                                                // </Badge>
                                                }
                                            </>
                                        }
                                        subheader={chat.content}
                                    />
                                </Grid>
                                <Grid xs={2}>
                                    <CardActions>
                                        <Tooltip title="Delete Chats">
                                            <IconButton aria-label='delete chats' onClick={openDeleteChatModal}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {/* {unreadCount !== '0' &&
                                            <Grid item xs={2}>
                                                <CardActions>
                                                    <Tooltip title="Unread Messages">
                                                            <FaceIcon />

                                                        </Badge>
                                                    </Tooltip>
                                                </CardActions>
                                            </Grid>
                                        } */}
                                    </CardActions>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </div >
                :
                <></>}

            <button hidden={true} ref={deleteRefOpen} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteAccountConfirmationModal">
                Launch demo modal
            </button>
        </div>
    )
}

export default ChatPersonalDetailCard
