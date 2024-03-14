import React from 'react'
import ShowListOfUsers from './ShowListOfUsers'
import { useContext } from 'react';
import userContext from '../../context/User/UserContext';
import Accordion, { AccordionSlots } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Button, Divider, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';


const ShowLikes = (props) => {
    const context = useContext(userContext);
    const { postId, getPostById, fetchUserDetails } = context;
    const navigate = useNavigate();
    const { showProgress, setProgress, progress } = props;

    const [post, setPost] = useState({})
    const [likePressed, setLikePressed] = useState(true);
    const [listOfLikes, setListOfLikes] = useState([]);
    const [listOfDownloads, setListOfDownloads] = useState([]);
    const [likeUserData, setLikesUserData] = useState([])
    const [downloadUserData, setDownloadUserData] = useState([])

    useEffect(() => {
        const storedLikePressed = localStorage.getItem("likePressed") === "true"; // Convert to boolean
        console.log(storedLikePressed);
        setLikePressed(storedLikePressed);
        fetchPostById();
    }, []);

    useEffect(() => {
        fetchLikesUserDetail();
    }, [listOfLikes]);

    useEffect(() => {
        fetchDownloadUserDetail();
    }, [listOfDownloads]);

    const fetchData = async (id) => {
        setProgress(20);
        const userDetailPromise = await fetchUserDetails(id);
        setProgress(30);
        const userDetail = await userDetailPromise.json();
        setProgress(40);
        return userDetail;
    };

    const fetchLikesUserDetail = async () => {
        setProgress(10);
        const userDetailPromises = listOfLikes.map((userId) => fetchData(userId)).filter(Boolean);
        setProgress(50);
        const userDetails = await Promise.all(userDetailPromises);
        setProgress(80);
        if (userDetails) {
            const userData = userDetails.map((userDetail, index) => ({
                userCredentials: {
                    userName: userDetail.userName,
                    firstName: userDetail.firstName,
                    lastName: userDetail.lastName,
                    tagLine: userDetail.tagLine,
                    status: userDetail.status,
                    id: userDetail.id,
                    image: userDetail.profilePhoto,
                }
            }));
            setProgress(90);
            setLikesUserData(userData);
            console.log(userData);
        }
        setProgress(100);
    };

    const fetchDownloadUserDetail = async () => {
        setProgress(10);
        const userDetailPromises = listOfDownloads.map((userId) => fetchData(userId)).filter(Boolean);
        setProgress(50);
        const userDetails = await Promise.all(userDetailPromises);
        setProgress(80);
        if (userDetails) {
            const userData = userDetails.map((userDetail, index) => ({
                userCredentials: {
                    userName: userDetail.userName,
                    firstName: userDetail.firstName,
                    lastName: userDetail.lastName,
                    tagLine: userDetail.tagLine,
                    status: userDetail.status,
                    id: userDetail.id,
                    image: userDetail.profilePhoto,
                }
            }));
            setProgress(90);
            setDownloadUserData(userData);
            console.log(userData);
        }
        setProgress(100);
    };

    const fetchPostById = async () => {
        setProgress(10);
        const response = await getPostById(postId);
        setProgress(40);
        const data = await response.json();
        setProgress(70);
        if (data != null) {
            setPost(data);
            setListOfLikes(data.listOfUserLikes);
            setListOfDownloads(data.listOfDownloadUsers);
        }
        setProgress(100);
    }

    const returnToAccount = () => {
        navigate("/accountDetails");
    }

    return (
        <>
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
        <div className='mx-3 my-2' style={{ width: 1100 }}>
            <div className="container text-center">
                <h1> List of Users </h1>
            </div>
            <Divider className='my-3' />
            {!showProgress &&
                <>
                    {likePressed ? <Accordion expanded={likePressed} className='my-2'>
                        <AccordionSummary
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>
                                <h4>User Liked</h4>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {post.length === 0 || listOfLikes.length === 0 ?
                                    <p className=' text-center' style={{ color: "grey" }}> No users yet liked the post! </p>
                                    :
                                    <>
                                        {likeUserData.length > 0 ?
                                            <>
                                                {likeUserData.map((data, index) => (
                                                    <ShowListOfUsers key={index} user={data.userCredentials} likePressed={likePressed} />
                                                ))}
                                            </> :
                                            <p className=' text-center' style={{ color: "grey" }}> No users yet liked the post! </p>
                                        }
                                    </>
                                }
                            </Typography>
                        </AccordionDetails>
                    </Accordion> :
                        <Accordion expanded={!likePressed}>
                            <AccordionSummary
                                aria-controls="panel2-content"
                                id="panel2-header"
                            >
                                <Typography>
                                    <h4>User Downloaded</h4>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {post.length === 0 || listOfDownloads.length === 0 ?
                                        <p className=' text-center' style={{ color: "grey" }}> No users yet downloaded the post! </p>
                                        :
                                        <>
                                            {downloadUserData.length > 0 ?
                                                <>
                                                    {downloadUserData.map((data, index) => (
                                                        <ShowListOfUsers key={index} user={data.userCredentials} likePressed={likePressed} />
                                                    ))}
                                                </> :
                                                <p className=' text-center' style={{ color: "grey" }}> No users yet downloaded the post! </p>
                                            }
                                        </>
                                    }
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                }
            <Button className='my-2' variant="outlined" startIcon={<ArrowBackRoundedIcon />} onClick={returnToAccount}>Back</Button>
                </>
            }
        </div>
        </>
    )
}

export default ShowLikes
