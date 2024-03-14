import React, { useContext, useEffect, useRef } from 'react';
import BottomNavigationBar from '../BottomNavigation';
import ChatDetailCard from './ChatDetailCard';
import { useState } from 'react';
import userContext from '../../context/User/UserContext';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, LinearProgress, Paper, Tooltip } from '@mui/material';
import chatIcon from '../../Photos/chat.png';
import StartAChatComponent from './StartAChatComponent';

const Chat = (props) => {
    const { setProgress, progress, showProgress } = props;
    const context = useContext(userContext);
    const { getChats, user, fetchUserDetails } = context;
    const [chats, setChats] = useState([]);
    const [chatUserDetail, setChatUserDetail] = useState([]);

    useEffect(() => {
        setProgress(10);
        fetchAllData();
    }, [user]);

    useEffect(() => {
        setProgress(60);
        fetchDataFromChats();
        setProgress(100);
    }, [chats]);

    const fetchAllData = async () => {
        console.log("Fetching chats data");
        fetchChatsData()
        setProgress(60);
    }

    const fetchData = async (id) => {
        try {
            const userDetailPromise = await fetchUserDetails(id);
            const userDetail = await userDetailPromise.json();
            return userDetail;
        } catch (error) {
            console.error('An error occurred during fetchData:', error);
        }
    };


    const fetchChatsData = async () => {
        try {
            const response = await getChats(user[0]?.id);
            setProgress(30);
            const data = await response.json();
            setProgress(50);
            setChats(data);
        } catch (error) {
            console.error('An error occurred during fetchChats:', error);
        }
    };

    const fetchDataFromChats = async () => {
        try {
            const userDetailPromises = chats.map((chat) =>
                fetchData(chat.senderId === user[0]?.id ? chat.receiverId : chat.senderId)
            );
            const userDetails = await Promise.all(userDetailPromises);
            const combinedData = userDetails.map((userDetail, index) => ({
                userCredentials: {
                    userName: userDetail.userName,
                    firstName: userDetail.firstName,
                    lastName: userDetail.lastName,
                    tagLine: userDetail.tagLine,
                    status: userDetail.status,
                    id: userDetail.id,
                    profile: userDetail.profilePhoto,
                },
                chatDetails: {
                    time: chats[index].timeStamp,
                    content: chats[index].content,
                    chatId: chats[index].chatId,
                    receiverId: chats[index].receiverId,
                },
            }));
            setChatUserDetail(combinedData);
        } catch (error) {
            console.error('An error occurred during fetchUserDetailsFromChats:', error);
        }
    };

    const navigate = useNavigate();
    const goToPeople = () => {
        navigate('/people');
    };

    const openStartChatModal = useRef(null);
    const closeChattingModal = useRef(null);
    const openModal = (e) =>{
        e.stopPropagation();
        openStartChatModal.current.click();
    }

    return (
        <>
            <BottomNavigationBar showAlert={props.showAlert} value={'chat'} />
            <button ref={openStartChatModal} hidden type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#startAChatModal">
                Launch demo modal
            </button>

            <div style={{width: 1000}}class="modal fade" id="startAChatModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content" style={{width: 700}}>
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Start Chatting .... </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <Paper elevation={3} sx={{height: 400, width: 650, overflow: "auto"}}>
                                <StartAChatComponent closeChattingModal={closeChattingModal} />
                            </Paper>
                        </div>
                        <div class="modal-footer">
                            <button hidden ref = {closeChattingModal} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                        </div>
                    </div>
                </div>
            </div>
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: 'red' }} />}
            {!showProgress && chats.length === 0 ? (
                <div className="text-center">
                    <p style={{ color: 'grey', marginTop: 200 }}>Start Chatting with People!</p>
                    <Button variant="outlined" color="primary" endIcon={<ArrowCircleRightRoundedIcon />} onClick={goToPeople}>
                        Find New Friends
                    </Button>
                    <div style={{ position: "absolute", bottom: 20, right: 20 }}>
                        <Tooltip title='Start a New Chat'>
                            <div style={{ backgroundColor: "lightblue", borderRadius: "50%", padding: 10 }}>
                                <IconButton onClick={openModal}>
                                    <img src={chatIcon} alt={"Start A Chat"} style={{ width: 40, cursor: "pointer" }} />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            ) : (
                <>
                    {chatUserDetail.length > 0 ? (
                            <div className="container mx-3">
                                <div style={{ position: "relative", width: 1100, height: 500 }}>
                                    <Paper elevation={2} sx={{ width: "100%", height: "100%", overflowY: 'auto' }}>
                                        {chatUserDetail.map((userDetail, index) => (
                                            <ChatDetailCard key={index} showAlert={props.showAlert} userCredentials={userDetail.userCredentials} chatCredentials={userDetail.chatDetails} />
                                        ))}
                                    </Paper>
                                    <div style={{ position: "absolute", bottom: 20, right: 20 }}>
                                        <Tooltip title='Start a New Chat'>
                                            <div style={{ backgroundColor: "lightblue", borderRadius: "50%", padding: 10 }}>
                                                <IconButton onClick={openModal}>
                                                    <img src={chatIcon} alt={"Start A Chat"} style={{ width: 40, cursor: "pointer" }} />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                    ) : (
                        <div className="text-center">
                            <p style={{ color: 'grey', marginTop: 200 }}>Start Chatting with People!</p>
                            <Button variant="outlined" color="primary" endIcon={<ArrowCircleRightRoundedIcon />} onClick={goToPeople}>
                                Find New Friends
                            </Button>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Chat;