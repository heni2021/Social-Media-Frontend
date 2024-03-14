import React, { useContext, useEffect, useState } from 'react';
import userContext from '../../context/User/UserContext';
import { Divider } from '@mui/material';
import ShowUsersDetailsCard from './ShowUsersDetailsCard';
import { useNavigate } from 'react-router-dom';

const ShowDefaultUserDetails = (props) => {
    const { closeChattingModal } = props;
    const context = useContext(userContext);
    const { fetchFollowing, fetchFollowers, user, fetchOtherFriends } = context;

    const [followingUsers, setFollowingUsers] = useState([]);
    const [followerUsers, setFollowerUsers] = useState([]);
    const [otherFriendsUsers, setOtherFriendsUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchFollowerFriends();
            fetchFollowingFriends();
            fetchOtherFriendUser();
        } else {
            navigate("/login");
        }
    }, [user]);

    const fetchFollowingFriends = async () => {
        const response = await fetchFollowing(user[0]?.id);
        const data = await response.json();
        setFollowingUsers(data);
    }

    const fetchFollowerFriends = async () => {
        const response = await fetchFollowers(user[0]?.id);
        const data = await response.json();
        setFollowerUsers(data);
    }

    const fetchOtherFriendUser = async () => {
        const response = await fetchOtherFriends(user[0]?.id);
        const data = await response.json();
        setOtherFriendsUsers(data);
    }

    // Filter out users who are in both follower and following lists
    const filteredFollower = followerUsers.filter(user => !followingUsers.some(following => following.id === user.id));
    const filteredOthers = otherFriendsUsers.filter(user => !followerUsers.some(following => following.id === user.id));
    return (
        <div>
            {/* Fetch Following List */}
            {followingUsers.length > 0 &&
                <div className='container my-2 text-center'>
                    <Divider />
                    <p className='my-2' style={{ color: "grey", fontWeight: "bolder" }}> People You Follow!</p>
                    <Divider />
                    {followingUsers.map((user, index) => (
                        <ShowUsersDetailsCard key={index} userDetail={user} closeChattingModal={closeChattingModal} />
                    ))}
                </div>
            }
            {/* Fetch Follower List */}
            {filteredFollower.length > 0 &&
                <div className='container my-2 text-center'>
                    <Divider />
                    <p className='my-2' style={{ color: "grey", fontWeight: "bolder" }}> People Who Follow You!</p>
                    <Divider />
                    {filteredFollower.map((user, index) => (
                        <ShowUsersDetailsCard key={index} userDetail={user} closeChattingModal={closeChattingModal} />
                    ))}
                </div>
            }
            {/* Fetch Others List */}
            {filteredOthers.length > 0 &&
                <div className='container my-2 text-center'>
                    <Divider />
                    <p className='my-2' style={{ color: "grey", fontWeight: "bolder" }}> People You May Know!</p>
                    <Divider />
                    {filteredOthers.map((user, index) => (
                        <ShowUsersDetailsCard key={index} userDetail={user} closeChattingModal={closeChattingModal} />
                    ))}
                </div>
            }
        </div>
    );
}

export default ShowDefaultUserDetails;
