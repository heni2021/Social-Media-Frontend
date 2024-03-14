import React, { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import userContext from '../../context/User/UserContext';
import { Avatar, Badge, Card, CardContent, CardHeader, Chip, Divider, Grid, IconButton, LinearProgress, Menu, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material';
import ShowFriendsCard from './Cards/ShowFriendsCard';
import { useNavigate } from 'react-router-dom';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ShowPostCard from './Cards/ShowPostCard';
import FaceIcon from '@mui/icons-material/Face';
import HorizontalBar from './Cards/HorizontalBar';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';

const PersonalProfile = (props) => {
    const context = useContext(userContext);
    const { fetchUserDetails, isLiked, convertTime, fetchFollowing, fetchFollowers, logOut, user, unfollowFriend, setProfilePhoto, getUserDetails } = context;
    const { updateAccount, deleteAccount, setUser, isFriend, sendRequest, getAllPost, deletePost, updatePost } = context;
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
        emailAddress: '',
        profile:''
    });

    const [formattedRequestDate, setFormattedRequestDate] = useState("");
    const [followingUserCredentials, setFollowingUserCredentials] = useState({});
    const [followerUserCredentials, setFollowerUserCredentials] = useState({});
    const [showFollowing, setShowFollowing] = useState(null);
    const [posts, setPosts] = useState([]);
    const [imageUrl, setImageUrl] = useState(null);
    const [profile, setProfile] = useState(null);
    const { setProgress, progress, showProgress } = props;

    useEffect(() => {
        if (props.id) {
            setProgress(10);
            fetchData(props.id);
            setProgress(100);
            localStorage.setItem('previousLink', '/accountDetails');
        }
    }, [props.id]);

    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        fetchProfilePhoto();
        if (profile !== null) {
            fetchProfileSource(profile);
        }
    }, [profile]);
    const fetchProfilePhoto = async () => {
        const profile = user[0]?.profilePhoto;
        setProfile(profile);
    }

    const getPosts = async () => {
        setProgress(10);
        const response = await getAllPost(user[0]?.id);
        setProgress(40);
        const data = await response.json();
        setProgress(80);
        setPosts(data);
        setProgress(100);
    }


    const updateAPost = async (postId, image, description) => {
        setProgress(10);
        const response = await updatePost(user[0]?.id, postId, description, image);
        setProgress(60);
        const data = await response.json();
        if (data.success) {
            getPosts();
            setProgress(100);
            props.showAlert(data.message, "success");
        }
        else {
            props.showAlert(data.message, "danger");
        }
    }

    const deleteAPost = async (postId) => {
        setProgress(10);
        const response = await deletePost(user[0]?.id, postId);
        setProgress(60);
        const data = await response.json();
        if (data.success) {
            props.showAlert(data.message, "success");
            setProgress(100);
            getPosts();
        }
        else {
            props.showAlert(data.message, "danger");
        }
    }

    const fetchData = async (id) => {
        try {
            setProgress(60);
            const response = await fetchUserDetails(id);
            setProgress(70);
            const data = await response.json();
            setProgress(80);
            setUser([data]);
            setUserDetail({
                userName: data.userName,
                firstName: data.firstName,
                lastName: data.lastName,
                tagLine: data.tagLine,
                emailAddress: data.emailAddress,
                id: data.id,
                status: data.status,
                numberOfFollowers: data.followerId != null ? data.followerId.length : '0',
                numberOfFollowing: data.followingId != null ? data.followingId.length : '0',
                time: formatTime(data.creationDate),
                profile: data.profilePhoto
            });
        } catch (error) {
            setProgress(100);
            console.error('Failed to fetch user details:', error);
        }
    };

    const formatTime = async (time) => {
        try {
            setProgress(85);
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
    const fetchFollowingFriends = async () => {
        const response = await fetchFollowing(userDetails.id);
        await fetchData(user[0]?.id);
        const data = await response.json();
        setFollowingUserCredentials(data);
        setShowFollowing(true);
    }

    const fetchFollowerFriends = async () => {
        const response = await fetchFollowers(userDetails.id);
        await fetchData(user[0]?.id);
        const data = await response.json();
        setFollowerUserCredentials(data);
        setShowFollowing(false);
    }
    
    const navigate = useNavigate();

    const loggedOut = async (e) => {
        const response = await logOut(user[0].id);
        const data = await response.json();
        if (data.success) {
            localStorage.removeItem('authToken');
            props.showAlert("Logged Out Successfully!", "success");
            navigate("/login");
        }
        else {
            props.showAlert("Some Error Occured!", "danger");
        }
    }

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


    const unfollow = async (friendId) => {
        const response = await unfollowFriend(user[0]?.id, friendId);
        const data = await response.json();
        if (data.success) {
            props.showAlert(data.message, "success");
            const resp = await fetchFollowing(userDetails.id);
            const d = await resp.json();
            setFollowingUserCredentials(d);
            setShowFollowing(true);
        }
        else {
            props.showAlert(data.message, "danger");
        }
    }
    const ref = useRef(null);
    const refCloseUpdateModal = useRef(null);
    const deleteRefOpen = useRef(null);

    const [credentials, setCredentials] = useState({
        emailAddress: "",
        firstName: "",
        lastName: "",
        tagLine: "Hey there! I am using iChat Application",
        userName: ""
    });

    const initials = userDetails.firstName.charAt(0).toUpperCase() + userDetails.lastName.charAt(0).toUpperCase();
    const updateDetails = async () => {
        ref.current.click();
        setCredentials({
            emailAddress: userDetails.emailAddress,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            tagLine: userDetails.tagLine,
            userName: userDetails.userName
        });
    }

    const deleteConfimation = async () => {
        deleteRefOpen.current.click();
    }

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const update = async (e) => {
        // console.log("update is clicked!");
        refCloseUpdateModal.current.click();
        const response = await updateAccount(user[0]?.id, credentials.firstName, credentials.lastName, credentials.tagLine, credentials.userName);
        const data = await response.json();
        if (data.success) {
            props.showAlert(data.message, "success");
            fetchData(props.id);
            // setUser(userDetails);
        }
        else {
            props.showAlert(data.message, "danger");
        }
    }
    const refCloseDeleteModal = useRef(null);
    const deleteUserAccount = async (e) => {
        e.preventDefault();
        refCloseDeleteModal.current.click();
        const response = await deleteAccount(user[0]?.id);
        const data = await response.json();
        if (data.success) {
            props.showAlert(data.message, "success");
            localStorage.removeItem("authToken");
            localStorage.removeItem("previousLink");
            navigate("/login");
        }
        else {
            props.showAlert(data.message, "danger");
        }
    }

    const checkFriend = async (friendId) => {
        const response = await isFriend(user[0]?.id, friendId);
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
            props.showAlert(data.message, "danger");
        }
    }

    const sendFriendRequest = async (receiverId) => {
        const response = await sendRequest(user[0]?.id, receiverId);
        const data = await response.json();
        // console.log(data);
        if (data.success) {
            props.showAlert(data.message, "success");
        }
        else {
            props.showAlert(data.message, "danger");
        }

    }

    const closeShowList = () => {
        setShowFollowing(null);
        getPosts();
    }

    const fetchSource = (image) => {
        const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
        const url = `data:${mimeType};base64,${image}`;
        return url;
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


    const fileRef = useRef(null);
    const openFileManager = () => {
        fileRef.current.click();
    }
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Data = reader.result.split(",")[1]; // Extract base64 data from result
                const response = await setProfilePhoto(user[0]?.id, base64Data);
                const data = await response.json();
                if(data.success){
                    await getUserDetails();
                    await fetchProfilePhoto();
                    setImageUrl(reader.result); // Update the image URL in the state
                    props.showAlert('Profile uploaded successfully!', 'success');
                }
                else{
                    props.showAlert(data.message, "danger");
                }
            };

            reader.readAsDataURL(selectedFile); // Read file as data URL
        }
    }

    return (
        <>
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
            <input
                type='file'
                accept='.png, .jpg, .jpeg, .gif'
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
            {!showProgress && <div className='container mx-3'>
                <div className="modal fade" id="deleteAccountConfirmationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Delete Account?</h5>
                                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            </div>
                            <div className="modal-body text-center">
                                <p className='text-center' style={{ color: "red" }}>Are you sure you want to delete your account?</p>
                                {/* <br></br> */}
                                <p className='text-center' style={{ color: "grey" }}>This action can't be undone!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={deleteUserAccount}>Yes</button>
                                <button ref={refCloseDeleteModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" style={{ height: "450px" }} id="updateDetailModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ width: "500px" }}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Update Details</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div >
                                <TextField
                                    className='mx-2 my-2'
                                    id="outlined-required"
                                    label="First Name"
                                    name="firstName"
                                    required={true}
                                    value={credentials.firstName}
                                    onChange={handleChange}
                                />
                                <TextField
                                    className='mx-2 my-2'
                                    id="outlined-required"
                                    label="Last Name"
                                    name="lastName"
                                    required={true}
                                    value={credentials.lastName}
                                    onChange={handleChange}
                                />
                                <TextField
                                    className='mx-2 my-2'
                                    id="outlined-required"
                                    label="Email Address"
                                    name="emailAddress"
                                    // required={true}
                                    value={credentials.emailAddress}
                                    // onChange={handleChange}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                                <TextField
                                    className='mx-2 my-2'
                                    id="outlined-required"
                                    label="User Name"
                                    name="userName"
                                    value={credentials.userName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <TextField
                                    className='mx-2 my-2'
                                    sx={{ width: "460px" }}
                                    id="outlined-password-input"
                                    label="Tag Line"
                                    name="tagLine"
                                    value={credentials.tagLine}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="modal-footer">
                                <button ref={refCloseUpdateModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={update}>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Card sx={{ minWidth: 1140, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
                    <CardContent style={{ maxWidth: '80%' }}>
                        <Grid container alignItems="center">
                            <Grid item xs={10}>
                                <CardHeader
                                    avatar={
                                        imageUrl === null ?
                                            <>
                                                <Avatar sx={{ fontSize: "40px", backgroundColor: "lightblue", color: "black", width: "80px", height: "80px", position: "relative", cursor: "pointer" }} aria-label="recipe" onClick={openFileManager}>
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
                                            <Avatar sx={{ width: "80px", height: "80px", position: "relative", cursor: "pointer" }} aria-label="recipe" onClick={openFileManager}>
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
                                            <Chip sx={{ backgroundColor: "lightgreen" }} icon={<FaceIcon />} label={userDetails.userName} />
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
                                    <HorizontalBar updateDetails={updateDetails} deleteConfimation={deleteConfimation} loggedOut={loggedOut} />
                                </CardContent>
                            </Grid>
                        </Grid>

                        <Divider className='my-3' sx={{ width: '1200px' }} />
                        <Typography>
                            <div className="container my-3 text-center">

                                {showFollowing !== null ?
                                    <>
                                        <h1> {showFollowing ? "Following List" : "Follower List"}
                                            <Tooltip title='Close'>
                                                <IconButton onClick={closeShowList}>
                                                    <ClearRoundedIcon sx={{ fontSize: 40, cursor: "pointer" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </h1>
                                    </> : <>
                                        {
                                            posts.length === 0 ?
                                                <>
                                                    <p className='text-center' style={{ color: "grey" }}>No posts to show!</p>
                                                </>
                                                : <div className="row my-3 mx-2">
                                                    {posts.map((post, index) => (
                                                        <ShowPostCard key={index} userId={user[0]?.id} updateAPost={updateAPost} posts={post} showAlert={props.showAlert} fetchSource={fetchSource} deleteAPost={deleteAPost} checkLikes={checkLikes} />
                                                    ))}
                                                </div>
                                        }
                                    </>

                                }

                            </div>
                            {showFollowing !== null ? showFollowing ? (
                                followingUserCredentials.length > 0 ?
                                    followingUserCredentials.map((userCredentials) => (
                                        <ShowFriendsCard sendFriendRequest={sendFriendRequest} checkFriend={checkFriend} unfollow={unfollow} showFollowing={showFollowing} userCredentials={userCredentials} key={userCredentials.id} />
                                    ))
                                    :
                                    <p className='text-center' style={{ color: "grey" }}>No Following list to show</p>
                            ) : (
                                followerUserCredentials.length > 0 ?
                                    followerUserCredentials.map((userCredentials) => (
                                        <ShowFriendsCard sendFriendRequest={sendFriendRequest} checkFriend={checkFriend} unfollow={unfollow} showFollowing={showFollowing} userCredentials={userCredentials} key={userCredentials.id} />
                                    ))
                                    :
                                    <p className='text-center' style={{ color: "grey" }}>No Followers list to show</p>
                            ) : (<></>)}
                        </Typography>
                    </CardContent>
                    <button hidden={true} ref={ref} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateDetailModal">
                        Launch demo modal
                    </button>

                    <button hidden={true} ref={deleteRefOpen} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteAccountConfirmationModal">
                        Launch demo modal
                    </button>
                </Card>
                {/* </Badge> */}
            </div>}
        </>
    );
};

export default PersonalProfile;