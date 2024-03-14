import { Box, Button, Divider, TextField } from '@mui/material';
import React, { useContext, useState } from 'react'
import userContext from '../../context/User/UserContext';
import { useNavigate } from 'react-router-dom';

const SignUp = (props) => {
    const context = useContext(userContext);
    const{signup} = context;
    const [credentials, setCredentials] = useState({
        emailAddress:"",
        password:"",
        confirmPassword:"",
        firstName:"",
        lastName:"",
        tagLine:"Hey there! I am using iChat Application",
        userName:""
    });

    let navigate = useNavigate();

    const handleChange = (e) => {
        // e.preventDefault();
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignUp = async(e) => {
        e.preventDefault();
        console.log("SignUp Clicked!");
        if(credentials.confirmPassword!==credentials.password){
            props.showAlert("Both the password doesn't match!","danger");
        }
        else{
            const response = await signup(credentials.firstName, credentials.lastName, credentials.emailAddress, credentials.password, credentials.tagLine, credentials.userName);
            const data = await response.json();
            if(data.success){
                props.showAlert("Account Created Successfully!","success");
                localStorage.setItem("authToken",data.message);
                navigate('/home');
            }
            else{
                props.showAlert(data.message,"danger");
            }
        }
    }

  return (
      <div className="container text-center" style={{ height: '87vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
              className='text-center'
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
              <div>
                  <h1 className="container text-center"><strong>Sign Up to iChat Application!</strong></h1>
              </div>
              <div>
                  {/* <hr></hr> */}
                  <Divider orientation='horizontal' /><br></br>
              </div>
              <div>
                  <TextField
                      id="outlined-required"
                      label="First Name"
                      name="firstName"
                      required={true}
                      value={credentials.firstName}
                      onChange={handleChange}
                  />
                  <TextField
                      id="outlined-required"
                      label="Last Name"
                      name="lastName"
                      required={true}
                      value={credentials.lastName}
                      onChange={handleChange}
                  />
                  <TextField
                      id="outlined-required"
                      label="Email Address"
                      name="emailAddress"
                      required={true}
                      value={credentials.emailAddress}
                      onChange={handleChange}
                  />
                  <TextField
                      id="outlined-required"
                      label="User Name"
                      name="userName"
                      value={credentials.userName}
                      onChange={handleChange}
                  />
                  <TextField
                      id="outlined-password-input"
                      label="Password"
                      type="password"
                      required={true}
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                  />
                  <TextField
                      id="outlined-password-input"
                      label="Confirm Password"
                      type="password"
                      required={true}
                      name="confirmPassword"
                      value={credentials.confirmPassword}
                      onChange={handleChange}
                  />
              </div>
              <div>
                  <TextField
                      fullWidth
                      id="outlined-password-input fullWidth"
                      label="Tag Line"
                      name="tagLine"
                      value={credentials.tagLine}
                      onChange={handleChange}
                  />
              </div>
              <div>
                  <Button variant="contained" color="success" onClick={handleSignUp}>Sign Up</Button>
              </div>
          </Box>
      </div>
  )
}

export default SignUp;
