import React, { useEffect } from 'react';

const RemoteVideo = ({ stream }) => {
    useEffect(() => {
        const videoTrack = stream && stream.getVideoTracks()[0];
        const videoElement = document.getElementById('remoteVideo');
        if (videoElement && videoTrack) {
            // videoElement.srcObject = new MediaStream([videoTrack]);
            videoElement.srcObject = stream;
        }
        return () => {
            if (videoElement) {
                videoElement.srcObject = null;
            }
        };
    }, [stream]);

    return <video id="remoteVideo" className="remote-video" autoPlay />;
};

export default RemoteVideo
