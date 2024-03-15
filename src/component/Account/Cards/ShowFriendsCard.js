import React, { useContext, useEffect } from 'react'
import { Avatar, Card, CardActions, CardContent, CardHeader, Grid, Icon, IconButton, Tooltip, Typography} from '@mui/material';
import { useState } from 'react';
import userContext from '../../../context/User/UserContext';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';

const ShowFriendsCard = (props) => {
    const { userCredentials, showFollowing, unfollow, checkFriend, sendFriendRequest } = props;  
    const [formattedRequestDate, setFormattedRequestDate] = useState("");    
    const context = useContext(userContext);
    const { convertTime, user } = context;
    const [imageUrl, setImageUrl] = useState(null);
    const [profile, setProfile] = useState(null);

    const [isFriend, setIsFriend] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const friend = await checkFriend(userCredentials.id);
            setIsFriend(friend);
        };
        fetchData();
        fetchProfilePhoto();
    }, [userCredentials.id]);

    const formatTime = async (time) => {
        try {
            const response = await convertTime(time);
            const data = await response.text();
            setFormattedRequestDate(data);
        } catch (error) {
            setFormattedRequestDate("Error");
        }
    }
    useEffect(() => {
        formatTime(userCredentials.creationDate);
    }, [userCredentials.creationDate]);

    const initials = userCredentials.firstName.charAt(0).toUpperCase() + userCredentials.lastName.charAt(0).toUpperCase();
    const status = userCredentials.status.toLowerCase();

    const navigate = useNavigate();
    const showProfile = () => {
        localStorage.setItem('userId', userCredentials.id);
        navigate("/view");
    }

    const unFollowFriend = () => {
        unfollow(userCredentials.id);
    }
    
    const sendRequest = async () => {
        await sendFriendRequest(userCredentials.id);
        const friend = await checkFriend(userCredentials.id);
        setIsFriend(friend);
    }

    useEffect(() => {
        if (profile !== null) {
            fetchProfileSource(profile);
        }
    }, [profile]);
    const fetchProfilePhoto = () => {
        setProfile(userCredentials.profilePhoto);
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
    return (
        <div className='my-2'>
            <Card sx={{minWidth: "1100px"}}>
                <CardContent>
                    <Grid container alignItems="center">
                        <Grid item xs={10}>
                            <CardHeader
                                avatar={
                                    imageUrl === null ?
                                        <>
                                            <Avatar sx={{ backgroundColor: "lightblue", color: "black", position: "relative" }} aria-label="recipe">
                                                {initials}
                                                {status === "online" ?
                                                    <>
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            right: 0,
                                                            top: '45px',
                                                            left: '43px',
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
                                        <Avatar sx={{ position: "relative" }} aria-label="recipe" >
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
                                            {status === "online" ?
                                                <>
                                                    <div style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                        top: '45px',
                                                        left: '43px',
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
                                    <>
                                        <h5>{userCredentials.firstName + " " + userCredentials.lastName}</h5>
                                    </>
                                }
                                subheader={"Joined at: "+formattedRequestDate}
                            />
                            <Typography>
                                {<><LocalOfferRoundedIcon />{userCredentials.tagLine}</>}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <CardActions>
                                {userCredentials.id !== user[0]?.id ? (
                                    <>
                                        {!isFriend && (
                                            // Render the PersonAddIcon only if checkFriend returns false
                                            <Tooltip title='Add Friend'>
                                                <IconButton onClick={sendRequest}>
                                                    <PersonAddIcon sx={{ fontSize: "30px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title='Show Profile'>
                                            <IconButton onClick={showProfile}>
                                                <VisibilityRoundedIcon sx={{ fontSize: "30px" }} />
                                            </IconButton>
                                        </Tooltip>
                                        {showFollowing && (
                                            <Tooltip title='Unfollow'>
                                                <IconButton onClick={unFollowFriend}>
                                                    <PersonRemoveRoundedIcon sx={{ fontSize: "30px" }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </>
                                ) : null}
                            </CardActions>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </div>
    )
}

export default ShowFriendsCard;
