import React from 'react'
import ChatPersonalDetailCard from './ChatPersonalDetailCard';

const ChatDetailCard = (props) => {
  const { userCredentials, chatCredentials, showAlert } = props;
  return (
    <div className='container mx-3'>
      <ChatPersonalDetailCard showAlert={showAlert} users={userCredentials} chat={chatCredentials} />
    </div>
  )
}

export default ChatDetailCard
