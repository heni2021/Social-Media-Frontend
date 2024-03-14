import { Box, Button, Divider, LinearProgress, TextField } from '@mui/material'
import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import userContext from '../../context/User/UserContext';

const ResetPassword = (props) => {
    const context = useContext(userContext);
    const { resetPassword } = context;
    const [credentials, setCredentials] = useState({
        emailAddress: "",
        password: "",
        confirmPassword:""
    });
    let navigate = useNavigate();
    const handleChange = (e) => {
        // e.preventDefault();
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(true);

    useEffect(() => {
        if (progress === 100) {
            // Delay hiding the progress bar to let users see the animation
            setTimeout(() => {
                setShowProgress(false);
            }, 500); // Adjust the delay duration as needed
        } else {
            setShowProgress(true);
        }
    }, [progress]);
    const handleReset = async(e) =>{
        e.preventDefault();
        if(credentials.password!==credentials.confirmPassword){
            props.showAlert("Both the passwords doesn't match!");
        }
        else{
            setProgress(10);
            const response = await resetPassword(credentials.emailAddress, credentials.password);
            setProgress(30);
            const data = await response.json();
            setProgress(40);
            if(data.success){
                props.showAlert(data.message,"success");
                setProgress(100);
                navigate('/login');
            }
            else{
                props.showAlert(data.message, "danger");
            }
        }
    }
    return (
        <div className="container text-center" style={{ height: '87vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
            <Box
                className='text-center'
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    border: '1px solid #000', // Add border styling
                    borderRadius: '10px',     // Add border radius for rounded corners
                    padding: '20px',          // Add padding for space inside the box
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <h1 className="container text-center"><strong>Reset Password!</strong></h1>
                </div>
                <div>
                    {/* <hr></hr> */}
                    <Divider orientation='horizontal' />
                </div>
                <div className='my-3'>
                    <TextField
                        id="outlined-required"
                        label="Email Address"
                        name="emailAddress"
                        required={true}
                        value={credentials.emailAddress}
                        onChange={handleChange}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        required={true}
                        name="password"
                        autoComplete="current-password"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                    <TextField
                        id="outlined-password-input"
                        label="Confirm Password"
                        type="password"
                        required={true}
                        name="confirmPassword"
                        autoComplete="current-password"
                        value={credentials.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Button variant="contained" color="success" onClick={handleReset}>Reset Password</Button>
                </div>
            </Box>
        </div>
    )
}

export default ResetPassword
