import {
    Card,
    CardBody,
    CardTitle,
    Title,
  } from "@patternfly/react-core";
  import React from "react";
  
  interface VideoPlayerProps {
    id?: string;
    title: string;
    video?: string | null;
    video_img?: string | null;
    className?: string;
    autoPlay?: boolean;
    controls?: boolean;
    aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  }
  
  const VideoPlayerWrapper: React.FC<VideoPlayerProps> = ({
    id,
    title,
    video,
    video_img,
    className,
    autoPlay = false,
    controls = true,
    aspectRatio = '16:9',
  }) => {
    // Get aspect ratio class
    const getAspectRatioClass = () => {
      switch (aspectRatio) {
        case '16:9':
          return 'aspect-16-9';
        case '4:3':
          return 'aspect-4-3';
        case '1:1':
          return 'aspect-1-1';
        case 'auto':
        default:
          return 'aspect-auto';
      }
    };

    // Extract video ID from YouTube URL for embedding
    const getYouTubeEmbedUrl = (url: string) => {
      // Match various YouTube URL formats
      let videoId = '';
  
      // Standard YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
      const standardMatch = url.match(/[?&]v=([^&\s]{11})/);
      if (standardMatch) {
        videoId = standardMatch[1];
      } else {
        // Short YouTube URL: https://youtu.be/VIDEO_ID
        const shortMatch = url.match(/youtu\.be\/([^?\s]{11})/);
        if (shortMatch) {
          videoId = shortMatch[1];
        }
      }
  
      if (videoId) {
        const autoPlayParam = autoPlay ? '&autoplay=1' : '';
        return `https://www.youtube.com/embed/${videoId}?rel=0${autoPlayParam}`;
      }
      return url;
    };
  
    // Check if URL is a YouTube video
    const isYouTubeUrl = (url: string) => {
      return url.includes('youtube.com') || url.includes('youtu.be');
    };
  
    const renderVideoContent = () => {
      if (video) {
        if (isYouTubeUrl(video)) {
          // YouTube video embedding
          return (
            <div className={`video-player-container ${getAspectRatioClass()}`}>
              <iframe
                title={title}
                src={getYouTubeEmbedUrl(video)}
                className="video-player-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          );
        } else {
          // Direct video file
          return (
            <video
              src={video}
              controls={controls}
              autoPlay={autoPlay}
              title={title}
              className="video-player-video"
            >
              Your browser does not support the video tag.
            </video>
          );
        }
      } else if (video_img) {
        // Show poster image when no video URL is provided
        return (
          <img
            src={video_img}
            alt={title}
            className="video-player-poster"
          />
        );
      }
  
      // Fallback when neither video nor poster image is available
      return (
        <div>
          No video content available
        </div>
      );
    };
  
    return (
      <Card 
        id={id} 
        className={className}
      >
        <CardTitle>
          <Title headingLevel="h4" size="lg">
            {title}
          </Title>
        </CardTitle>
        <CardBody>
          {renderVideoContent()}
        </CardBody>
      </Card>
    );
  };
  
  export default VideoPlayerWrapper;