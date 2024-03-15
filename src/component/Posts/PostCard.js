import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState, useEffect } from 'react';
import { Divider, Tooltip, useColorScheme } from '@mui/material';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

export default function PostCard(props) {
    const { userCredentials, download, postCredentials, fetchSource, checkLikes,dislikeAPost, formatTime, likeAPost } = props;

    const[postTime, setPostTime] = useState("");
    const[isLiked, setIsLiked] = useState(false);// set to check whether the post is liked or not
    const [imageUrl, setImageUrl] = useState(null);
    const [profile, setProfile] = useState(null);
    const initials = userCredentials.firstName.charAt(0).toUpperCase() + userCredentials.lastName.charAt(0).toUpperCase();
    const fetchTime = async(time) => {
        const data = await formatTime(time);
        setPostTime(data);
    }

    useEffect(() => {
        fetchTime(postCredentials.time);
        
    }, [postCredentials])

    useEffect(() => {
        fetchProfilePhoto();
    }, [userCredentials.profile]);

    useEffect(() => {
        if (profile !== null) {
            fetchProfileSource(profile);
        }
    }, [profile]);
    const fetchProfilePhoto = () => {
        setProfile(userCredentials.profile);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await checkLikes(postCredentials.id);
                setIsLiked(data);
            } catch (error) {
                console.error('Error checking likes:', error);
                setIsLiked(false); // Set to false in case of an error
            }
        };

        fetchData();
    }, [userCredentials, postCredentials]);


    const LikePost = async () => {
        try {
            await likeAPost(postCredentials.id);
            setIsLiked((prevIsLiked) => !prevIsLiked);
        } catch (error) {
            console.error('Error liking a post:', error);
        }
    };

    const DislikePost = async () => {
        try {
            await dislikeAPost(postCredentials.id);
            setIsLiked((prevIsLiked) => !prevIsLiked);
        } catch (error) {
            console.error('Error disliking a post:', error);
        }
    };

    const downloadImage = async() => {
        const mimeType = postCredentials.image.startsWith('/9j/') ? 'jpeg' : 'png';
        await download(postCredentials.id, mimeType, userCredentials.userName);
    }
    return (
        <Card sx={{ width: 500, maxHeight: 500}} className='my-3 text-center'>
            <CardHeader
            sx={{justifyContent: "left", textAlign: "left"}}
                avatar={
                    imageUrl === null ?
                        <>
                            <Avatar sx={{ backgroundColor: "lightblue", color: "black", position: "relative" }} aria-label="recipe">
                                {initials}
                                {userCredentials.status === "online" ?
                                    <>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            top: '26.5px',
                                            left: '26px',
                                            width: '11.5px',
                                            height: '11.5px',
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
                        <Avatar sx={{position: "relative" }} aria-label="recipe" >
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
                            {userCredentials.status === "online" ?
                                <>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        top: '26.5px',
                                        left: '26px',
                                        width: '11.5px',
                                        height: '11.5px',
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
                title={userCredentials.firstName + " " + userCredentials.lastName}
                subheader={"Posted : "+postTime}
            />
            <Divider />
            <CardMedia
                component="img"
                height="300px"
                width="100%"
                maxwidth="100%"
                image={fetchSource(postCredentials.image)}
                alt={postCredentials.description}
                sx={{
                    objectFit: 'contain',
                    objectPosition: 'top', 
                }}
            />
            <Divider />
            <CardContent sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '8px' }}>
                <Typography variant="body" color="white">
                    {postCredentials.description}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', color:"black" }}>
                {isLiked ? <Tooltip title="DisLike">
                    <IconButton onClick={DislikePost} >
                        <FavoriteRoundedIcon /> &nbsp;{postCredentials.likes}
                    </IconButton>
                </Tooltip> : <Tooltip title="Like">
                <IconButton onClick={LikePost} >
                        <FavoriteBorderRoundedIcon /> &nbsp;{postCredentials.likes}
                </IconButton>
                </Tooltip>}
                
                <Tooltip title='Download Image'>
                <IconButton onClick={downloadImage}>
                    <DownloadForOfflineRoundedIcon /> &nbsp; {postCredentials.downloadCount}
                </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}
