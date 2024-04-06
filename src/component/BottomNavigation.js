import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import userContext from '../context/User/UserContext';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export default function BottomNavigationBar(props) {
    // eslint-disable-next-line
    const [value, setValue] = React.useState("people");
    const navigate = useNavigate();
    const handleChange = (event, newValue) => {
        event.preventDefault();
        setValue(newValue);
    };


    const context = React.useContext(userContext);
    const { user, setUserDetail, setCallHistory, fetchIncomingCalls, setOutgoingCallHistory, fetchOutgoingCalls, fetchOtherFriends, logOut } = context;
    const { fetchIncomingFriendRequest, fetchOutgoingFriendRequest, setIncomingFriendRequest, setOutgoingFriendRequest, stompClient } = context;
    const { setPosts,friendRef, peopleRef } = context;

    const fetchData = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchOtherFriends(user[0]?.id);
            const data = await response.json();
            if (data.length > 0) {
                setUserDetail(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);

        }
        navigate('/people');
    };

    const openFriendRequests = async (e) => {
        e.preventDefault();
        const response = await fetchIncomingFriendRequest(user[0]?.id);
        const data = await response.json();
        setIncomingFriendRequest(data);
        const resp = await fetchOutgoingFriendRequest(user[0]?.id);
        const d = await resp.json();
        setOutgoingFriendRequest(d);
        navigate('/viewRequests');
    }

    const openCallHistory = async (e) => {
        e.preventDefault();
        const response = await fetchIncomingCalls(user[0]?.id);
        const data = await response.json();
        setCallHistory(data);
        const resp = await fetchOutgoingCalls(user[0]?.id);
        const outData = await resp.json();
        setOutgoingCallHistory(outData);
        navigate('/callHistory');
    }

    const openChat = (e) => {
        e.preventDefault();
        navigate('/chat');
    }

    const openAccountDetails = (e) => {
        e.preventDefault();
        navigate('/accountDetails');
    }

    const loggedOut = async (e) => {
        e.preventDefault();
        const response = await logOut(user[0].id);
        const data = await response.json();
        if (data.success) {
            localStorage.removeItem('authToken');
            localStorage.removeItem("previousLink");
            localStorage.removeItem("likePressed");
            props.showAlert("Logged Out Successfully!", "success");
            closeWebSocket();
            navigate("/login");
        }
        else {
            props.showAlert("Some Error Occured!", "danger");
        }
    }

    const closeWebSocket = () => {
        stompClient && stompClient.deactivate();
    }

    const addNewPost = () => {
        navigate("/addPost")
    }

    const fetchHomeDetails = () => {
        navigate("/home");
    }

    const openSearch = () => {
        navigate("/search");
    }

    return (
        <BottomNavigation className="mx-3" sx={{ width: 1100, marginTop: 3 }} value={props.value} onChange={handleChange}>
            <BottomNavigationAction
                ref={peopleRef}
                label="Find People"
                value="people"
                icon={<PersonIcon />}
                onClick={fetchData}
            />
            <BottomNavigationAction
                label="Search Users"
                value="searchUsers"
                icon={<PersonSearchIcon />}
                onClick={openSearch}
            />
            <BottomNavigationAction
                ref={friendRef}
                label="Requests"
                value="friendRequests"
                icon={<HandshakeIcon />}
                onClick={openFriendRequests}
            />
            <BottomNavigationAction
                label="Call History"
                value="Calls"
                icon={<CallIcon />}
                onClick={openCallHistory}
            />
            <BottomNavigationAction
                label="Home"
                value="home"
                icon={<HomeRoundedIcon />}
                onClick={fetchHomeDetails}
            />
            <BottomNavigationAction 
                label="Add Post"
                value="post"
                icon={<AddBoxRoundedIcon />}
                onClick={addNewPost}
            />
            <BottomNavigationAction
                label="Chats"
                value="chat"
                icon={<ChatIcon />}
                onClick={openChat}
            />
            <BottomNavigationAction
                label="Account"
                value="account"
                icon={<AccountCircleIcon />}
                onClick={openAccountDetails}
            />
            <BottomNavigationAction
                label="LogOut"
                value="logout"
                icon={<LogoutIcon />}
                onClick={loggedOut}
            />
        </BottomNavigation>
    );
}