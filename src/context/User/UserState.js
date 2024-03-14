import UserContext from "./UserContext";
import { React, useRef, useState } from 'react';
const UserState = (props) => {

    const peopleRef = useRef(null);
    const friendRef = useRef(null);

    const userList = [];
    const [user, setUser] = useState(userList);
    const[userDetail, setUserDetail] = useState({});
    const[callHistory, setCallHistory] = useState({});
    const[outgoingCallHistory, setOutgoingCallHistory] = useState({});
    const[callUserData, setCallUserData] = useState({});
    const[incomingFriendRequest, setIncomingFriendRequest] = useState({});
    const[outgoingFriendRequest, setOutgoingFriendRequest] = useState({});
    const[postId, setPostId] = useState("");
    const[chatId, setChatId] = useState("");
    const[status, setStatus] = useState("");

    const fetchLoginUrl = process.env.REACT_APP_LOGIN_URL;
    const fetchSignupUrl = process.env.REACT_APP_SIGNUP_URL;
    const fetchResetUrl = process.env.REACT_APP_RESET_PASSWORD;
    const fetchOther = process.env.REACT_APP_FETCH_OTHER_FRIENDS;
    const fetchDetails = process.env.REACT_APP_FETCH_USER_DETAILS;
    const logOutUrl = process.env.REACT_APP_LOGGED_OUT;
    const incomingCallHistoryUrl = process.env.REACT_APP_FETCH_INCOMING_CALL;
    const outgoingCallHistoryUrl = process.env.REACT_APP_FETCH_OUTGOING_CALL;
    const fetchByIdUrl = process.env.REACT_APP_FETCH_USING_ID;
    const convertTimeUrl = process.env.REACT_APP_CONVERT_TO_TIME;
    const computeDurationUrl = process.env.REACT_APP_COMPUTE_DURATION;
    const clearIncomingHistroy = process.env.REACT_APP_CLEAR_INCOMING_HISTORY;
    const clearOutgoingHistory = process.env.REACT_APP_CLEAR_OUTGOING_HISTORY;
    const clearCallHistory = process.env.REACT_APP_CLEAR_CALL_HISTORY;
    const clearByIdUrl = process.env.REACT_APP_CLEAR_CALL_BY_ID;
    const incomingFriendRequestUrl = process.env.REACT_APP_SHOW_INCOMING_REQUEST;
    const outgoingFriendRequestUrl = process.env.REACT_APP_SHOW_OUTGOING_REQUEST;
    const sendRequestUrl = process.env.REACT_APP_SEND_REQUEST;
    const cancelRequestUrl = process.env.REACT_APP_CANCEL_FRIEND_REQUEST;
    const acceptRequestUrl = process.env.REACT_APP_ACCEPT_FRIEND_REQUEST;
    const ignoreRequestUrl = process.env.REACT_APP_IGNORE_FRIEND_REQUEST;
    const isFriendUrl = process.env.REACT_APP_IS_FRIEND_OF;
    const fetchFollowersUrl = process.env.REACT_APP_FETCH_FOLLOWERS;
    const fetchFollowingUrl = process.env.REACT_APP_FETCH_FOLLOWING;
    const fetchUnfollowUrl = process.env.REACT_APP_UNFOLLOW;
    const fetchDeleteAccountUrl = process.env.REACT_APP_DELETE_PROFILE;
    const fetchUpdateAccountUrl = process.env.REACT_APP_UPDATE_PROFILE;
    const addPostUrl = process.env.REACT_APP_ADD_POST;
    const getAllPostUrl = process.env.REACT_APP_GET_ALL_BY_ID;
    const updatePostUrl = process.env.REACT_APP_UPDATE_POST;
    const deletePostUrl = process.env.REACT_APP_DELETE_POST;
    const getAllPostByFollowingUrl = process.env.REACT_APP_FETCH_POST_OF_FOLLOWING;
    const likePostUrl = process.env.REACT_APP_LIKE_POST;
    const dislikePostUrl = process.env.REACT_APP_UNLIKE_POST;
    const isLikedUrl = process.env.REACT_APP_ISLIKED;
    const downloadUrl = process.env.REACT_APP_DOWNLOAD_POST;
    const setProfilePhotoUrl = process.env.REACT_APP_ADD_PROFILE_PHOTO;
    const getPostByIdUrl = process.env.REACT_APP_FETCH_POST_BY_ID;
    const getChatsUrl = process.env.REACT_APP_FETCH_CHATS;
    const getAllChatsByIdUrl = process.env.REACT_APP_FETCH_CHATS_BY_CHATID;
    const isoDateUrl = process.env.REACT_APP_CONVERT_ISO_DATE_AND_TIME;
    const editMessageUrl = process.env.REACT_APP_EDIT_CHAT_MESSAGE;
    const checkDeleteMsgUrl = process.env.REACT_APP_CHECK_CAN_DELETE_MESSAGE;
    const deleteAMessageUrl = process.env.REACT_APP_DELETE_A_SPECIFIC_MESSAGE;
    const searchUserUrl = process.env.REACT_APP_SEARCH_URL;
    const clearChatUrl = process.env.REACT_APP_CLEAR_CHATS;
    const deleteAllChatsUrl = process.env.REACT_APP_DELETE_CHATS;

    const clearChat = async(chatId, id)=>{
        const response = await fetch(`${clearChatUrl}/${chatId}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const deleteChat = async(chatId, id)=>{
        const response = await fetch(`${deleteAllChatsUrl}/${chatId}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const searchUser = async(pattern) => {
        const response = await fetch(`${searchUserUrl}/${pattern}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    const deleteMessage = async (chatId, messageId, id) => {
        const response = await fetch(`${deleteAMessageUrl}/${messageId}/${chatId}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const canDeleteMsg = async (chatId, messageId, id) => {
        const response = await fetch(`${checkDeleteMsgUrl}/${chatId}/${messageId}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const editMessage = async (chatId, messageId, id, chatMessage) => {
        const response = await fetch(`${editMessageUrl}/${chatId}/${id}/${messageId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
            body: JSON.stringify({"content": chatMessage}),
        });
        return response;
    }

    const deleteMessageForever = async (chatId, messageId, id) => {
        const response = await fetch(`http://localhost:3030/chat/${chatId}/message/${messageId}/forever/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token' : localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const convertDateAndTime = async(time) => {
        const response = await fetch(`${isoDateUrl}/${time}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    const getAllChatsById = async(chatId, id) => {
        const response = await fetch(`${getAllChatsByIdUrl}/${chatId}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const getChats = async(id) => {
        const response = await fetch(`${getChatsUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token" : localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const getPostById = async(postId) => {
        const response = await fetch(`${getPostByIdUrl}/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    const setProfilePhoto = async(id, image) => {
        const response = await fetch(`${setProfilePhotoUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
            body: JSON.stringify({image: image}),
        });
        return response;
    }
    
    const downloadPost = async(id, postId, format) =>{
        const response = await fetch(`${downloadUrl}/${id}/${postId}/${format}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const likePost = async(id, postId) => {
        const response = await fetch(`${likePostUrl}/${id}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token' : localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const dislikePost = async(id, postId) => {
        const response = await fetch(`${dislikePostUrl}/${id}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token' : localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const isLiked = async(id, postId) => {
        const response = await fetch(`${isLikedUrl}/${id}/${postId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    const getAllByFollowing = async(id) => {
        const response = await fetch(`${getAllPostByFollowingUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    const updatePost = async(id, postId, description, image) => {
        if(image){
        const response = await fetch(`${updatePostUrl}/${id}/${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
            body: JSON.stringify({ description, image }),
        });

        return response;
    }
    else{
            const response = await fetch(`${updatePostUrl}/${id}/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem("authToken"),
                },
                body: JSON.stringify({ description }),
            });

            return response;
    }
    }

    const deletePost = async(id, postId) => {
        const response = await fetch(`${deletePostUrl}/${id}/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const getAllPost = async(id) => {
        const response = await fetch(`${getAllPostUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        return response;
    }

    const addPost = async (id, description, image) => {
        const response = await fetch(`${addPostUrl}/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
            body: JSON.stringify({ description, image }),
        });

        return response;
    }


    const unfollowFriend = async(id, friendId) => {
        const response = await fetch(`${fetchUnfollowUrl}/${id}/${friendId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const deleteAccount = async(id) => {
        const response = await fetch(`${fetchDeleteAccountUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
        });
        return response;
    }

    const updateAccount = async(id, firstName, lastName, tagLine, userName) => {
        const response = await fetch(`${fetchUpdateAccountUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken"),
            },
            body: JSON.stringify({firstName, lastName, tagLine, userName}),
        });
        return response;
    }

    const fetchFollowing = async(id) => {
        const response = await fetch(`${fetchFollowingUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    const fetchFollowers = async(id) => {
        const response = await fetch(`${fetchFollowersUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response;
    }

    const isFriend = async(id, userId) =>{
        const response = await fetch(`${isFriendUrl}/${id}/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const acceptFriendRequest = async(receiverId, senderId) => {
        const response = await fetch(`${acceptRequestUrl}/${receiverId}/${senderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const ignoreFriendRequest = async(receiverId, senderId) => {
        const response = await fetch(`${ignoreRequestUrl}/${receiverId}/${senderId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const cancelFriendRequest = async(senderId, receiverId) => {
        const response = await fetch(`${cancelRequestUrl}/${senderId}/${receiverId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const sendRequest = async(id, receiverId) => {
        const response = await fetch(`${sendRequestUrl}/${id}/${receiverId}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const fetchIncomingFriendRequest = async(id) =>{
        const response = await fetch(`${incomingFriendRequestUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const fetchOutgoingFriendRequest = async(id) =>{
        const response = await fetch(`${outgoingFriendRequestUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }
    
    const clearCallById = async(id, callId) => {
        const response = await fetch(`${clearByIdUrl}/${id}/${callId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        // console.log(response.json());
        return response;
    }

    const clearIncomingCalls = async(id) => {
        const response = await fetch(`${clearIncomingHistroy}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        return response;
    }

    const clearOutgoingCallHistory = async (id) => {
        const response = await fetch(`${clearOutgoingHistory}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        // console.log(response.json());
        return response;
    }

    const clearAllCalls = async (id) => {
        const response = await fetch(`${clearCallHistory}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        // console.log(response.json());
        return response;
    }

    const computeDuration = async(startTime, endTime) => {
        // console.log("Hello");
        const response = await fetch(`${computeDurationUrl}/${startTime}/${endTime}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // setUser([await response.json()]);
        return response;
    }

    const convertTime = async (time) => {
        const response = await fetch(`${convertTimeUrl}/${time}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // setUser([await response.json()]);
        return response;
    }

    const fetchUserDetails = async (id) => {
        const response = await fetch(`${fetchByIdUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }

    const fetchIncomingCalls = async(id) => {
        const response = await fetch(`${incomingCallHistoryUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        // console.log(response.json());
        return response;
    }

    const fetchOutgoingCalls = async(id) => {
        const response = await fetch(`${outgoingCallHistoryUrl}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            },
        });
        // console.log(response.json());
        return response;
    }
    const getUserDetails = async() => {
        const response = await fetch(fetchDetails, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token' : localStorage.getItem("authToken")
            },
        });
        const data = await response.json();
        setUser([data]);    
    }

    const login = async (emailAddress, password) => {
        const response = await fetch(fetchLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailAddress, password })
        });
        return response;
    }

    const logOut = async( id ) => {
        const response = await fetch(`${logOutUrl}/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token' : localStorage.getItem("authToken")
            }
        });
        return response;
    }

    // SignUp Component
    const signup = async (firstName, lastName, emailAddress, password, tagLine, userName) => {
        const response = await fetch(fetchSignupUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailAddress, password, firstName, lastName, userName, tagLine })
        });
        return response;
    }

    // Reset Component
    const resetPassword = async(emailAddress, password) =>{
        const response = await fetch(fetchResetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailAddress, password})
        });
        return response;
    }

    // Fetch other friends
    const fetchOtherFriends = async(id) =>{
        // console.log("HELLO: "+id);
        const response = await fetch(`${fetchOther}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem("authToken")
            }
        });
        // setUser([await response.json()]);
        return response;
    }


    return (
        <UserContext.Provider value={{ setStatus, status, clearChat, deleteChat, searchUser, deleteMessage, canDeleteMsg, editMessage, deleteMessageForever, convertDateAndTime,getAllChatsById, setChatId, chatId, getChats, getPostById, setPostId, postId, setProfilePhoto, downloadPost, isLiked, likePost, dislikePost, getAllByFollowing, updatePost, deletePost, getAllPost, addPost, peopleRef, friendRef, unfollowFriend, deleteAccount, updateAccount, fetchFollowing, fetchFollowers, isFriend, ignoreFriendRequest, acceptFriendRequest, cancelFriendRequest, fetchOutgoingFriendRequest, fetchIncomingFriendRequest, sendRequest, incomingFriendRequest, outgoingFriendRequest, setIncomingFriendRequest,setOutgoingFriendRequest,clearCallById, clearIncomingCalls, clearOutgoingCallHistory, clearAllCalls, setOutgoingCallHistory, outgoingCallHistory, setCallUserData, convertTime, fetchOutgoingCalls,callUserData, computeDuration, login, signup, callHistory, fetchUserDetails,setCallHistory, fetchIncomingCalls, resetPassword, setUserDetail, logOut, userDetail, fetchOtherFriends, getUserDetails, setUser, user }}>
            {props.children}
        </UserContext.Provider>
    )
}
export default UserState;