import { Button, Divider } from '@mui/material'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import React, { useContext, useState } from 'react'
import userContext from '../../context/User/UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Login = (props) => {
    const context = useContext(userContext);
    const { login } = context;
    const [credentials, setCredentials] = useState({
        emailAddress: "",
        password: ""
    });
    let navigate = useNavigate();
    const handleLogin = async () => {
        const response = await login(credentials.emailAddress, credentials.password);
        const data = await response.json();
        if(data.success){
            localStorage.setItem('authToken', data.message);
            props.showAlert("Logged In Successfully!","success");
            navigate('/home');
        }
        else{
            props.showAlert(data.message,"danger");
        }
    }
    const clearAllFields = (e) =>{
        setCredentials({
            emailAddress:"",
            password:""
        })
    }
    const handleChange = (e) => {
        // e.preventDefault();
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' ) {
            handleLogin();
        }
    }
    return (
        <div className="container text-center" style={{ height: '87vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
            className='text-center'
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                    border: '1px solid #000',
                    borderRadius: '10px', 
                    padding: '20px',
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <h1 className="container text-center"><strong>Login to iChat Application!</strong></h1>
                </div>
                <div>
                    <h6 style={{color:'grey'}}>Don't have an account? <Link to='/signup'>Sign Up</Link></h6>
                </div>
                <div>
                    {/* <hr></hr> */}
                    <Divider orientation='horizontal'/>
                </div>
                <div className='my-3'>
                    <TextField
                        id="outlined-required"
                        label="Email Address"
                        name="emailAddress"
                        required={true}
                        value={credentials.emailAddress}
                        onKeyPress={handleKeyPress}
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
                        onKeyPress={handleKeyPress}
                        onChange={handleChange}
                    />        

                </div>
                <div>
                    {/* <hr></hr> */}
                    <Divider orientation='horizontal' />
                </div>
                <div className='my-3'>
                    <h6>Forget Password?<Link to='/resetPassword'>Reset Password</Link></h6>
                </div>
                <div>
                    <Button className='mx-3' variant="contained" color="success" onClick={clearAllFields}>Clear Fields</Button>
                    <Button variant="contained" color="success" onClick={handleLogin}>Log in</Button>
                </div>
            </Box>
        </div>
    )
}

export default Login;