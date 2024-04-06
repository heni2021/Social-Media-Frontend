import { Button, Snackbar } from '@mui/material';
import React, { useEffect, useRef } from 'react'

function Alert(props) {
    // const openAlertBox = useRef(null);
    // const [open, setOpen] = React.useState(false);

    // const handleClick = () => {
    //     setOpen(true);
    // };

    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }

    //     setOpen(false);
    // };

    // useEffect(()=>{
    //     if(openAlertBox && openAlertBox.current)
    //     openAlertBox.current.click();
    // },[props]);
    
    const capitalize = (word) => {
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{ height: '30px' }}>
            {props.message && <div className={`alert alert-${props.message.type} alert-dismissible fade show`} role="alert">
                {props.message.type === "danger" ? "Error" : capitalize(props.message.type)} : {props.message.msg}
            </div>}
            {/* <Button disabled ref = {openAlertBox} onClick={handleClick}>Open Snackbar</Button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={props.message.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {props.message}
                </Alert>
            </Snackbar> */}
        </div>
    )
}

export default Alert
