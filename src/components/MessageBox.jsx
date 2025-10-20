import React, { useEffect, useState } from "react";
import "./MessageBox.css";

const MessageBox = ({ type, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setIsLeaving(false);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!message || !isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "fas fa-check-circle";
      case "error":
        return "fas fa-exclamation-circle";
      case "warning":
        return "fas fa-exclamation-triangle";
      case "info":
        return "fas fa-info-circle";
      default:
        return "fas fa-info-circle";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "success":
        return "Success!";
      case "error":
        return "Error!";
      case "warning":
        return "Warning!";
      case "info":
        return "Information";
      default:
        return "Message";
    }
  };

  return (
    <div className={`message-box ${type} ${isLeaving ? "leaving" : ""}`}>
      <div className="message-content">
        <div className="message-icon">
          <i className={getIcon()}></i>
        </div>
        <div className="message-text">
          <div className="message-title">{getTitle()}</div>
          <div className="message-body">{message}</div>
        </div>
        <button className="message-close" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="message-progress">
        <div 
          className="progress-bar" 
          style={{ 
            animationDuration: `${duration}ms`,
            animationPlayState: isLeaving ? 'paused' : 'running'
          }}
        ></div>
      </div>
    </div>
  );
};

export default MessageBox;