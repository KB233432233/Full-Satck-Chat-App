import Message from "./Message"
import { useRef, useEffect } from "react";

function Messages({ messages, user }) {


    const containerRef = useRef(null);
    const isScrolledUpRef = useRef(false);

    useEffect(() => {
        const container = containerRef.current;

        if (!isScrolledUpRef.current || messages[messages.length - 1].sender === user.id) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const handleScroll = () => {
        const container = containerRef.current;
        // Calculate the difference between the scroll height and the scroll position plus container height
        const atBottom = container.scrollHeight - (container.scrollTop + container.clientHeight) < 1;

        // Update the isScrolledUpRef based on whether the user is actively scrolling up
        isScrolledUpRef.current = !atBottom;
    };

    const renderMessage = (message, index) => {
        message.outgoing = message.receiver !== user.id;
        return <Message key={index} message={message} />
    }


    return (
        <div id="messages"
            ref={containerRef}
            onScroll={handleScroll}
        >
            {messages.map(renderMessage)}
        </div>
    )
}

export default Messages
