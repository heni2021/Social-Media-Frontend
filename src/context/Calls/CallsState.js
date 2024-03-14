import React from 'react'
import CallsContext from './CallsContext'

const CallsState = (props) => {

  return (
      <CallsContext.Provider>
          {props.children}
      </CallsContext.Provider>
  )
}

export default CallsState
