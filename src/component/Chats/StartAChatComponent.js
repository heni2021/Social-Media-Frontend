import React, { useContext, useEffect, useState } from 'react'
import userContext from '../../context/User/UserContext';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchSharp';
import ShowDefaultUserDetails from './ShowDefaultUserDetails';
import ShowSearchUsers from './ShowSearchUsers';

const StartAChatComponent = (props) => {
    const { closeChattingModal } = props;
    const context = useContext(userContext);
    const { searchUser } = context;
    const [pattern, setPattern] = useState("");
    const [users, setUsers] = useState([]);


    useEffect(() => {
        if (pattern.length > 0) {
            searchUsers();
        }
    }, [pattern]);


    const handleOnChange = (event) => {
        setPattern(event.target.value);
    };

    const searchUsers = async () => {
        try {
            const response = await searchUser(pattern);
            const data = await response.json(); // Assuming the response is in JSON format
            setUsers(data);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };
    return (
        <div>
            <div className="container my-2">
                <TextField
                    id='outlined-basic'
                    sx={{ width: 600 }}
                    label='Search Users'
                    variant='outlined'
                    onChange={handleOnChange}
                    onKeyPress={searchUsers}
                    value={pattern}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Tooltip title='Search'>
                                    <IconButton onClick={searchUsers}>
                                        <SearchIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            {pattern.length > 0 ?
                <ShowSearchUsers users={users} closeChattingModal={closeChattingModal} /> :
                    <ShowDefaultUserDetails closeChattingModal={closeChattingModal} />
                }
        </div>
    )
}

export default StartAChatComponent
