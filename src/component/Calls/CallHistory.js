import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BottomNavigationBar from '../BottomNavigation';
import CallDetailCard from './CallDetailCard';
import { useContext, useEffect, useState } from 'react';
import userContext from '../../context/User/UserContext';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton, LinearProgress, Tooltip } from '@mui/material';

export default function CallHistory(props) {
    const {progress, showProgress, setProgress} = props;
    const context = useContext(userContext);
    const { callHistory, fetchOutgoingCalls, fetchIncomingCalls } = context;
    const { clearIncomingCalls, clearOutgoingCallHistory, setOutgoingCallHistory, clearAllCalls } = context;
    const { fetchUserDetails, outgoingCallHistory, clearCallById, user, setCallHistory } = context;

    const [userCredentials, setUserCredentials] = useState([]);
    const [outUserCredentials, setOutUserCredentials] = useState([]);


    const fetchData = async (id) => {
        setProgress(20);
        const userDetailPromise = await fetchUserDetails(id);
        setProgress(25);
        const userDetail = await userDetailPromise.json();
        setProgress(35);
        return userDetail;
    };

    useEffect(() => {
        const fetchDataForCallHistory = async () => {
            setProgress(10);
            const userDetailPromises = callHistory.map((calls) => fetchData(calls.callerId)).filter(Boolean);
            setProgress(40);
            const userDetails = await Promise.all(userDetailPromises);
            setProgress(70);
            if (userDetails) {
                setProgress(80);
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
                    callDetails: {
                        time: callHistory[index].startTime,
                        endTime: callHistory[index].endTime,
                        id: callHistory[index].id
                    }
                }));
                setProgress(90);
                setUserCredentials(combinedData);
            }
            setProgress(100);
        };

        fetchDataForCallHistory();
    }, [callHistory]);


    useEffect(() => {
        const fetchOutgoingDataForCalls = async () => {
            setProgress(10);
            const userDetailPromises = outgoingCallHistory.map((calls) => fetchData(calls.receiverId)).filter(Boolean);
            setProgress(40);
            const userDetails = await Promise.all(userDetailPromises);
            setProgress(70);
            if (userDetails) {
                setProgress(80);
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
                    callDetails: {
                        time: outgoingCallHistory[index].startTime,
                        endTime: outgoingCallHistory[index].endTime,
                        id: outgoingCallHistory[index].id
                    }
                }));
                setProgress(90);
                setOutUserCredentials(combinedData);
                setProgress(100);
            }
        };

        fetchOutgoingDataForCalls();
    }, [outgoingCallHistory]);

    const deleteHistory = async (callId) => {
        setProgress(10);
        const response = await clearCallById(user[0]?.id, callId);
        setProgress(40);
        const data = await response.json();
        setProgress(60);
        if (data.success) {
            props.showAlert(data.message, "success");
            setProgress(70);
            const res = await fetchIncomingCalls(user[0]?.id);
            setProgress(80);
            const d = await res.json();
            setCallHistory(d);
            setProgress(90);
            const resp = await fetchOutgoingCalls(user[0]?.id);
            setProgress(94);
            const outData = await resp.json();
            setProgress(100);
            // console.log(outData);
            setOutgoingCallHistory(outData);
        }
        else {
            setProgress(70);
            props.showAlert(data.message, "danger");
            setProgress(100);
        }
    }

    const clearIncomingCallHistory = async () => {
        setProgress(10);
        const response = await clearIncomingCalls(user[0]?.id);
        setProgress(30);
        const data = await response.json();
        setProgress(40);
        if (data.success) {
            props.showAlert(data.message, "success");
            setProgress(50);
            const res = await fetchIncomingCalls(user[0]?.id);
            setProgress(70);
            const d = await res.json();
            setCallHistory(d);
            setProgress(80);
            const resp = await fetchOutgoingCalls(user[0]?.id);
            setProgress(95);
            const outData = await resp.json();
            setProgress(100);
            setOutgoingCallHistory(outData);
        }
        else {
            setProgress(70);
            props.showAlert(data.message, "danger");
            setProgress(100);
        }
    }

    const clearOutgoingCalls = async () => {
        setProgress(10);
        const response = await clearOutgoingCallHistory(user[0]?.id);
        setProgress(30);
        const data = await response.json();
        setProgress(40);
        if (data.success) {
            props.showAlert(data.message, "success");
            setProgress(50);
            const res = await fetchIncomingCalls(user[0]?.id);
            setProgress(70);
            const d = await res.json();
            setCallHistory(d);
            setProgress(80);
            const resp = await fetchOutgoingCalls(user[0]?.id);
            setProgress(95);
            const outData = await resp.json();
            setProgress(100);
            setOutgoingCallHistory(outData);
        }
        else {
            setProgress(70);
            props.showAlert(data.message, "danger");
            setProgress(100);
        }
    }

    const clearAllHistory = async () => {
        setProgress(10);
        const response = await clearAllCalls(user[0]?.id);
        setProgress(30);
        const data = await response.json();
        setProgress(40);
        if (data.success) {
            props.showAlert(data.message, "success");
            setProgress(50);
            const res = await fetchIncomingCalls(user[0]?.id);
            setProgress(70);
            const d = await res.json();
            setCallHistory(d);
            setProgress(80);
            const resp = await fetchOutgoingCalls(user[0]?.id);
            setProgress(95);
            const outData = await resp.json();
            setProgress(100);
            setOutgoingCallHistory(outData);
        }
        else {
            setProgress(70);
            props.showAlert(data.message, "danger");
            setProgress(100);
        }
    }

    return (
        <div>
            <BottomNavigationBar showAlert={props.showAlert} value={"Calls"}/>
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
            {!showProgress && <>
                <div className="container text-center my-3">
                    <h1>Call History Details
                        <Tooltip title="Clear All History">
                            <IconButton className='me md-3' onClick={() => { clearAllHistory() }}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </h1>
                </div>
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
                                        Incoming Call History
                                        <Tooltip title="Clear Incoming History">
                                            <IconButton onClick={() => { clearIncomingCallHistory() }}>
                                                <ClearAllIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </h4>
                                </strong>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {userCredentials.length > 0 ? userCredentials.map((data, index) => (
                                    <CallDetailCard
                                        key={index}
                                        userCredentials={data.userCredentials}
                                        time={data.callDetails.time}
                                        endTime={data.callDetails.endTime}
                                        incoming={true}
                                        id={data.callDetails.id}
                                        showAlert={props.showAlert}
                                        deleteHistory={deleteHistory}
                                    />
                                )) : <p className=' text-center' style={{ color: "grey" }}> No incoming calls to display </p>}
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
                                        Outgoing Call History
                                        <Tooltip title="Clear Outgoing History">
                                            <IconButton onClick={() => { clearOutgoingCalls() }}>
                                                <ClearAllIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </h4>
                                </strong>
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {outUserCredentials.length > 0 ? outUserCredentials.map((data, index) => (
                                    <CallDetailCard
                                        key={index}
                                        userCredentials={data.userCredentials}
                                        time={data.callDetails.time}
                                        endTime={data.callDetails.endTime}
                                        incoming={false}
                                        id={data.callDetails.id}
                                        showAlert={props.showAlert}
                                        deleteHistory={deleteHistory}
                                    />
                                )) : <p className=' text-center' style={{ color: "grey" }}>No outgoing calls to show</p>}
                                {/* {} */}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </div>
            </> } 
        </div>
    );
}
