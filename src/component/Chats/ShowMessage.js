import React, { useContext, useEffect, useRef, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Avatar, Chip, Divider, Fade, IconButton, MenuItem, Paper, Slide, Tooltip } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import Popover from '@mui/material/Popover';
import userContext from '../../context/User/UserContext'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import StartAforwardChat from './ForwardMessageCards/StartAforwardChat';

const ShowMessage = (props) => {
    const { message, receiver, formatTime, newMsg, showAlert, performEditting } = props;
    const context = useContext(userContext);
    const { user, deleteMessageForever, canDeleteMsg, deleteMessage, setMessageId } = context;
    const [time, setTime] = useState("");
    const [showAnimation, setShowAnimation] = useState(true);
    const [canPerformOps, setCanPerformOps] = useState(true);
    const [isMessageVisible, setIsMessageVisible] = useState(true);

    useEffect(() => {
        convertAndFormatTime(message.timeStamp);
        setShowAnimation(true);
    }, [message]);

    useEffect(() => {
        checkIfYouCanDeleteMessage(message.chatId, message.messageId, message.senderId);
    }, [message]);

    const checkIfYouCanDeleteMessage = async (chatId, messageId, senderId) => {
        const response = await canDeleteMsg(chatId, messageId, senderId);
        const data = await response.json();
        if (data.success) {
            setCanPerformOps(false);
        }
        else {
            setCanPerformOps(true);
        }
    }

    const convertAndFormatTime = async (time) => {
        const newTime = checkCustomizedTimeformat(time);
        const sentTime = await formatTime(newTime);
        setTime(sentTime);
    };

    const checkCustomizedTimeformat = (timeString) => {
        if (Array.isArray(timeString)) {
            const isoDateString = new Date(
                Date.UTC(
                    timeString[0],
                    timeString[1] - 1,
                    timeString[2],
                    timeString[3] || 0,
                    timeString[4] || 0,
                    timeString[5] || 0,
                    (timeString[6] || 0) / 1000000
                )
            ).toISOString();

            return isoDateString;
        } else if (typeof timeString === "string") {
            return timeString;
        }
    };

    const isSender = message.senderId === user[0].id;
    const messageClass = isSender ? 'sender-message' : 'receiver-message';

    const EditMessage = async (e) => {
        e.close();
        await performEditting(message.messageId, message.content);
    };

    const DeleteMessage = async (e) => {
        e.close();
        const response = await deleteMessage(message.chatId, message.messageId, user[0]?.id);
        const data = await response.json();
        if (data.success) {
            setIsMessageVisible(false);
            showAlert(data.message, "success");
        }
        else {
            showAlert(data.message, "danger");
        }
    }

    const ForwardMessage = async (e) => {
        e.close();
        await setMessageId(message.messageId);
        openForwardModal.current.click();
    }

    const handleDeleteMessageForever = async (e) => {
        e.close();
        const response = await deleteMessageForever(message.chatId, message.messageId, message.senderId);
        const data = await response.json();
        if (data.success) {
            showAlert(data.message, "success");
        } else {
            showAlert(data.message, "danger");
        }
    }
    const openForwardModal = useRef(null);
    const closeForwardModel = useRef(null);

    return (
        <>
            <button  ref={openForwardModal} hidden type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#forwardMessageModal">
                Launch demo modal
            </button>
            
            {isMessageVisible ?
                <>
                    <div style={{ width: 1000 }} class="modal fade" id="forwardMessageModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content" style={{ width: 700 }}>
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLabel">Forward Message</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <Paper elevation={3} sx={{ height: 400, width: 650, overflow: "auto" }}>
                                        <StartAforwardChat closeChattingModal={closeForwardModel} />
                                    </Paper>
                                </div>
                                <div class="modal-footer">
                                    <button ref={closeForwardModel} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!newMsg ?
                        <>
                            <Slide in={showAnimation} direction="up" timeout={{ enter: 500, exit: 0 }}>
                                <div className={`message-box ${messageClass} my-1 mx-2`} style={{ position: 'relative' }}>
                                    {message.deletedForever ?
                                        <>
                                            {/* <div>
                                                {isSender ?
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>You</p> :
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>{`${receiver.firstName} ${receiver.lastName}`}</p>
                                                }
                                            </div>
                                            <br />
                                            <Divider style={{ width: '100%' }} /> */}
                                            <div className="message-content" style={{ fontStyle: 'italic', paddingRight: '30px' }}>
                                                {message.content}
                                            </div>
                                            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', alignItems: 'center' }}>
                                                <PopupState variant="popover" popupId="demo-popup-popover">
                                                    {(popupState) => (
                                                        <>
                                                            <Tooltip title='Open Options'>
                                                                <IconButton variant="contained" {...bindTrigger(popupState)}>
                                                                    <MoreVertRoundedIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Popover
                                                                {...bindPopover(popupState)}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'right',
                                                                }}
                                                            >
                                                                <MenuItem sx={{ cursor: "pointer" }} onClick={() => { DeleteMessage(popupState) }}>Delete Message</MenuItem>
                                                            </Popover>
                                                        </>
                                                    )}
                                                </PopupState>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* <div>
                                                {isSender ?
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>You</p> :
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>{`${receiver.firstName} ${receiver.lastName}`}</p>
                                                }
                                            </div>
                                            <br />
                                            <Divider style={{ width: '100%' }} /> */}
                                            <div className="message-content" style={{ paddingRight: '30px' }}>
                                                {message.content}
                                            </div>
                                            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', alignItems: 'center' }}>
                                                <PopupState variant="popover" popupId="demo-popup-popover">
                                                    {(popupState) => (
                                                        <>
                                                            <Tooltip title='Open Options'>
                                                                <IconButton variant="contained" {...bindTrigger(popupState)}>
                                                                    <MoreVertRoundedIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Popover
                                                                {...bindPopover(popupState)}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'right',
                                                                }}
                                                            >
                                                                {!isSender ?
                                                                    <>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { DeleteMessage(popupState) }}>Delete Message</MenuItem>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { ForwardMessage(popupState) }}>Forward Message</MenuItem>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <MenuItem disabled={canPerformOps} sx={{ cursor: "pointer" }} onClick={() => { EditMessage(popupState) }}>Edit Message</MenuItem>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { DeleteMessage(popupState) }}>Delete Message</MenuItem>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { ForwardMessage(popupState) }}>Forward Message</MenuItem>
                                                                        <Divider />
                                                                        <MenuItem disabled={canPerformOps} sx={{ cursor: "pointer" }} onClick={() => { handleDeleteMessageForever(popupState) }}>Delete Forever</MenuItem>
                                                                    </>}
                                                            </Popover>
                                                        </>
                                                    )}
                                                </PopupState>
                                            </div>
                                        </>
                                    }

                                </div>
                            </Slide>

                            {isSender ?
                                <div className='mx-2'>
                                    <Slide in={showAnimation} direction="up" timeout={{ enter: 500, exit: 0 }}>
                                        {
                                            message.edited ?
                                                <p style={{ alignItems: "right", display: "flex", justifyContent: "right", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip size='12px' color='success' label={"Forwarded"} sx={{ fontSize: 12 }}></Chip> : <></>} Edited &nbsp;<AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;
                                                    <TaskAltIcon sx={{ color: "blue",fontSize: 15 }} />
                                                </p>
                                                :
                                                <p style={{ alignItems: "right", display: "flex", justifyContent: "right", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip size = '12px' color='success' label={"Forwarded"} sx={{ fontSize: 12 }}></Chip> : <></>} <AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;<TaskAltIcon sx={{ color: "blue", fontSize: 15 }} />
                                                </p>
                                        }

                                    </Slide>
                                </div> :
                                <div className='mx-2'>
                                    <Slide in={showAnimation} direction="up" timeout={{ enter: 500, exit: 0 }}>
                                        {
                                            message.edited ?
                                                <p style={{ alignItems: "left", display: "flex", justifyContent: "left", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip size='12px' color='success' label={"Forwarded"} sx={{ fontSize: 12 }}></Chip>: <></>} Edited &nbsp; <AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;<TaskAltIcon sx={{ color: "blue", fontSize: 15 }} />
                                                </p>
                                                :
                                                <p style={{ alignItems: "left", display: "flex", justifyContent: "left", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip size='12px' color='success' label={"Forwarded"} sx={{ fontSize: 12 }}></Chip> : <></>} <AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;<TaskAltIcon sx={{ color: "blue", fontSize: 15 }} />
                                                </p>
                                        }
                                    </Slide>
                                </div>
                            }
                        </>
                        :
                        <>
                            <Fade in={showAnimation} timeout={100}>
                                <div className={`message-box ${messageClass} my-1 mx-2`} style={{ position: 'relative' }}>
                                    {message.deletedForever ?
                                        <>
                                            {/* <div>
                                                {isSender ?
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>You</p> :
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>{`${receiver.firstName} ${receiver.lastName}`}</p>
                                                }
                                            </div>
                                            <br />
                                            <Divider style={{ width: '100%' }} /> */}
                                            <div className="message-content" style={{ fontStyle: 'italic', paddingRight: '30px' }}>
                                                {message.content}
                                            </div>
                                            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', alignItems: 'center' }}>
                                                <PopupState variant="popover" popupId="demo-popup-popover">
                                                    {(popupState) => (
                                                        <>
                                                            <Tooltip title='Open Options'>
                                                                <IconButton variant="contained" {...bindTrigger(popupState)}>
                                                                    <MoreVertRoundedIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Popover
                                                                {...bindPopover(popupState)}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'right',
                                                                }}
                                                            >
                                                                <MenuItem sx={{ cursor: "pointer" }} onClick={() => { DeleteMessage(popupState) }}>Delete Message</MenuItem>
                                                            </Popover>
                                                        </>
                                                    )}
                                                </PopupState>
                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* <div>
                                                {isSender ?
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>You</p> :
                                                    <p style={{ marginLeft: 7, position: 'absolute', left: 0, color: 'purple' }}>{`${receiver.firstName} ${receiver.lastName}`}</p>
                                                }
                                            </div>
                                            <br />
                                            <Divider style={{ width: '100%' }} /> */}
                                            <div className="message-content" style={{ paddingRight: '30px' }}>
                                                {message.content}
                                            </div>
                                            <div style={{ position: 'absolute', top: '0', right: '0', display: 'flex', alignItems: 'center' }}>
                                                <PopupState variant="popover" popupId="demo-popup-popover">
                                                    {(popupState) => (
                                                        <>
                                                            <Tooltip title='Open Options'>
                                                                <IconButton variant="contained" {...bindTrigger(popupState)}>
                                                                    <MoreVertRoundedIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Popover
                                                                {...bindPopover(popupState)}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'right',
                                                                }}
                                                                transformOrigin={{
                                                                    vertical: 'top',
                                                                    horizontal: 'right',
                                                                }}
                                                            >
                                                                {!isSender ?
                                                                    <>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { DeleteMessage(popupState) }}>Delete Message</MenuItem>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { ForwardMessage(popupState) }}>Forward Message</MenuItem>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <MenuItem disabled={canPerformOps} sx={{ cursor: "pointer" }} onClick={() => { EditMessage(popupState) }}>Edit Message</MenuItem>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { DeleteMessage(popupState) }}>Delete Message</MenuItem>
                                                                        <MenuItem sx={{ cursor: "pointer" }} onClick={() => { ForwardMessage(popupState) }}>Forward Message</MenuItem>
                                                                        <Divider />
                                                                        <MenuItem disabled={canPerformOps} sx={{ cursor: "pointer" }} onClick={() => { handleDeleteMessageForever(popupState) }}>Delete Forever</MenuItem>
                                                                    </>}
                                                            </Popover>
                                                        </>
                                                    )}
                                                </PopupState>
                                            </div>
                                        </>}
                                </div>
                                {/* <Avatar >HM</Avatar> */}
                                
                            </Fade>

                            {isSender ?
                                <div className='mx-2'>
                                    <Fade in={showAnimation} timeout={100}>
                                        {
                                            message.edited ?
                                                <p style={{ alignItems: "right", display: "flex", justifyContent: "right", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip color='success' size='12px' label={"Forwarded"} sx={{ fontSize: 12 }}></Chip> : <></>} Edited &nbsp;<AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;<TaskAltIcon sx={{ color: "blue", fontSize: 15 }} />
                                                </p>
                                                :
                                                <p style={{ alignItems: "right", display: "flex", justifyContent: "right", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip color='success' size='12px' label={"Forwarded"} sx={{ fontSize: 12 }}></Chip> : <></>} <AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;<TaskAltIcon sx={{ color: "blue", fontSize: 15 }} />
                                                </p>
                                        }
                                    </Fade>
                                </div> :
                                <div className='mx-2'>
                                    <Fade in={showAnimation} timeout={100}>
                                        {
                                            message.edited ?
                                                <p style={{ alignItems: "left", display: "flex", justifyContent: "left", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip color='success' size='12px' label={"Forwarded"} sx={{fontSize:12}}></Chip> : <></>} Edited &nbsp; <AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;<TaskAltIcon sx={{ color: "blue", fontSize: 15 }} />
                                                </p>
                                                :
                                                <p style={{ alignItems: "left", display: "flex", justifyContent: "left", fontSize: 12 }}>
                                                    {message.forwarded ? <Chip color='success' size='12px' label={"Forwarded"} sx={{ fontSize: 12 }}></Chip> : <></>} <AccessTimeIcon sx={{ fontSize: 17 }} />{time}
                                                    &nbsp;<TaskAltIcon sx={{ color: "blue", fontSize: 15 }} />
                                                </p>
                                        }
                                    </Fade>
                                </div>
                            }
                        </>
                    }
                </> : <></>
            }
        </>
    );
};

export default ShowMessage;