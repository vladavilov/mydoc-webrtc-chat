import React from 'react';
import ReactDOM from "react-dom";
import Message from './Message.jsx';

class MessagesPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [{
                fromUser: "Kevin Hsu",
                text: <p>Hello World!</p>,
                avatar: "http://i.imgur.com/Tj5DGiO.jpg",
            }, {
                fromUser: "Alice Chen",
                text: <p>Love it! :heart:</p>,
                avatar: "http://i.imgur.com/Tj5DGiO.jpg"
            }]
        };

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.messages).scrollTop = ReactDOM.findDOMNode(this.refs.messages).scrollHeight;
    }

    eraseMessage() {
        ReactDOM.findDOMNode(this.refs.messageText).value = "";
    }

    submitMessage(e) {
        e.preventDefault();

        this.setState({
            messages: this.state.messages.concat([{
                fromUser: this.props.currentUser,
                isFromCurrentUser: true,
                text: <p>{ReactDOM.findDOMNode(this.refs.messageText).value}</p>,
                avatar: "http://i.imgur.com/Tj5DGiO.jpg"
            }])
        }, () => {
            this.eraseMessage();
        });
    }

    renderMessage(message) {
        <Message message={message}/>
    }

    render() {
        const {messages} = this.state;

        return (
            <div className="chat-messages-panel">
                <h3>Chilltime</h3>
                <ul className="messages" ref="messages">
                    {
                        messages.map((message) =>
                            this.renderMessage(message)
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="messageText"/>
                    <input type="submit" value="Send"/>
                </form>
            </div>
        );
    }
}
export default MessagesPanel;