import React, { useContext, useRef, useState } from 'react';
import BottomNavigationBar from '../BottomNavigation';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { LinearProgress, Paper, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import userContext from '../../context/User/UserContext';

const Post = (props) => {
    const context = useContext(userContext);
    const { addPost, user } = context;
    const {showProgress, progress, setProgress} = props;
    const fileRef = useRef(null);
    const deleteRefOpen = useRef(null);
    const refCloseDeleteModal = useRef(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [description, setDescription] = useState("");
    const [byteArray, setByteArray] = useState(null);

    const addNewPost = async (e) => {
        e.preventDefault();
        setProgress(10);
        const response = await addPost(user[0]?.id, description, byteArray);
        setProgress(40);
        const data = await response.json();
        setProgress(50);
        if (data.success) {
            setDescription("");
            setImageUrl(null);
            setProgress(100);
            props.showAlert(data.message, "success");
        }
        else {
            setProgress(100);
            props.showAlert(data.message, "danger");
        }
    }

    const AddImage = () => {
        if (!imageUrl) {
            fileRef.current.click();
        } else {
            props.showAlert("Image Already Uploaded!", "danger");
        }
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Data = reader.result.split(",")[1]; // Extract base64 data from result
                setByteArray(base64Data);
                setImageUrl(URL.createObjectURL(selectedFile));
                props.showAlert('Image uploaded successfully!', 'success');
            };

            reader.readAsDataURL(selectedFile); // Read file as data URL
        }
    };



    const handleOnChange = (event) => {
        setDescription(event.target.value);
    };

    const discardChanges = (event) => {
        event.preventDefault();
        refCloseDeleteModal.current.click();
        setDescription("");
        setImageUrl(null);
        props.showAlert("Changes Undone Successfully!", "success");
    };

    const confirmDiscard = (event) => {
        event.preventDefault();
        deleteRefOpen.current.click();
    };

    return (
        <div>
            <BottomNavigationBar value={"post"} showAlert={props.showAlert} />
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
            <input
                type='file'
                accept='.png, .jpg, .jpeg, .gif'
                ref={fileRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
            />
            {!showProgress && <>
                <div className="modal fade" id="deleteAccountConfirmationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Discard Changes?</h5>
                            </div>
                            <div className="modal-body text-center">
                                <p className='text-center' style={{ color: "red" }}>Are you sure you want to discard the changes?</p>
                                <p className='text-center' style={{ color: "grey" }}>This action can't be undone!</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={discardChanges}>Yes</button>
                                <button ref={refCloseDeleteModal} type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button hidden={true} ref={deleteRefOpen} type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteAccountConfirmationModal">
                    Launch demo modal
                </button>
                <div className='container text-center my-3'>
                    <Paper
                        elevation={3}
                        sx={{
                            minHeight: 400,
                            cursor: imageUrl ? 'not-allowed' : 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onClick={AddImage}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
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
                        ) : (
                            <>
                                <AddAPhotoIcon sx={{ fontSize: 30, marginTop: 20 }} />
                                <p className=' text-center' style={{ color: 'grey' }}>
                                    {' '}
                                    Browse Image{' '}
                                </p>
                            </>
                        )}
                    </Paper>
                    <TextField
                        className='my-4'
                        id='outlined-basic'
                        sx={{ width: 945 }}
                        label='Description'
                        variant='outlined'
                        onChange={handleOnChange}
                        value={description}
                    />

                    <Button
                        disabled={!imageUrl}
                        className='mx-2'
                        variant='outlined'
                        startIcon={<DeleteIcon />}
                        onClick={confirmDiscard}
                    >
                        Discard Changes
                    </Button>
                    <Button disabled={!imageUrl} variant='contained' endIcon={<SendIcon />} onClick={addNewPost}>
                        Add Post
                    </Button>
                </div>
            </>}
        </div>
    );
};

export default Post;