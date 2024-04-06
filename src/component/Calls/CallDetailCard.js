import { Avatar, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Tooltip } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import userContext from '../../context/User/UserContext';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded'; 
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import RingVolumeIcon from '@mui/icons-material/RingVolume';
import CallMissedIcon from '@mui/icons-material/CallMissed';

const CallDetailIncomingCard = (props) => {
    const { userCredentials, time, endTime, incoming, deleteHistory, id , voiceCall, answered} = props;
    const context = useContext(userContext);
    const { convertTime, computeDuration } = context;

    const [formattedStartTime, setFormattedStartTime] = useState("");
    const [duration, setDuration] = useState("");
    const status = userCredentials.status.toLowerCase();
    const [imageUrl, setImageUrl] = useState(null);
    const [profile, setProfile] = useState(null);

    const formatTime = async (time) => {
        try {
            const response = await convertTime(time);
            const data = await response.text();
            setFormattedStartTime(data);
        } catch (error) {
            console.error('Error converting time:', error);
            setFormattedStartTime("Error");
        }
    }

    const computeDifference = async (sTime, eTime) => {
        try {
            const response = await computeDuration(sTime, eTime);
            const data = await response.text();
            setDuration(data);
        } catch (error) {
            console.error('Error converting time:', error);
            setDuration("Error");
        }
    }

    useEffect(() => {
        formatTime(time);
    }, [time]);

    useEffect(() => {
        computeDifference(time, endTime);
    }, [time, endTime]);

    const components = duration.split("-");
    const hours = parseInt(components[0], 10) || 0;
    const minutes = parseInt(components[1], 10) || 0;
    const seconds = parseInt(components[2], 10) || 0;
    const initials = userCredentials.firstName.charAt(0).toUpperCase() + userCredentials.lastName.charAt(0).toUpperCase();
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
        <Card sx={{ minWidth: 275 }} className='my-3'>
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

                            subheader={
                                <>
                                    {incoming ?
                                        endTime!==null ? (answered ? <CallReceivedIcon sx={{color: "green"}}/>  : <CallMissedIcon sx={{color: "red"}}/>) : <RingVolumeIcon sx={{color: 'green'}}  />
                                        :
                                        <CallMadeIcon sx={{color: "green"}}/>}
                                        &nbsp;{endTime !== null ? formattedStartTime : answered ? formattedStartTime + " Ongoing" : formattedStartTime +" Ringing..."}
                                    <br />
                                    {answered ? (
                                        <>
                                            <HistoryRoundedIcon /> &nbsp;
                                            {endTime !== null ? (
                                                <>
                                                    {hours !== 0 && `${hours} hrs `}
                                                    {minutes !== 0 && `${minutes} min `}
                                                    {seconds !== 0 && `${seconds} sec `}
                                                </>
                                            ) : (
                                                " Ongoing "
                                            )}
                                        </>
                                    ) : (
                                        <>
                                        </>
                                    )}
                                </>
                            }

                        />
                    </Grid>
                    <Grid item xs={2}>
                        <CardActions>
                            <Tooltip title="Delete">
                                <IconButton onClick={() => deleteHistory(id)}>
                                    <DeleteIcon sx={{ fontSize: 30 }} />
                                </IconButton>
                            </Tooltip>
                            {voiceCall && 
                            <Tooltip title='Voice Call'>
                                <IconButton>
                                    <PhoneIcon sx={{fontSize: 30}} />
                                </IconButton>
                            </Tooltip>
                            }
                        </CardActions>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default CallDetailIncomingCard;
