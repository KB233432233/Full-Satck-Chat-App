import Message from "./Message"

function Messages({ messages, user }) {

    const renderMessage = (message, index) => {
        message.outgoing = message.reciver !== user.id;
        return <Message key={index} message={message} />
    }


    return (
        <div id="messages">
            {messages.map(renderMessage)}
        </div>
    )
}

export default Messages
