import React, { useEffect } from 'react';

const LocalVideo = ({ stream, muted }) => {
    useEffect(() => {
        const videoTrack = stream && stream.getVideoTracks()[0];
        const videoElement = document.getElementById('localVideo');
        if (videoElement && videoTrack) {
            videoElement.srcObject = stream;
        }
        return () => {
            if (videoElement) {
                videoElement.srcObject = null;
            }
        };
    }, [stream]);

    return <video id="localVideo" className="local-video" autoPlay muted={muted}/>;
};

export default LocalVideo
