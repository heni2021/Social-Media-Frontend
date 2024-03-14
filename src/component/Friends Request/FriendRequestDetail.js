import { Avatar, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Tooltip } from '@mui/material';
import React from 'react';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useContext } from 'react';
import userContext from '../../context/User/UserContext';
import { useEffect } from 'react';
import { useState } from 'react';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';

const FriendRequestDetail = (props) => {
  const context = useContext(userContext);
  const { convertTime } = context;
  const { userCredentials, requestDate, sentRequest, cancelRequest, ignoreRequest, acceptRequest } = props;
  const initials = userCredentials.firstName.charAt(0).toUpperCase() + userCredentials.lastName.charAt(0).toUpperCase();
  const status = userCredentials.status.toLowerCase();
  const [imageUrl, setImageUrl] = useState(null);
  const [profile, setProfile] = useState(null);
  const [formattedRequestDate, setFormattedRequestDate] = useState("");

  const formatTime = async (time) => {
    try {
      const response = await convertTime(time);
      const data = await response.text();
      setFormattedRequestDate(data);
    } catch (error) {
      console.error('Error converting time:', error);
      setFormattedRequestDate("Error");
    }
  }

  useEffect(() => {
    formatTime(requestDate);
  }, [requestDate]);

  const navigate = useNavigate();
  const showProfile = () => {
    localStorage.setItem('userId', userCredentials.id);
    localStorage.setItem('previousLink', '/viewRequests');
    navigate('/viewProfile');
  }
  useEffect(() => {
    fetchProfilePhoto();
  }, [userCredentials.id]);

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

  return (
    <>
      <div className="container my-3">
        <Card>
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
                  subheader={formattedRequestDate}
                />
              </Grid>
              <Grid item xs={2}>
                <CardActions>
                  {sentRequest ?
                    <>
                      <Tooltip title='Cancel Request'>
                        <IconButton onClick={() => cancelRequest(userCredentials.id)}>
                          <CancelRoundedIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip Tooltip title="View Profile">
                        <IconButton onClick={showProfile} aria-label='view profile'>
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                    :
                    <>
                      <Tooltip title='Accept Request'>
                        <IconButton onClick={() => acceptRequest(userCredentials.id)}>
                          <CheckCircleRoundedIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Ignore Request'>
                        <IconButton onClick={() => ignoreRequest(userCredentials.id)} >
                          <CancelRoundedIcon sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip Tooltip title="View Profile">
                        <IconButton onClick={showProfile} aria-label='view profile'>
                          <VisibilityRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                </CardActions>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default FriendRequestDetail;
