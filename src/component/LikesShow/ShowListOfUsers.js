import { Avatar, Card, CardActions, CardContent, CardHeader, Chip, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useNavigate } from 'react-router-dom';
import FaceIcon from '@mui/icons-material/Face';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import { useState } from 'react';

const ShowListOfUsers = (props) => {
    const { likePressed, user } = props;
    const status = user.status.toLowerCase();
    const [imageUrl, setImageUrl] = useState(null);
    const initials = user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
    const navigate = useNavigate();
    const showProfile = () => {
        localStorage.setItem('userId', user.id);
        localStorage.setItem('previousLink', '/showUser');
        navigate('/viewProfile');
    }

    useEffect(() => {
        fetchProfileSource(user.image);
    },[user]);

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
          <Card sx={{ minWidth: "1020px" }}>
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
                                      
                                      <h5 style={{ fontSize: 25 }}>{user.firstName + " " + user.lastName} <Chip sx={{ backgroundColor: "lightgreen" }} icon={<FaceIcon />} label={user.userName} /></h5>
                                  </>
                              }
                              subheader={<><LocalOfferRoundedIcon /> {user.tagLine}</>}
                          />
                      </Grid>
                      <Grid xs={2}>
                        <CardActions>
                              <Tooltip title="View Profile">
                                  <IconButton onClick={showProfile} aria-label='view profile'>
                                      <VisibilityRoundedIcon />
                                  </IconButton>
                              </Tooltip>
                        </CardActions>
                      </Grid>
                  </Grid>
              </CardContent>
          </Card>
    </div>
  )
}

export default ShowListOfUsers
