import React, { useContext, useEffect, useState } from 'react';
import BottomNavigationBar from './BottomNavigation';
import userContext from '../context/User/UserContext';
import { useNavigate } from 'react-router-dom';
import PostCard from './Posts/PostCard';
import { Button, LinearProgress } from '@mui/material';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const HomePage = (props) => {
  const { showProgress, progress, setProgress, setCurrentRoomId } = props;
  const context = useContext(userContext);
  const { getUserDetails, getAllByFollowing, user, downloadPost, fetchUserDetails, convertTime, likePost, dislikePost, isLiked, setIsOtherPersonVideoOn, startVoiceCallUrl, setRoomId, setReceiverDetails, roomId, setChats, setIsOtherPersonMuted, endCallUrl, startCallUrl, answerCallUrl } = context;
  const [posts, setPosts] = useState({});
  const [userPostCredentials, setUserPostCredentials] = useState([]);
  const[stompClient, setStompClient] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // if (!isExecuted) {
      setProgress(20);
      fetchUserData()
      setProgress(100);
      // setIsExecuted(true);
    // }
  },[]);

  useEffect(() => {
    configureWebSocket();
  }, [user]);

  useEffect(() => {
    // setProgress(89);
    if (posts.length > 0) {
      fetchRequiredUserData();
    }
    // setProgress(100);
  }, [posts]);

  const closeWebSocket = () => {
    stompClient && stompClient.deactivate();
  };


  const configureWebSocket = async () => {
    if (user) {
      const url = `${startVoiceCallUrl}/${user[0]?.id}`;
      const videoCallUrl = `${process.env.REACT_APP_VIDEO_CALL_SUBSCRIBE}/${user[0]?.id}`;
      const socket = new SockJS(`${process.env.REACT_APP_SOCKJS_URL}`);
      let sc = Stomp.over(socket);
      setStompClient(sc);
      const brokerUrl = process.env.REACT_APP_WEBSOCKET_URL;
      sc.configure({
        brokerURL: brokerUrl,
        onConnect: async () => {
          sc.subscribe(url, async (response) => {
            const receivedResponse = JSON.parse(response.body);
              if (receivedResponse.success && roomId === "default" && receivedResponse.message === "Calling") {
                await setRoomId(receivedResponse.roomId);
                await setCurrentRoomId(receivedResponse.roomId);
                if (receivedResponse.receiverId !== user[0]?.id) {
                  const receiver = await fetchData(receivedResponse.receiverId);
                  await setReceiverDetails(receiver);
                }
                else {
                  const receiver = await fetchData(receivedResponse.callerId);
                  await setReceiverDetails(receiver);
                }
              }
              if (receivedResponse.success && receivedResponse.message === "Calling") {
                navigate("/voice/call/incoming");
              }
              if (receivedResponse.success && receivedResponse.message === "Answering") {
                navigate(`/voice/call/receive`);
              }
              if (receivedResponse.success && receivedResponse.message === 'Ended') {
                await setChats([]);
                navigate("/people");
              }
              if (receivedResponse.message === 'true' || receivedResponse.message === 'false') {
                await setIsOtherPersonMuted(receivedResponse.message === 'true');
              }
          });

          sc.subscribe(videoCallUrl, async(response) => {
            const receivedResponse = await JSON.parse(response.body);
              if(receivedResponse.success){
                if (roomId === 'default' && receivedResponse.message ==='Calling'){
                  await setRoomId(receivedResponse.roomId);
                  await setCurrentRoomId(receivedResponse.roomId);
                  if (receivedResponse.receiverId !== user[0]?.id) {
                    const receiver = await fetchData(receivedResponse.receiverId);
                    await setReceiverDetails(receiver);
                  }
                  else {
                    const receiver = await fetchData(receivedResponse.callerId);
                    await setReceiverDetails(receiver);
                  }
                }
                if(receivedResponse.message === 'Calling'){
                  navigate("/video/call/incoming");
                }
                if(receivedResponse.message === 'Ended!'){
                  await setRoomId("default");
                  await setCurrentRoomId("default");
                  await setReceiverDetails({});
                  navigate("/people");
                }
                if(receivedResponse.message==='Answering'){
                  navigate(`/video/call/receive`);
                }
                if(receivedResponse.message==='true' && receivedResponse.message==='false'){
                  console.log("SETTING: ", receivedResponse.message === 'true')
                  await setIsOtherPersonVideoOn(receivedResponse.message === 'true');
                }
              }
              else{
                props.showAlert(receivedResponse.message);
              }
          });
        },
        onStompError: (error) => {
          console.error('WebSocket error:', error);
        },
      });
      sc.activate();
    }
  }

  const fetchUserData = async () => {
    // setProgress(40);
    await getUserDetails()
      .then(async () => {
        // setProgress(50);
        await getPosts();
        // setProgress(80);
      })
      .catch(error => console.error('Error fetching user details:', error));
  }

  const getPosts = async () => {
    const response = await getAllByFollowing(user[0]?.id);
    const data = await response.json();
    setPosts(data);
  }

  const fetchData = async (id) => {
    const userDetailPromise = await fetchUserDetails(id);
    const userDetail = await userDetailPromise.json();
    return userDetail;
  };

  const fetchRequiredUserData = async () => {
    if (posts.length > 0) {
      const userDetailPromises = posts.map((post) => fetchData(post.userId));
      const userDetails = await Promise.all(userDetailPromises);

      const combinedData = userDetails.map((userDetail, index) => ({
        userCredentials: {
          userName: userDetail.userName,
          firstName: userDetail.firstName,
          lastName: userDetail.lastName,
          tagLine: userDetail.tagLine,
          status: userDetail.status,
          id: userDetail.id,
          profile: userDetail.profilePhoto,
        },
        postDetails: {
          time: posts[index].postingDate,
          image: posts[index].image,
          description: posts[index].description,
          likes: posts[index].likesCount,
          id: posts[index].id,
          downloadCount: posts[index].downloadsCount,
        },
      }));

      setUserPostCredentials(combinedData);
    }
    else {
      setUserPostCredentials([]);
    }
  }

  const fetchSource = (image) => {
    const mimeType = image.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
    const url = `data:${mimeType};base64,${image}`;
    return url;
  }


  const formatTime = async (time) => {
    try {
      const response = await convertTime(time);
      const data = await response.text();
      return data;
    } catch (error) {
      console.error('Error converting time:', error);
    }
  }

  const likeAPost = async (postId) => {
    try {
      const response = await likePost(user[0]?.id, postId);
      const data = await response.json();

      if (data.success) {
        getPosts();
        props.showAlert(data.message, "success");
      } else {
        props.showAlert(data.message, "danger");
      }
    } catch (error) {
      console.error('Error liking a post:', error);
    }
  };

  const dislikeAPost = async (postId) => {
    try {
      const response = await dislikePost(user[0]?.id, postId);
      const data = await response.json();

      if (data.success) {
        getPosts();
        props.showAlert(data.message, "success");
      } else {
        props.showAlert(data.message, "danger");
      }
    } catch (error) {
      console.error('Error disliking a post:', error);
    }
  };


  const checkLikes = async (postId) => {
    const response = await isLiked(user[0]?.id, postId);
    const data = await response.json();
    if (data.success) {
      if (data.message === "true") {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      props.showAlert("Some Internal Error occured! Please Refresh", 'danger');
    }
  }

  const download = async (postId, format, userName) => {
    try {
      const response = await downloadPost(user[0]?.id, postId, format);

      if (response.ok) {
        const blob = await response.blob();
        const filename = userName;

        // Create an anchor element
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // Append the link to the body and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);

        // Release the object URL
        window.URL.revokeObjectURL(link.href);
        getPosts();
        props.showAlert("Image Downloaded successfully", "success");
      } else {
        console.error('Error downloading image:', response.statusText);
        props.showAlert("Error Downloading Image", "danger");

      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const goToPeople = () => {
    navigate("/people");
  }
  return (
    <>
      <BottomNavigationBar showAlert={props.showAlert} value={"home"} />
      {showProgress && <LinearProgress variant="determinate" value={progress} sx={{ color: "red" }} />}
      {/* {posts.length === 0 ? */}
      {!showProgress && posts.length === 0 ?
        <div className='text-center'>
          <p style={{ color: "grey", marginTop: 200 }}>Follow more people to see their updates!</p>
          <Button variant='outlined' color='primary' endIcon={<ArrowCircleRightRoundedIcon />} onClick={goToPeople}>Find New Friends</Button>
        </div> :
        <>
          <div className="container my-2 text-center" style={{ marginLeft: 300 }}>
            {userPostCredentials.map((post, index) => (
              <PostCard key={index} download={download} dislikeAPost={dislikeAPost} checkLikes={checkLikes} likeAPost={likeAPost} formatTime={formatTime} fetchSource={fetchSource} userCredentials={post.userCredentials} postCredentials={post.postDetails} />
            ))}
          </div>
        </>}
    </>
  );
}

export default HomePage;
