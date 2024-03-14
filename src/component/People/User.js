import React, { useContext, useEffect, useState } from 'react';
import BottomNavigationBar from '../BottomNavigation';
import userContext from '../../context/User/UserContext';
import UserDetailCard from './UserDetailCard';
import { Box, Button, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';

const User = (props) => {
  const { showProgress, progress, setProgress } = props;
  const context = useContext(userContext);
  const { userDetail, fetchTimeInFormat, fetchOtherFriends, sendRequest, user, setUserDetail, peopleRef } = context;
  const [creationDates, setCreationDates] = useState([]);

  useEffect(() => {
    if (user) {
      peopleRef.current.click();
    }
    else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (userDetail.length>0) {
      fetchDataForUsers();
    }
    else {
      navigate("/login");
    }
  }, [userDetail]);
  const fetchDataForUsers = async () => {
    try {
      setProgress(20);
      const dates = await Promise.allSettled(  // Use Promise.allSettled to handle both fulfilled and rejected promises
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

      // Use the functional form of setCreationDates to ensure correct state updates
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
    console.log("friend request for : " + receiverId);
    setProgress(0);
    const response = await sendRequest(user[0]?.id, receiverId);
    setProgress(10);
    const data = await response.json();
    setProgress(40);
    console.log(data);
    if (data.success) {
      setProgress(60);
      const res = await fetchOtherFriends(user[0]?.id);
      setProgress(80);
      const d = await res.json();
      console.log(d);
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

  return (
    <>
      <BottomNavigationBar showAlert={props.showAlert} value={"people"} />
      {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
      {userDetail.length>0 ? <div className="container my-3 text-center">
        <h1> Recommendations
        </h1>
      </div> : <></>}
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
