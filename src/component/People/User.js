import React, { useContext, useEffect, useRef, useState } from 'react';
import BottomNavigationBar from '../BottomNavigation';
import userContext from '../../context/User/UserContext';
import UserDetailCard from './UserDetailCard';
import { Box, Button, Divider, FormControl, FormControlLabel, IconButton, LinearProgress, Radio, RadioGroup, TextField, Tooltip, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import LoopIcon from '@mui/icons-material/Loop';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';

const User = (props) => {
  const { showProgress, progress, setProgress } = props;
  const context = useContext(userContext);
  const { userDetail, fetchTimeInFormat, fetchOtherFriends, sendRequest, user, setUserDetail, peopleRef, placeRandomVideoCall, startCall, setRoomId, setReceiverDetails, fetchUserDetails, startVoiceCall } = context;
  const [creationDates, setCreationDates] = useState([]);
  const [selectedValue, setSelectedValue] = useState('Video Call')
  const [callee, setCallee] = useState({});
  const [isFirstClick, setIsFirstClick] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading status

  useEffect(() => {
    peopleRef.current.click();
  }, []);

  useEffect(() => {
    fetchDataForUsers();
  }, [userDetail]);

  const fetchDataForUsers = async () => {
    try {
      setProgress(20);
      const dates = await Promise.allSettled(
        userDetail.map(async (userData) => {
          try {
            return { id: userData.id, time: userData.creationDate };
          } catch (error) {
            console.error("Error fetching time:", error);
            return { id: userData.id, time: "" };
          }
        })
      );
      setProgress(30);

      setCreationDates(
        dates
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value)
      );
    } catch (error) {
      console.error("Error fetching data for users:", error);
    }
    setProgress(100);
  };

  const sendFriendRequest = async (receiverId) => {
    setProgress(0);
    const response = await sendRequest(user[0]?.id, receiverId);
    setProgress(10);
    const data = await response.json();
    setProgress(40);
    if (data.success) {
      setProgress(60);
      const res = await fetchOtherFriends(user[0]?.id);
      setProgress(80);
      const d = await res.json();
      if (d.length > 0) {
        setUserDetail(d);
        setProgress(100);
        props.showAlert(data.message, "success");
      } else {
        setUserDetail(d);
        props.showAlert(data.message, "success");
      }
      setProgress(100);
    }
    else {
      props.showAlert(data.message, "danger");
    }
  }

  const convertTime = async (id) => {
    const convertedTime = await fetchTimeInFormat(id);
    return convertedTime;
  }

  const navigate = useNavigate();
  const goToPeople = () => {
    navigate("/search");
  }

  const openModalRef = useRef(null);
  const closeModalRef = useRef(null);

  const openModelForGeneratingRandomId = () => {
    setCallee({});
    setLoading(false);
    openModalRef.current.click();
  }

  const handleCallTypeChange = (event) => {
    setSelectedValue(event.target.value);
  }

  const generateRandomCalleee = async (event) => {
    event.stopPropagation();
    setIsFirstClick(true);
    setLoading(true); // Start loading
    const response = await placeRandomVideoCall(user[0]?.id);
    console.log(response);
    const data = await response.json();
    // console.log("DATA : ",data);
    if (data!==null) {
      setCallee(data);
    }
    setLoading(false); // Stop loading
  }

  const startVideoCall = async() => {
    await closeModalRef.current.click();
    const userName = callee.firstName + " " + callee.lastName;
    localStorage.setItem("Name", userName);
    const response = await startCall(user[0]?.id, callee.id, "false");
    const data = await response.json();
    if (data.success) {
      await setRoomId(data.roomId);
      await setReceiverDetails(callee);
      navigate("/videoCall");
    }
    else {
      props.showAlert(data.message, "danger");
    }
  }

  const startAVoiceCall = async () => {
    await closeModalRef.current.click();
    const callerName = callee.firstName + " " + callee.lastName;
    localStorage.setItem("Caller Name", callerName);
    const response = await startVoiceCall(user[0]?.id, callee.id);
    const data = await response.json();
    if (data.success) {
      await setRoomId(data.roomId);
      await setReceiverDetails(callee);
      navigate("/voice/call");
    }
    else {
      props.showAlert(data.message, "danger");
    }
  }
  const name = user[0]?.firstName + " " + user[0]?.lastName;
  return (
    <>
      <BottomNavigationBar showAlert={props.showAlert} value={"people"} />
      {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
      {userDetail.length > 0 ? <div className="container my-3 text-center">
        <h1> Recommendations
        </h1>
      </div> : <></>}

      <button ref={openModalRef} hidden type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#generateRandomVideoID">
        Launch demo modal
      </button>
      <Button sx={{ position: 'absolute', top: 136, right: 5 }} variant='outlined' color='primary' onClick={openModelForGeneratingRandomId} endIcon={<LoopIcon />} >Place a Random Call</Button>
      <div class="modal fade" id="generateRandomVideoID" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Place Random Call</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {
                setIsFirstClick(false)
                setCallee({});
              }}></button>
            </div>
            <div class="modal-body">
              <Divider />
              <div className='text-center'>
                <FormControl>
                  <RadioGroup row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    onChange={handleCallTypeChange}
                    value={selectedValue}>
                    <FormControlLabel value='Video Call' control={<Radio />} label='Video Call' />
                    <FormControlLabel value='Voice Call' control={<Radio />} label='Voice Call' />
                  </RadioGroup>
                </FormControl>
              </div>
              <Divider />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TextField
                  className='my-3'
                  id="outlined-required"
                  label="Your Name"
                  name="userName"
                  value={name}
                  InputProps={{
                    readOnly: true
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                  {selectedValue === 'Video Call' ? <VideocamIcon className='my-3' style={{ fontSize: 40 }} /> : <CallIcon className='my-3' style={{ fontSize: 40 }} />}
                </div>
                <TextField
                  className='mx-2 my-3'
                  id="outlined-required"
                  label="Callee Name"
                  name="calleeName"
                  value={!isFirstClick? "Press Find a Random Callee": loading ? 'Loading...' : callee.userName ? callee.firstName + " " + callee.lastName : "No User is online! "}
                  InputProps={{
                    readOnly: true
                  }}
                />
              </div>
            </div>
            <div class="modal-footer">
              <button hidden ref={closeModalRef} type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" onClick={generateRandomCalleee}>Find A Random Callee</button>
              {selectedValue==='Video Call' ? 
              
              <button disabled={callee.userName? false: true} type="button" class="btn btn-primary" onClick={startVideoCall}>Start a Video Call</button>
            :
                <button disabled={callee.userName ? false : true} type="button" class="btn btn-primary" onClick={startAVoiceCall}>Start a Voice Call</button>
            }
            </div>
          </div>
        </div>
      </div>
      {userDetail.length > 0 ? !showProgress && <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: 'calc(50% - 16px)' }, // Adjust the width to achieve two text fields per row
          border: '1px solid #000',
          borderRadius: '10px',
          padding: '20px',
        }}
        noValidate
        autoComplete="off"
      >
        <div className="row my-3 mx-5">
          {userDetail.map((userData) => {
            const creationDate = creationDates.find((date) => date.id === userData.id)?.time || "";
            return (
              <UserDetailCard
                key={userData.id}
                status={userData.status}
                firstName={userData.firstName}
                lastName={userData.lastName}
                userName={userData.userName}
                tagLine={userData.tagLine}
                time={creationDate}
                userId={userData.id}
                profile={userData.profilePhoto}
                convertTime={convertTime}
                sendFriendRequest={sendFriendRequest}
                showAlert={props.showAlert}
              />
            );
          })}
        </div>
      </Box> :
        <div className='text-center'>
          <p style={{ color: "grey", marginTop: 200 }}>Explore More People by Searching Them!</p>
          <Button variant='outlined' color='primary' endIcon={<ArrowCircleRightRoundedIcon />} onClick={goToPeople}>Search People</Button>
        </div>
      }
    </>
  );
};

export default User;
