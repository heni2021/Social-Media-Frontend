import React from 'react'
import BottomNavigationBar from '../BottomNavigation'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext } from 'react';
import userContext from '../../context/User/UserContext';
import { useState } from 'react';
import FriendRequestDetail from './FriendRequestDetail'
import { useEffect } from 'react';
import { LinearProgress } from '@mui/material';


const FriendRequest = (props) => {
    const context = useContext(userContext);
    const { incomingFriendRequest, outgoingFriendRequest, fetchUserDetails, acceptFriendRequest, setIncomingFriendRequest } = context;
    const { ignoreFriendRequest, cancelFriendRequest, user, fetchIncomingFriendRequest, fetchOutgoingFriendRequest } = context;
    const { setOutgoingFriendRequest, friendRef } = context;
    const { showProgress, setProgress, progress } = props;

    const [userCredentials, setUserCredentials] = useState([]);
    const [outUserCredentials, setOutUserCredentials] = useState([]);

    useEffect(() => {
        friendRef.current.click();
    }, []);

    const fetchData = async (id) => {
        setProgress(20);
        const userDetailPromise = await fetchUserDetails(id);
        setProgress(30);
        const userDetail = await userDetailPromise.json();
        setProgress(35);
        return userDetail;
    };

    useEffect(() => {
        const fetchPendingRequest = async () => {
            setProgress(10);
            const userDetailPromises = incomingFriendRequest.map((friendRequests) => fetchData(friendRequests.senderId));
            setProgress(40);
            const userDetails = await Promise.all(userDetailPromises);
            setProgress(60);
            const combinedData = userDetails.map((userDetail, index) => ({
                userCredentials: {
                    userName: userDetail.userName,
                    firstName: userDetail.firstName,
                    lastName: userDetail.lastName,
                    tagLine: userDetail.tagLine,
                    status: userDetail.status,
                    id: userDetail.id,
                    profile: userDetail.profilePhoto
                },
                requestDetails: {
                    time: incomingFriendRequest[index].requestDate,
                },
            }));
            setProgress(90);
            setUserCredentials(combinedData);
            setProgress(100);
        }

        fetchPendingRequest();
    }, [incomingFriendRequest]);

    useEffect(() => {
        const fetchSentRequest = async () => {
            setProgress(10);
            const userDetailPromises = await outgoingFriendRequest.map((friendRequests) => fetchData(friendRequests.receiverId));
            setProgress(40);
            const userDetails = await Promise.all(userDetailPromises);
            setProgress(60)
            const combinedData = userDetails.map((userDetail, index) => ({
                userCredentials: {
                    userName: userDetail.userName,
                    firstName: userDetail.firstName,
                    lastName: userDetail.lastName,
                    tagLine: userDetail.tagLine,
                    status: userDetail.status,
                    id: userDetail.id,
                    profile: userDetail.profilePhoto
                },
                requestDetails: {
                    time: outgoingFriendRequest[index].requestDate,
                },
            }));
            setProgress(90);
            setOutUserCredentials(combinedData);
            setProgress(100);
        };

        fetchSentRequest();
    }, [outgoingFriendRequest]);

    const cancelRequest = async (receiverId) => {
        setProgress(20);
        const response = await cancelFriendRequest(user[0]?.id, receiverId);
        setProgress(40);
        const data = await response.json();
        setProgress(50);
        if (data.success) {
            setProgress(60);
            const resp = await fetchIncomingFriendRequest(user[0]?.id);
            setProgress(70);
            const r_data = await resp.json();
            setProgress(75);
            setIncomingFriendRequest(r_data);
            setProgress(80);
            const respo = await fetchOutgoingFriendRequest(user[0]?.id);
            setProgress(90);
            const d = await respo.json();
            setProgress(100);
            setOutgoingFriendRequest(d);
            props.showAlert(data.message, 'success');
        }
        else {
            setProgress(100);
            props.showAlert(data.message, 'danger');
        }
    }

    const ignoreRequest = async (receiverId) => {
        setProgress(20);
        const response = await ignoreFriendRequest(user[0]?.id, receiverId);
        setProgress(40);
        const data = await response.json();
        setProgress(50);
        if (data.success) {
            setProgress(60);
            const resp = await fetchIncomingFriendRequest(user[0]?.id);
            setProgress(70);
            const r_data = await resp.json();
            setProgress(75);
            setIncomingFriendRequest(r_data);
            setProgress(80);
            const respo = await fetchOutgoingFriendRequest(user[0]?.id);
            setProgress(90);
            const d = await respo.json();
            setProgress(100);
            setOutgoingFriendRequest(d);
            props.showAlert(data.message, 'success');
        }
        else {
            setProgress(100);
            props.showAlert(data.message, 'danger');
        }
    }

    const acceptRequest = async (receiverId) => {
        setProgress(20);
        const response = await acceptFriendRequest(user[0]?.id, receiverId);
        setProgress(40);
        const data = await response.json();
        setProgress(50);
        if (data.success) {
            setProgress(60);
            const resp = await fetchIncomingFriendRequest(user[0]?.id);
            setProgress(70);
            const r_data = await resp.json();
            setProgress(75);
            setIncomingFriendRequest(r_data);
            setProgress(80);
            const respo = await fetchOutgoingFriendRequest(user[0]?.id);
            setProgress(90);
            const d = await respo.json();
            setProgress(100);
            setOutgoingFriendRequest(d);
            props.showAlert(data.message, 'success');
        }
        else {
            props.showAlert(data.message, 'danger');
        }
    }

    return (
        <div>
            <BottomNavigationBar showAlert={props.showAlert} value={"friendRequests"} />
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
            <div className="container text-center my-3">
                <h1>
                    View Requests
                </h1>
            </div>
            {!showProgress && <>
                <div className='my-3' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Accordion defaultExpanded sx={{ width: '1100px' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography className='text-center'>
                                <strong>
                                    <h4>
                                        Pending Requests
                                    </h4>
                                </strong>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {userCredentials.length > 0 ? userCredentials.map((data, index) => (
                                    <FriendRequestDetail
                                        key={index}
                                        userCredentials={data.userCredentials}
                                        requestDate={data.requestDetails.time}
                                        sentRequest={false}
                                        cancelRequest={cancelRequest}
                                        ignoreRequest={ignoreRequest}
                                        acceptRequest={acceptRequest}
                                    />
                                )) : <p className=' text-center' style={{ color: "grey" }}> No requests pending! </p>}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Accordion sx={{ width: '1100px' }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography className='text-center' style={{ alignItems: "center" }}>
                                <strong>
                                    <h4>
                                        Sent Requests
                                    </h4>
                                </strong>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {outUserCredentials.length > 0 ? outUserCredentials.map((data, index) => (
                                    <FriendRequestDetail
                                        key={index}
                                        userCredentials={data.userCredentials}
                                        requestDate={data.requestDetails.time}
                                        sentRequest={true}
                                        cancelRequest={cancelRequest}
                                        ignoreRequest={ignoreRequest}
                                        acceptRequest={acceptRequest}
                                    />
                                )) : <p className=' text-center' style={{ color: "grey" }}> No requests pending! </p>}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </>}
        </div>
    )
}

export default FriendRequest
