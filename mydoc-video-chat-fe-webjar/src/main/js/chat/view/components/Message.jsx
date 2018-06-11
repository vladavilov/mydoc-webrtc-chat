import React from 'react';

class Message extends React.Component {

    constructor(props) {
        super(props);

        this.message = props.message;
    }

    render() {
        return <li className={`chat-message ${true ? "right" : "left"}`}>
            <img src={this.message.avatar} alt={`Sender's pic`} />
            {this.message.text}
        </li>;
    }
}
export default Message;