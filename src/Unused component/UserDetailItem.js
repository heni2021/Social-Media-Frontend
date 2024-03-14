import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Avatar, Chip } from '@mui/material';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';

const UserDetailItem = (props) => {
    let status = props.status;
    status = status.toLowerCase();
    return (
        <div>
            <Card sx={{ minWidth: 275 }} className='container my-3'>
                <CardContent>
                    <div>
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            {status === "online" ? <Chip label="Online" color="success" variant="filled" /> : <Chip label="Offline" />}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {props.firstName + " " + props.lastName}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {props.userName}
                        </Typography>
                        <Typography variant="body2">
                            {<><LocalOfferRoundedIcon/>{props.tagLine}</>}
                        </Typography>
                    </div>
                    <Avatar
                        alt={props.userName}
                        src="URL_TO_YOUR_IMAGE"  // Replace with the actual URL of the image
                        sx={{ width: 56, height: 56, marginRight: 2 }}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default UserDetailItem
