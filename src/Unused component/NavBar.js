import { Avatar, Button } from '@mui/material';
import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NavBar = (props) => {
    let location = useLocation();
    let navigate = useNavigate();

    const logOut = (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        props.showAlert("Logged Out Successfully!", "success");
        navigate("/login");
    }

    const openProfile = (e) => {
        e.preventDefault();
        navigate('/profile');
    }


    useEffect(() => {
        // Check if there is no authentication token, redirect to /login
        if (!localStorage.getItem('authToken') && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/resetPassword') {
            navigate(location.pathname);
        }
    }, [location.pathname, navigate]);

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">iChat</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-lg-0">
                            <li className="nav-item">
                                {/* <Link className={`nav-link ${location.pathname === "/home" ? "active" : ""}`} aria-current="page" to="/home">Home</Link> */}
                                <button type="button" className="btn btn-outline-primary mx-2">Home</button>
                            </li>
                            <li className="nav-item">
                                {/* <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About Us</Link> */}
                                <button type="button" className="btn btn-outline-primary mx-2">About</button>

                            </li>
                            <li className='nav-item'>
                                <button type="button" className="btn btn-outline-primary mx-2">Requests</button>
                            </li>
                            <li className='nav-item'>
                                <button type="button" className="btn btn-outline-primary">Requests</button>
                            </li>
                        </ul>
                        {localStorage.getItem('authToken') ?
                                <form className="d-flex">
                                    <Button variant="contained" color="success" onClick={logOut}>Log Out</Button>&nbsp;
                                    <Avatar
                                        alt="Profile Pic"
                                        src={""}
                                        style={{ cursor: "pointer" }}
                                        onClick={openProfile}
                                    />
                                </form>
                            :
                            null
                        }
                    </div>

                </div>
            </nav>
        </div>
    )
}

export default NavBar
