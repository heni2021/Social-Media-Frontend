import React from 'react'
import PeopleContext from './PeopleContext'

const PeopleState = (props) => {
  return (
      <PeopleContext.Provider>
          {props.children}
      </PeopleContext.Provider>

  )
}

export default PeopleState
