import React, { useContext, useEffect, useState } from 'react';
import userContext from '../../context/User/UserContext';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DisplayMessage = (props) => {
  const { chat, formatTime } = props;
  const context = useContext(userContext);
  const { user } = context;

  const [time, setTime] = useState("");

  const isSender = chat.senderId === user[0].id;
  const messageClass = isSender ? 'sender-message' : 'receiver-message';


  useEffect(() => {
    convertAndFormatTime(chat.timeStamp);
  }, [chat]);

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isSender ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div className={`message-box ${messageClass} my-1 mx-2`} style={{ maxWidth: '50%', wordWrap: 'break-word' }}>
        <div className="message-content" style={{ fontStyle: 'italic' }}>
          {chat.content}
        </div>
      </div>
      <div className='mx-2' style={{ alignSelf: isSender ? 'flex-end' : 'flex-start' }}>
        <p style={{ fontSize: 12 }}>
          <AccessTimeIcon sx={{ fontSize: 17 }} /> {time}
        </p>
      </div>
    </div>
  )
}

export default DisplayMessage;
