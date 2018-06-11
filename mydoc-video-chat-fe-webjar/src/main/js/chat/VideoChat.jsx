import React from 'react';
import MessagesPanel from './view/components/MessagesPanel.jsx';
import VideoPanel from "./view/components/VideoPanel.jsx';
import StatusPanel from "./view/components/StatusPanel.jsx';
import styles from './../css/video-chat.css';
import bootstrap from './../css/bootstrap.min.css'

class VideoChat extends React.Component {
    render() {
        return (
            <div className={styles[`video-chat`]}>
                <StatusPanel/>
                <MessagesPanel className={styles[`chat-messages-panel`]} currentUser={this.props.currentUser}/>
                <VideoPanel />
            </div>
        );
    }
}
export default VideoChat;