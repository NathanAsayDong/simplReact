import React from 'react';
import './loadingIcon.scss'; // Ensure the CSS file is correctly linked

class LoadingIcon extends React.Component {
  start() {
    document.querySelector('.loading-container').style.display = 'flex';
  }

  stop() {
    document.querySelector('.loading-container').style.display = 'none';
  }

  render() {
    return (
      <div className="loading-container">
        <div className="loading-icon">S</div>
      </div>
    );
  }
}

export default LoadingIcon;