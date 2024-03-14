import { Paper } from '@mui/material';
import React from 'react'
import ShowUserDetails from './ShowUserDetails';
import NotFoundGif from '../../Photos/NotFound.gif';

const ShowSearchedUserDetails = (props) => {
    const { users } = props;

    return (
        <div className='my-1'>
            {users.length > 0 ? 
                <Paper elevation={3} sx={{ position: "absolute", marginLeft: 7.5, width: 945 }}>
                    {users.map((user, index) => (
                        <ShowUserDetails key={index} userDetail={user} componentWidth={900}/>
                    ))}
                </Paper>
                : 
                <Paper className='text-center' elevation={3} sx={{ background: "#CBC3E3", position: "absolute", marginLeft: 7.5, width: 945, height: 400 }}>
                    <img className='my-3' src={NotFoundGif} alt='Not Found' style={{width: 200, height: 200}} />
                    <br />
                    <p style={{fontWeight: "bolder" }}>No Matches Found for your search!!</p>
                </Paper>
            }
        </div>
    );
};


export default ShowSearchedUserDetails;
