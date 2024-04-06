import React, { useContext, useState, useRef, useEffect } from 'react';
import userContext from '../../context/User/UserContext';
import { Divider, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DisplayMessage from './DisplayMessage';

const CallChat = () => {
  const context = useContext(userContext);
  const { roomId, chats, user, receiverDetails, convertDateAndTime } = context;
  const innerPaperRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleOnChange = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && message.trim() !== '') {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const url = `http://localhost:3030/send/${user[0]?.id}/${roomId}`;
    const chatMessage = {
      content: message,
      senderId: user[0]?.id,
      receiverId: receiverDetails.id
    }
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem("authToken"),
      },
      body: JSON.stringify(chatMessage)
    });
    const data = await response.json();
    if (data.success) {
      setMessage("");
      console.log("MessageSent");
    }
  }

  useEffect(() => {
    if (innerPaperRef.current) {
      // Scroll to the bottom of the inner paper
      innerPaperRef.current.scrollTop = innerPaperRef.current.scrollHeight;
    }
  }, [chats]);

  const formatTime = async (time) => {
    try {
      const response = await convertDateAndTime(time);
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error converting time:', error);
    }
  }

  return (
    <Paper
      elevation={2}
      sx={{
        width: 550,
        height: 350,
        position: "absolute",
        marginBottom: 0,
        marginTop: 10, // This will push the content to the bottom
        marginLeft: 20,
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        justifyContent: 'flex-end' // Push content to the bottom
      }}
    >
      <div>
        {chats.length > 0 &&
          <Paper className='my-1 mx-1' elevation={2} sx={{ width: 540, height: 270, overflow: 'auto' }} ref={innerPaperRef}>
            {chats.map((chat, index) => <DisplayMessage key={index} chat={chat} formatTime={formatTime }/>)}
          </Paper>
        }
        <Divider />
        <TextField
          className='my-2 mx-2'
          id='outlined-basic'
          sx={{ width: 450 }}
          label='Message'
          variant='outlined'
          onChange={handleOnChange}
          onKeyPress={handleKeyPress}
          value={message}
        />
        <Tooltip title='Send Message'>
          <span>
            <IconButton disabled={message.length === 0}>
              {message.length === 0 ?
                <SendRoundedIcon className='mx-2 my-2' color='disabled' sx={{ fontSize: 40 }} onClick={sendMessage} /> :
                <SendRoundedIcon className='mx-2 my-2' color='success' sx={{ fontSize: 40 }} onClick={sendMessage} />}
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </Paper>
  );
};

export default CallChat;
