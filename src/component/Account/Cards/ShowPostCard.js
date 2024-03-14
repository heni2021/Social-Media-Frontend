import { Badge, Chip, IconButton, Menu, MenuItem, Paper, TextField, Tooltip, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import FirstPageOutlinedIcon from '@mui/icons-material/FirstPageOutlined';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { useRef } from 'react';
import userContext from '../../../context/User/UserContext';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';
import ChangeCircleRoundedIcon from '@mui/icons-material/ChangeCircleRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useNavigate } from 'react-router-dom';
const ShowPostCard = (props) => {
    const { posts, fetchSource, deleteAPost, updateAPost, userCredentials, userId, download, likeAPost, dislikeAPost, checkLikes } = props;
    const [isFlipped, setFlipped] = useState(false);

    const deletePostOpen = useRef(null);
    const closeDeletePost = useRef(null);
    const updatePostOpen = useRef(null);
    const updatePostClose = useRef(null);
    const fileRef = useRef(null);
    const flipPage = useRef(null);

    const [postTime, setPostTime] = useState("");
    const [newImageUrl, setNewImageUrl] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [byteArray, setByteArray] = useState(null);
    const [desc, setDesc] = useState(posts.description);
    const context = useContext(userContext);
    const { convertTime, user, setPostId } = context;
    const navigate = useNavigate();

    useEffect(() => {
        const convertOldTime = async (time) => {
            try {
                const response = await convertTime(time);
                const data = await response.text();
                setPostTime(data);
            } catch (error) {
                console.error('Error converting time:', error);
                setPostTime("Error");
            }
        }

        convertOldTime(posts.postingDate);
    }, [posts]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await checkLikes(posts.id);
                setIsLiked(data);
            } catch (error) {
                console.error('Error checking likes:', error);
                setIsLiked(false); // Set to false in case of an error
            }
        };

        fetchData();
    }, [posts, userId])


    const openPostDetails = (event) => {
        const isMoreIconClicked = event.target.closest('.MoreVertOutlinedIcon');
        if (isMoreIconClicked) {
            return;
        }
        if (!isFlipped) {
            setFlipped(true);
        }
    };

    const fetchSourceUrl = (image) => {
        const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
        const url = `data:${mimeType};base64,${image}`;
        setNewImageUrl(url);
    }

    const updatePost = async (popupState) => {
        fetchSourceUrl(posts.image);
        popupState.close();
        updatePostOpen.current.click();
    }

    const updatePostAgreed = async () => {
        console.log("Post updated!");
        updatePostClose.current.click();
        updateAPost(posts.id, byteArray, desc);
        flipPage.current.click();
    }

    const deletePost = async (popupState) => {
        popupState.close();
        deletePostOpen.current.click();
    }

    const postDelete = () => {
        closeDeletePost.current.click();
        deleteAPost(posts.id);
    }

    const AddImage = () => {
        fileRef.current.click();
    };

    const handleOnChange = (event) => {
        setDesc(event.target.value);
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1]; // Extract base64 data from result
                setByteArray(base64Data);
                setNewImageUrl(URL.createObjectURL(selectedFile));
                props.showAlert('Image uploaded successfully!', 'success');
            };

            reader.readAsDataURL(selectedFile); // Read file as data URL
        }
    };

    const changeDescription = () => {
        setDesc(posts.description);
    }


    const LikePost = async () => {
        try {
            const isSuccess = await likeAPost(posts.id);
            setIsLiked((prevIsLiked) => !prevIsLiked);
        } catch (error) {
            console.error('Error liking a post:', error);
        }
    };

    const DislikePost = async () => {
        try {
            await dislikeAPost(posts.id);
            setIsLiked((prevIsLiked) => !prevIsLiked);
        } catch (error) {
            console.error('Error disliking a post:', error);
        }
    };

    const downloadImage = async () => {
        const mimeType = posts.image.startsWith('/9j/') ? 'jpeg' : 'png';
        // console.log("Download Homepage called!");
        await download(posts.id, mimeType, userCredentials.userName);
    }

    const showLikeUser = () => {
        setPostId(posts.id);
        localStorage.setItem("likePressed", "true");
        navigate("/showUser");
    }

    const showDownloadUser = () => {
        setPostId(posts.id);
        localStorage.setItem("likePressed", "false");
        navigate("/showUser");
    }

    return (
        <>
            <input
                type='file'
                accept='.png, .jpg, .jpeg, .gif'
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
            <div className="modal fade" id={`updatePostModal_${posts.id}`} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update Post</h5>
                        </div>
                        <div className="modal-body text-center">
                            <div>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        minHeight: 400,
                                        cursor: 'not-allowed',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <img
                                        src={newImageUrl}
                                        alt='Selected'
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
                                </Paper>
                            </div>
                            <Tooltip title='Change Image'>
                                <IconButton sx={{ cursor: "pointer", fontSize: 30 }} onClick={AddImage}>
                                    <ChangeCircleRoundedIcon />
                                </IconButton>
                            </Tooltip>
                            <TextField
                                className='my-4'
                                id='outlined-basic'
                                sx={{ width: 445 }}
                                label='Description'
                                variant='outlined'
                                onChange={handleOnChange}
                                value={desc}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={updatePostAgreed}>Update</button>
                            <button ref={updatePostClose} type="button" onClick={changeDescription} className="btn btn-secondary" data-bs-dismiss="modal">Discard Changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="deletePostConfirmationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Delete Post?</h5>
                        </div>
                        <div className="modal-body text-center">
                            <p className='text-center' style={{ color: "red" }}>Are you sure you want to delete post?</p>
                            <p className='text-center' style={{ color: "grey" }}>This action can't be undone!</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={postDelete}>Yes</button>
                            <button ref={closeDeletePost} type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>
            <button hidden={true} ref={deletePostOpen} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deletePostConfirmationModal">
                Launch demo modal
            </button>
            <button hidden={true} ref={updatePostOpen} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#updatePostModal_${posts.id}`}>
                Launch demo modal
            </button>
            <div className='col-md-3 my-2 mx-4'>
                <Paper
                    elevation={2}
                    className={`post-card ${isFlipped ? 'flipped' : ''}`}
                    onClick={openPostDetails}
                    sx={{
                        width: '250px',
                        height: '200px',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        margin: '0 8px',
                        transition: 'transform 0.5s',
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    <div
                        className="front-content"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backfaceVisibility: 'hidden',
                            display: isFlipped ? 'none' : 'block',
                        }}
                    >
                        <img
                            alt={"Here comes your post - " + posts.description}
                            src={fetchSource(posts.image)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                position: 'relative',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backfaceVisibility: 'hidden',
                            }}
                        />
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '8px',
                                background: 'rgba(0, 0, 0, 0.7)',
                                color: 'white',
                                transform: 'translateZ(1px)', // Prevent flickering on Safari
                            }}
                        >

                            <Typography variant="body2" sx={{
                                color: "white"
                            }}>
                                <Chip sx={{ color: "white" }} icon={<UpdateRoundedIcon color='white' />} label={postTime} backgroundcolor='white' />
                            </Typography>

                        </div>
                    </div>
                    <div
                        className="back-content"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'white',
                            color: 'black',
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'visible', // Set to visible
                            display: isFlipped ? 'block' : 'none',
                        }}
                    >
                        <div style={
                            {
                                position: 'absolute',
                                left: 0
                            }
                        }>
                            <Tooltip ref={flipPage} title='Flip to Image' onClick={() => setFlipped(false)}>
                                <IconButton>
                                    <FirstPageOutlinedIcon /> &nbsp;
                                </IconButton>
                            </Tooltip>
                        </div>
                        {userId === user[0]?.id ?
                            <>
                                <div style={
                                    {
                                        position: 'absolute',
                                        right: 0
                                    }
                                }>
                                    <PopupState variant="popover" popupId="demo-popup-menu">
                                        {(popupState) => (
                                            <React.Fragment>
                                                <Tooltip title='More Options' variant="contained" >
                                                    <IconButton {...bindTrigger(popupState)}>
                                                        <MoreVertOutlinedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Menu {...bindMenu(popupState)}>
                                                    <MenuItem onClick={() => { updatePost(popupState) }}>Edit Post</MenuItem>
                                                    <MenuItem onClick={() => { deletePost(popupState) }}>Delete Post</MenuItem>
                                                </Menu>
                                            </React.Fragment>
                                        )}
                                    </PopupState>
                                </div>
                            </>
                            :
                            <></>
                        }

                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: 'center',
                                padding: '80px 0',
                            }}
                        >
                            {posts.description}
                        </Typography>

                        {userId === user[0]?.id ?
                            <>
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        padding: '8px',
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        transform: 'translateZ(1px)', // Prevent flickering on Safari
                                    }}
                                >
                                    <Typography variant="body2">
                                        <Tooltip title='Likes'>
                                            <IconButton sx={{ color: "white" }} onClick={showLikeUser}>
                                                <FavoriteBorderOutlinedIcon /> &nbsp; {posts.likesCount}
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>

                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        padding: '8px',
                                        background: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        transform: 'translateZ(1px)', // Prevent flickering on Safari
                                    }}>
                                    <Typography>
                                        <Tooltip title='Downloads'>
                                            <IconButton sx={{ color: "white" }} onClick={showDownloadUser}>
                                                <DownloadForOfflineRoundedIcon /> &nbsp; {posts.downloadsCount}
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                </div>
                            </>
                            :
                            <>
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        padding: '8px',
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        transform: 'translateZ(1px)', // Prevent flickering on Safari
                                    }}
                                >
                                    <Typography variant="body2">
                                        {isLiked ? <Tooltip title="DisLike">
                                            <IconButton onClick={DislikePost} sx={{ color: "white" }}>
                                                <FavoriteRoundedIcon /> &nbsp;{posts.likesCount}
                                            </IconButton>
                                        </Tooltip> : <Tooltip title="Like">
                                            <IconButton onClick={LikePost} sx={{ color: "white" }} >
                                                <FavoriteBorderRoundedIcon /> &nbsp;{posts.likesCount}
                                            </IconButton>
                                        </Tooltip>}
                                    </Typography>

                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        padding: '8px',
                                        background: 'rgba(0, 0, 0, 0.6)',
                                        color: 'white',
                                        transform: 'translateZ(1px)', // Prevent flickering on Safari
                                    }}>
                                    <Typography>
                                        <Tooltip title='Download Image'>
                                            <IconButton onClick={downloadImage} sx={{ color: "white" }}>
                                                <DownloadForOfflineRoundedIcon /> &nbsp; {posts.downloadsCount}
                                            </IconButton>
                                        </Tooltip>
                                    </Typography>
                                </div></>}

                    </div>
                </Paper>
            </div>
        </>
    );
};

export default ShowPostCard;