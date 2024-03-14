import { Avatar, Card, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, LinearProgress, Paper, TextField, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import userContext from '../../context/User/UserContext';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ShowMessage from './ShowMessage';
import CircularWithValueLabel from '../CircularWithValueLabel';
import { closeWebSocket, initializeWebSocket } from '../WebSocketService';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const ViewChats = (props) => {
  const { setProgress, progress, showProgress, showAlert } = props;

  const context = useContext(userContext);
  const { fetchUserDetails, user, chatId, getAllChatsById, convertDateAndTime, editMessage, clearChat } = context;
  const { setStatus, status } = context;
  const [receiver, setReceiver] = useState({});
  const [sender, setSender] = useState({});
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");
  const [previousMessages, setPreviousMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [isEditBox, setIsEditBox] = useState(false);
  const [messageId, setMessageId] = useState("");
  const paperRef = useRef(null);

  useEffect(() => {
    if (chatId === "") {
      navigate("/login");
    } else {
      setProgress(10);
      console.log(chatId);
      console.log("Assigning sender and Recievers!");
      assignSenderAndReceiver()
        .catch((error) => {
          console.error('An error occurred:', error);
        })
        .finally(() => {
          setProgress(100);
          console.log("all set and websocket is coming");
        });
    }
  }, [chatId]);

  useEffect(() => {
    setProgress(30);
    console.log("Fetching profile");
    fetchProfileSource(receiver.profilePhoto);
    console.log("Fetched profile");
  }, [receiver.profilePhoto]);

  useEffect(() => {
    if (chatId && sender.id) {
      setProgress(50);
      console.log("Fetching previous chats");
      fetchPreviousChats(chatId, sender.id)
        .then(() => {
          console.log("Fetched Previous chat and executing scrolling");
          scrollToBottom();
          setProgress(90);
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    }
  }, [chatId, sender.id]);

  // websocket
  useEffect(() => {
    const client = initializeWebSocket(chatId, (response) => {
      console.log("Received Message:", JSON.parse(response.body));
      const receivedChat = JSON.parse(response.body);
      console.log("Received Chats: ", receivedChat);
      if (!receivedChat.deletedForever && !receivedChat.edited) {
        setPreviousMessages((prevMessage) => [...prevMessage, receivedChat]);
      }
      else {
        setPreviousMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg.messageId === receivedChat.messageId) {
              // Replace the content and set isDeletedForever to true
              return {
                ...msg,
                content: receivedChat.content,
                deletedForever: receivedChat.deletedForever,
                edited: receivedChat.edited,
                timeStamp: receivedChat.timeStamp,
              };
            } else {
              return msg;
            }
          });
        });
      }
      setNewMessage(true);
      console.log(previousMessages);
    });
    setStompClient(client);
    return () => {
      closeWebSocket();
    };
  }, [chatId]);

  useEffect(() => {
    if (paperRef.current && previousMessages.length > 0) {
      scrollToBottom();
    }
  }, [previousMessages]);

  const initials = (receiver.firstName && receiver.firstName.charAt(0).toUpperCase()) + (receiver.lastName && receiver.lastName.charAt(0).toUpperCase());
  const userStatus = receiver.status ? receiver.status.toLowerCase() : '';

  const fetchPreviousChats = async (chatId, id) => {
    const response = await getAllChatsById(chatId, id);
    const data = await response.json();
    setPreviousMessages(data);
  }
  const assignSenderAndReceiver = async () => {
    setSender(user[0]);
    let ids = chatId.split("_");
    if (ids[0] === user[0]?.id) {
      const userDetail = await fetchData(ids[1]);
      setReceiver(userDetail);
    }
    else {
      const userDetail = await fetchData(ids[0]);
      setReceiver(userDetail);
    }
  }

  const fetchData = async (id) => {
    const userDetailPromise = await fetchUserDetails(id);
    const userDetail = await userDetailPromise.json();
    return userDetail;
  };

  const fetchProfileSource = (image) => {
    if (image) {
      const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      const url = `data:${mimeType};base64,${image}`;
      setImageUrl(url);
    }
  }

  const openViewUserInterface = () => {
    localStorage.setItem("userId", receiver.id);
    localStorage.setItem("previousLink", "/viewChats");
    navigate("/viewProfile");
  }
  const handleOnChange = (event) => {
    setMessage(event.target.value);
    if (event.target.value.trim() !== '' && user[0]?.id === receiver.id) {
      setStatus('typing');
    } else {
      setStatus(userStatus);
    }
  };

  const scrollToBottom = () => {
    if (paperRef.current) {
      paperRef.current.scrollTop = paperRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (paperRef.current && previousMessages.length > 0) {
      paperRef.current.scrollTop = paperRef.current.scrollHeight;
    }
  }, [previousMessages]);

  const sendMessage = (isEdited) => {
    setMessage("");
    if(user[0]?.id === receiver.id){
      setStatus(userStatus);
    }
    if (!isEdited) {
      const destination = `${process.env.REACT_APP_CHAT_PUBLISH_URL}/${sender.id}/${chatId}`;
      const headers = {
        'auth-token': localStorage.getItem("authToken"),
      };
      if (stompClient != null) {
        stompClient.publish({
          destination,
          headers,
          body: JSON.stringify({
            "senderId": sender.id,
            "receiverId": receiver.id,
            "content": message,
            "chatId": chatId
          }),
        });
      }
    }
    else {
      perfomEditOperation(chatId, messageId, sender.id);
      setIsEditBox(false);
      setMessageId("");
    }
  }

  const goToViewCard = (event) => {
    event.stopPropagation();
    navigate("/chat");
  }

  const clear_Chats = async (event) => {
    event.preventDefault();
    const response = await clearChat(chatId, user[0]?.id);
    const data = await response.json();
    if (data.success) {
      showAlert(data.message, "success");
      setPreviousMessages([]);
    }
    else {
      showAlert(data.message, "danger");
    }
    refCloseDeleteModal.current.click();
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && message.trim() !== '') {
      sendMessage();
    }
  }
  const formatTime = async (time) => {
    try {
      const response = await convertDateAndTime(time);
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error converting time:', error);
    }
  }

  const perfomEditOperation = async (chatId, messageId, senderId) => {
    const chatMessage = message;
    const response = await editMessage(chatId, messageId, senderId, chatMessage);
    const data = await response.json();
    if (data.success) {
      showAlert(data.message, "success");
    } else {
      showAlert(data.message, "danger");
    }
  }

  const performEditting = (messageId, msgContent) => {
    setIsEditBox(true);
    setMessageId(messageId);
    setMessage(msgContent);
  }

  const deleteRefOpen = useRef(null);
  const refCloseDeleteModal = useRef(null);

  const openClearChatModal = (event) => {
    event.stopPropagation();
    deleteRefOpen.current.click();
  }

  return (
    <>
      <div className="modal fade" id="deleteAccountConfirmationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Clear All Chats?</h5>
              {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
            </div>
            <div className="modal-body text-center">
              <p className='text-center' style={{ color: "red" }}>Are you sure you want to clear all your chats?</p>
              {/* <br></br> */}
              <p className='text-center' style={{ color: "grey" }}>This action can't be undone!</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={clear_Chats}>Yes</button>
              <button ref={refCloseDeleteModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div>
      {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
      <div className='container mx-3'>
        {/* <Button variant='outlined' onClick={goToViewCard}>Return</Button> */}
        {showProgress && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
          {showProgress && <CircularWithValueLabel value={progress} />}
        </div>}

        {!showProgress && <Paper elevation={3} sx={{ width: 1100, minHeight: 450 }}>
          {/* {<Paper elevation={3} sx={{ width: 1100, minHeight: 450 }}> */}
          {/*For user profile */}
          <Card sx={{ minWidth: "1020px", cursor: "pointer" }} onClick={openViewUserInterface}>
            <CardContent>
              <Grid container alignItems="center">
                <Grid item xs={10}>
                  <CardHeader
                    avatar={
                      imageUrl === null ?
                        <Avatar sx={{ fontSize: "40px", backgroundColor: "lightblue", color: "black", width: "80px", height: "80px", position: "relative", cursor: "pointer" }} aria-label="recipe">
                          {initials}
                          {userStatus === "online" &&
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              top: '56px',
                              left: '50px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: "green",
                              border: '2px solid white',
                            }} />
                          }
                        </Avatar>
                        :
                        <Avatar sx={{ width: "80px", height: "80px", position: "relative", cursor: "pointer" }} aria-label="recipe">
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
                          {userStatus === "online" &&
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              top: '56px',
                              left: '50px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              backgroundColor: "green",
                              border: '2px solid white',
                            }} />
                          }
                        </Avatar>
                    }
                    action={
                      <>
                        <Tooltip title="Clear Chats">
                          <IconButton aria-label='clear chats' sx={{ marginTop: 2, marginRight: 2 }} onClick={openClearChatModal}>
                            <ClearAllIcon fontSize='30' />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Close Chat'>
                          <IconButton onClick={goToViewCard} sx={{ marginTop: 2, marginRight: 2 }}>
                            <CloseRoundedIcon fontSize='30' />
                          </IconButton>
                        </Tooltip>

                      </>
                    }
                    title={
                      <>
                        <h5 style={{ fontSize: 25 }}>{receiver.firstName + " " + receiver.lastName} <Chip sx={{ backgroundColor: "lightgreen" }} icon={<FaceIcon />} label={receiver.userName} /></h5>
                      </>
                    }
                    subheader={
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>{receiver.tagLine}</span>
                        {userStatus === 'online' ? (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'green',
                            marginLeft: '5px', // Add some spacing between the tagline and dot
                          }} />
                        ) : (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'grey',
                            marginLeft: '5px', // Add some spacing between the tagline and dot
                          }} />
                        )}
                        <span style={{ marginLeft: '5px' }}>
                          {status==='typing'? 'Typing' : userStatus === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    }

                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Paper ref={(ref) => {
            paperRef.current = ref;
            if (paperRef.current) {
              paperRef.current.scrollTop = paperRef.current.scrollHeight;
            }
          }} elevation={2} className='my-1 text-center' sx={{ height: 370, background: "lightblue", overflowY: "auto", display: 'flex', flexDirection: 'column' }}>
            {previousMessages.length === 0 ?
              <div>
                <p className='text-center' style={{ color: "black", justifyContent: "center", display: "flex", alignItems: "center" }}>
                  Start Messaging! Say Hi 👋
                </p>
              </div>
              :
              <>
                {previousMessages
                  .slice()
                  .sort((a, b) => a.timeStamp - b.timeStamp)
                  .map((msg, index) => {
                    return (
                      <ShowMessage receiver={receiver} newMsg={newMessage} performEditting={performEditting} showAlert={showAlert} key={index} message={msg} formatTime={formatTime} />
                    )
                  })}

              </>
            }
          </Paper>
          <div>
            <TextField
              className='my-2 mx-2'
              id='outlined-basic'
              sx={{ width: 1000 }}
              label='Message'
              variant='outlined'
              onChange={handleOnChange}
              onKeyPress={handleKeyPress}
              value={message}
            />

            <Tooltip title='Send Message'>
              <span>
                <IconButton disabled={message.length === 0} onClick={() => {
                  sendMessage(isEditBox);
                }}>
                  {message.length === 0 ?
                    <SendRoundedIcon className='mx-2 my-2' color='disabled' sx={{ fontSize: 40 }} /> :
                    <SendRoundedIcon className='mx-2 my-2' color='success' sx={{ fontSize: 40 }} />}
                </IconButton>
              </span>
            </Tooltip>
          </div>
        </Paper>}
      </div>
      <button hidden={true} ref={deleteRefOpen} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteAccountConfirmationModal">
        Launch demo modal
      </button>
    </>
  )
}

export default ViewChats