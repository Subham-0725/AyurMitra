import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Video, VideoOff, Mic, MicOff, Phone, PhoneOff } from "lucide-react";

const VideoCall = ({ onEndCall, isVoiceOnly = false }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    startCall();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: !isVoiceOnly,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current && !isVoiceOnly) {
        videoRef.current.srcObject = mediaStream;
      }
      if (isVoiceOnly) {
        setIsVideoOn(false);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onEndCall();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Video/Voice Area */}
      <div className="flex-1 relative">
        {!isVoiceOnly && (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        )}
        {(isVoiceOnly || !isVideoOn) && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <div className="text-center text-white">
              {isVoiceOnly ? (
                <>
                  <Phone className="w-20 h-20 mx-auto mb-6 text-purple-300" />
                  <p className="text-2xl font-semibold mb-2">Voice Call</p>
                  <p className="text-lg text-purple-200">
                    Audio consultation in progress
                  </p>
                </>
              ) : (
                <>
                  <VideoOff className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl">Camera is off</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-6 bg-black/50 backdrop-blur-sm rounded-full px-8 py-4">
          {!isVoiceOnly && (
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isVideoOn
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isVideoOn ? (
                <Video className="w-6 h-6 text-white" />
              ) : (
                <VideoOff className="w-6 h-6 text-white" />
              )}
            </button>
          )}

          <button
            onClick={toggleAudio}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isAudioOn
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isAudioOn ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            onClick={endCall}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoCall;
