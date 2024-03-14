import React, { useEffect } from 'react';
import BottomNavigationBar from '../BottomNavigation';
import { useState } from 'react';
import { IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchSharp';
import { useContext } from 'react';
import userContext from '../../context/User/UserContext';
import ShowSearchedUserDetails from './ShowSearchedUserDetails';

const Search = (props) => {
    const context = useContext(userContext);
    const { searchUser } = context;
    const [pattern, setPattern] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if(pattern.length>0){
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
            <BottomNavigationBar value="searchUsers" />
            <div className="container mx-5 my-2">
                <TextField
                    id='outlined-basic'
                    sx={{ width: 945 }}
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
            {pattern.length>0? <ShowSearchedUserDetails users={users}/> : <></>}
        </div>
    );
};

export default Search;
