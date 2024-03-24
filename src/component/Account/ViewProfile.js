import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import userContext from '../../context/User/UserContext';
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, IconButton, LinearProgress, Paper, Tooltip, Typography } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import ShowFriendsCard from './Cards/ShowFriendsCard';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FirstPageRoundedIcon from '@mui/icons-material/FirstPageRounded';
import { useNavigate } from 'react-router-dom';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import ShowPostCard from './Cards/ShowPostCard';

const ViewProfile = (props) => {
    const context = useContext(userContext);
    const {fetchUserDetails, sendRequest, user, isFriend, convertTime, fetchFollowing, fetchFollowers } = context;
    const { isLiked, dislikePost, getAllPost, likePost, downloadPost, setChatId } = context;
    const [userDetails, setUserDetail] = useState({
        userName: '',
        firstName: '',
        lastName: '',
        tagLine: '',
        status: '',
        numberOfFollowers: '',
        numberOfFollowing: '',
        time: '',
        id: '',
        profile: ''
    });
    const { showProgress, setProgress, progress } = props;
    const initials = userDetails.firstName.charAt(0).toUpperCase() + userDetails.lastName.charAt(0).toUpperCase();
    const navigate = useNavigate();
    const [formattedRequestDate, setFormattedRequestDate] = useState("");
    const [friend, setFriend] = useState(false);
    const [followingUserCredentials, setFollowingUserCredentials] = useState({});
    const [followerUserCredentials, setFollowerUserCredentials] = useState({});
    const [showFollowing, setShowFollowing] = useState(null);
    const [posts, setPosts] = useState([]);
    let userId = null;
    const [imageUrl, setImageUrl] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        setProgress(10);
        userId = localStorage.getItem('userId');
        setProgress(30);
        localStorage.removeItem('userId');
        if (userId == null) {
            setProgress(100);
            return;
        }
        fetchData(userId);
        isFriendOf(userId);
        getPosts(userId);
    }, []);

    useEffect(() => {
        fetchProfilePhoto();
    }, [userDetails.profile]);

    useEffect(() => {
        if (profile !== null) {
            fetchProfileSource(profile);
        }
    }, [profile]);
    const fetchProfilePhoto = () => {
        setProfile(userDetails.profile);
    }
    const fetchProfileSource = (image) => {
        if (image) {
            const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
            const url = `data:${mimeType};base64,${image}`;
            setImageUrl(url);
        } else {
            console.error("Image is undefined");
        }
    }
    const getPosts = async (userId) => {
        setProgress(40);
        const response = await getAllPost(userId);
        setProgress(50);
        const data = await response.json();
        setProgress(80);
        setPosts(data);
        setProgress(100);
    }

    const fetchSource = (image) => {
        const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
        const url = `data:${mimeType};base64,${image}`;
        // setImageUrl(url);
        return url;
    }

    const fetchData = async (id) => {
        try {
            setProgress(40);
            const response = await fetchUserDetails(id);
            setProgress(60);
            const data = await response.json();
            setProgress(70);
            setUserDetail({
                userName: data.userName,
                firstName: data.firstName,
                lastName: data.lastName,
                tagLine: data.tagLine,
                id: data.id,
                status: data.status,
                numberOfFollowers: data.followerId != null ? data.followerId.length : '0',
                numberOfFollowing: data.followingId != null ? data.followingId.length : '0',
                time: formatTime(data.creationDate),
                profile: data.profilePhoto,
            });
        } catch (error) {
            setProgress(100);
            console.error('Failed to fetch user details:', error);
        }
    };

    const formatTime = async (time) => {
        try {
            setProgress(80);
            const response = await convertTime(time);
            setProgress(90);
            const data = await response.text();
            setProgress(100);
            setFormattedRequestDate(data);
        } catch (error) {
            setProgress(100);
            console.error('Error converting time:', error);
            setFormattedRequestDate("Error");
        }
    }

    const isFriendOf = async (userId) => {
        setProgress(60);
        const response = await isFriend(user[0]?.id, userId);
        setProgress(70);
        const data = await response.json();
        setProgress(83);
        if (data.success) {
            if (data.message === "true") {
                setProgress(100);
                setFriend(true);
            }
            else {
                setProgress(100);
                setFriend(false);
            }
        }
        else {
            setProgress(100);
            props.showAlert(data.message, "danger");
        }
    }

    const fetchFollowingFriends = async () => {
        const response = await fetchFollowing(userDetails.id);
        await fetchData(userDetails.id);
        const data = await response.json();
        setFollowingUserCredentials(data);
        setShowFollowing(true);
    }

    const fetchFollowerFriends = async () => {
        const response = await fetchFollowers(userDetails.id);
        await fetchData(userDetails.id);
        const data = await response.json();
        setFollowerUserCredentials(data);
        setShowFollowing(false);
    }

    const sendFriendRequest = async () => {
        try {
            const response = await sendRequest(user[0]?.id, userDetails.id);
            const data = await response.json();

            if (data.success) {
                props.showAlert(data.message, "success");
                isFriendOf(userDetails.id);
            } else {
                props.showAlert(data.message, "danger");
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
            props.showAlert('Error sending friend request', 'danger');
        }
    };

    const goToPrevious = () => {
        const link = localStorage.getItem('previousLink');
        if (link === null) {
            localStorage.removeItem("authToken");
            navigate('/login');
        }
        else {
            navigate(link);
        }
    }

    const checkFriend = async (friendId) => {
        const response = await isFriend(user[0]?.id, friendId);
        const data = await response.json();
        if (data.success) {
            if (data.message === "true") {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            props.showAlert(data.message, "danger");
        }
    }

    const closeShowList = () => {
        setShowFollowing(null);
    }

    const likeAPost = async (postId) => {
        try {
            const response = await likePost(user[0]?.id, postId);
            const data = await response.json();

            if (data.success) {
                getPosts(userDetails.id);
                props.showAlert(data.message, "success");
            } else {
                console.error('Error liking a post:', data);
                props.showAlert(data.message, "danger");
            }
        } catch (error) {
            console.error('Error liking a post:', error);
        }
    };

    const dislikeAPost = async (postId) => {
        try {
            const response = await dislikePost(user[0]?.id, postId);
            const data = await response.json();

            if (data.success) {
                getPosts(userDetails.id);
                props.showAlert(data.message, "success");
            } else {
                console.error('Error disliking a post:', data);
                props.showAlert(data.message, "danger");
            }
        } catch (error) {
            console.error('Error disliking a post:', error);
        }
    };


    const checkLikes = async (postId) => {
        const response = await isLiked(user[0]?.id, postId);
        const data = await response.json();
        if (data.success) {
            if (data.message === "true") {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            props.showAlert("Some Internal Error occured! Please Refresh", 'danger');
        }
    }

    const download = async (postId, format, userName) => {
        try {
            const response = await downloadPost(user[0]?.id, postId, format);

            if (response.ok) {
                const blob = await response.blob();
                // const filename = getFilenameFromResponse(response);
                const filename = userName;

                // Create an anchor element
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;

                // Append the link to the body and trigger the click event
                document.body.appendChild(link);
                link.click();

                // Remove the link from the body
                document.body.removeChild(link);

                // Release the object URL
                window.URL.revokeObjectURL(link.href);
                getPosts(userDetails.id);
                props.showAlert("Image Downloaded successfully", "success");
            } else {
                console.error('Error downloading image:', response.statusText);
                props.showAlert("Error Downloading Image", "danger");

            }
        } catch (error) {
            console.error('Error fetching image:', error);
        }
    };

    const generateChatId = async(receiverId, senderId) => {
        const sortedIds = [receiverId, senderId].sort();
        const id = sortedIds.join('_');
        await setChatId(id);
    }

    const startChatting = () => {
        generateChatId(userDetails.id, user[0]?.id);
        navigate("/viewChats");
    }

    return (
        <>
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
            {!showProgress && <div className='container mx-3'>
                <Card sx={{ minWidth: 1125, minHeight: 600, display: 'flex', flexDirection: 'column' }}>
                    <CardContent style={{ maxWidth: '80%' }}>
                        <Grid container alignItems="center">
                            <Grid item xs={10}>
                                <CardHeader
                                    avatar={
                                        imageUrl === null ?
                                            <>
                                                <Avatar sx={{ fontSize: "40px", backgroundColor: "lightblue", color: "black", width: "80px", height: "80px", position: "relative" }} aria-label="recipe">
                                                    {initials}
                                                    {userDetails.status === "online" ?
                                                        <>
                                                            <div style={{
                                                                position: 'absolute',
                                                                bottom: 0,
                                                                right: 0,
                                                                top: '56px',
                                                                left: '50px',
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '50%',
                                                                backgroundColor: "green",
                                                                border: '2px solid white',
                                                            }} />
                                                        </>
                                                        :
                                                        <>
                                                        </>}
                                                </Avatar>
                                            </>
                                            :
                                            <Avatar sx={{ width: "80px", height: "80px", position: "relative" }} aria-label="recipe" >
                                                <img
                                                    src={imageUrl}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                    }}
                                                />
                                                {userDetails.status === "online" ?
                                                    <>
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            top: '56px',
                                                            left: '50px',
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: "green",
                                                            border: '2px solid white',
                                                        }} />
                                                    </>
                                                    :
                                                    <>
                                                    </>}
                                            </Avatar>
                                    }
                                    title={
                                        <div style={{ fontSize: "35px" }}>
                                            {userDetails.firstName + " " + userDetails.lastName}
                                        </div>
                                    }
                                    subheader={"Joined: " + formattedRequestDate}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {<><LocalOfferRoundedIcon />{userDetails.tagLine}</>}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <CardContent style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Paper onClick={fetchFollowerFriends} className="mx-3" sx={{ cursor: "pointer", width: "150px", height: "100px", fontSize: "30px", marginLeft: 'auto' }} >
                                        <div className="container text-center">
                                            {userDetails.numberOfFollowers}
                                            <br></br>
                                            Followers
                                        </div>
                                    </Paper>
                                    <Paper onClick={fetchFollowingFriends} sx={{ cursor: "pointer", width: "150px", height: "100px", fontSize: "30px", marginLeft: 'auto' }} >
                                        <div className="container text-center">
                                            {userDetails.numberOfFollowing}
                                            <br></br>
                                            Following
                                        </div>
                                    </Paper>
                                </CardContent>
                            </Grid>
                        </Grid>
                        <Divider className='my-3' sx={{ width: '1200px' }} />


                        <div className="container text-center" style={{ marginLeft: "60px" }}>
                            <Button variant="contained" sx={{ marginLeft: "30px", width: "200px" }} startIcon={<ChatIcon />} onClick={startChatting}> Message </Button>
                            {friend ? <></> :
                                <Button className='mx-3' variant="contained" sx={{ width: "200px" }} startIcon={<PersonAddIcon />} onClick={sendFriendRequest}> Add to Friend </Button>
                            }
                            {friend ? <Button className='mx-3' variant="contained" sx={{ width: "250px" }} startIcon={<VideocamIcon />}> Start a Video Call </Button> :
                                <Button variant="contained" sx={{ width: "250px" }} startIcon={<VideocamIcon />}> Start a Video Call </Button>}
                        </div>
                        <Divider className='my-3' sx={{ width: '1200px' }} />
                        <Typography>
                            <div className="container my-3 text-center">
                                {showFollowing !== null ? <>
                                    <h1> {showFollowing ? "Following List" : "Follower List"}
                                        <Tooltip title='Close'>
                                            <IconButton onClick={closeShowList}>
                                                <ClearRoundedIcon sx={{ fontSize: 40, cursor: "pointer" }} />
                                            </IconButton>
                                        </Tooltip>
                                    </h1>
                                </> :
                                    (<>
                                        {
                                            posts.length === 0 ?
                                                <>
                                                    <p className='text-center' style={{ color: "grey" }}>No posts to show!</p>
                                                </>
                                                : <div className="row my-3 mx-2">
                                                    {posts.map((post, index) => (
                                                        <ShowPostCard userCredentials={userDetails} download={download} checkLikes={checkLikes} likeAPost={likeAPost} dislikeAPost={dislikeAPost} key={index} userId={userDetails.id} posts={post} showAlert={props.showAlert} fetchSource={fetchSource} />
                                                    ))}
                                                </div>
                                        }
                                    </>)}
                            </div>
                            {showFollowing !== null ? showFollowing ? (
                                followingUserCredentials.length > 0 ?
                                    followingUserCredentials.map((userCredentials) => (
                                        <ShowFriendsCard checkFriend={checkFriend} showFollowing={showFollowing} userCredentials={userCredentials} key={userCredentials.id} />
                                    ))
                                    :
                                    <p className='text-center' style={{ color: "grey" }}>No Following list to show</p>
                            ) : (
                                followerUserCredentials.length > 0 ?
                                    followerUserCredentials.map((userCredentials) => (
                                        <ShowFriendsCard checkFriend={checkFriend} showFollowing={showFollowing} userCredentials={userCredentials} key={userCredentials.id} />
                                    ))
                                    :
                                    <p className='text-center' style={{ color: "grey" }}>No Followers list to show</p>
                            ) : (<></>)}
                        </Typography>

                    </CardContent>
                    <CardActions>
                        <Button variant="outlined" onClick={goToPrevious} startIcon={<FirstPageRoundedIcon />}> Return </Button>
                    </CardActions>
                </Card>
            </div>}
        </>
    );
};

export default ViewProfile;
