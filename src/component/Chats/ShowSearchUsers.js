import { Paper } from '@mui/material';
import React from 'react'
import NotFoundGif from '../../Photos/NotFound.gif';
import ShowUsersDetailsCard from './ShowUsersDetailsCard';


const ShowSearchUsers = (props) => {
    const { users, closeChattingModal } = props;

    return (
        <div className='my-1'>
            {users.length > 0 ?
                <Paper  className="mx-3" elevation={3} sx={{width: 620 }}>
                    {users.map((user, index) => (
                        <ShowUsersDetailsCard key={index} userDetail={user} closeChattingModal={closeChattingModal}/>
                    ))}
                </Paper>
                :
                <Paper className='mx-3 text-center' elevation={3} sx={{ background: "#CBC3E3", position: "absolute", width: 600, height: 300 }}>
                    <img className='my-3' src={NotFoundGif} alt='Not Found' style={{ width: 200, height: 200 }} />
                    <br />
                    <p style={{ fontWeight: "bolder" }}>No Matches Found for your search!!</p>
                </Paper>
            }
        </div>
    );
}

export default ShowSearchUsers
