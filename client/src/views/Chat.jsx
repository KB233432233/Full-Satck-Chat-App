import { useNavigate } from "react-router"
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { Row, Spinner } from 'reactstrap';
import { ContactHeader, Contacts, ChatHeader, Messages, MessageForm } from "../components";
import socketIO from 'socket.io-client';
import { getToken } from "../context/useAuth";


let socket = socketIO(process.env.REACT_APP_SOCKET, {
    query: 'token=' + getToken()
});


function Chat() {
    const navigate = useNavigate();
    const { guest, Logout } = useAuth();
    const [redirected, setRedirected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [st, setSt] = useState({
        messages: [],
        contacts: [],
        user: {},
        contact: {},
        typing: {},
        timeout: {},
    });

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (guest()) {
            setRedirected(true);
            navigate('/login');
        } else {
            setLoading(false);
            initSocketConnection();
        }
    }, [navigate, guest, redirected, st]);

    useEffect(() => {
        socket.on('new_user', onNewUser);
        socket.on('message', onNewMessage);
        socket.on('user_status', updateUsersState);
        socket.on('typing', onTypingMessage);
    }, [st])

    const onNewUser = (user) => {
        let contacts2 = st.contacts.concat(user);
        setSt({ ...st, contacts: contacts2 });
    }

    const onNewMessage = (message) => {
        if (message.sender === st.contact.id) {
            setSt({ ...st, typing: false });
        }
        let messages = st.messages.concat(message);
        setSt({ ...st, messages: messages });
    }

    const onTypingMessage = sender => {
        if (st.contact.id !== sender) return;
        setSt({ ...st, typing: true });
        setTimeout(() => setSt({ ...st, typing: false }), 3000);
    }


    const sendMessage = (message) => {
        if (!st.contact.id) return;
        message.sender = st.user.id;
        message.receiver = st.contact.id;
        let messages = st.messages.concat(message);
        setSt({ ...st, messages: messages });
        socket.emit('message', message);
    }


    const initSocketConnection = () => {

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on('data', (user, contacts, messages) => {
            let contact = contacts[0];
            setSt({ messages: messages, contacts: contacts, user: user, contact: contact });
        })


        socket.on('error', err => {
            if (err === 'auth_error') {
                Logout();
                navigate('/login');
            }
        });
    }

    const sendType = () => {
        socket.emit('typing', st.contact.id);
    }


    const updateUsersState = (statusID) => {
        let contacts = st.contacts.map((element) => {
            if (statusID[element.id]) element.status = statusID[element.id];
            return element;
        });
        let contact = st.contact;
        if (statusID[contact.id]) contact.status = statusID[contact.id];
        setSt({ ...st, contacts: contacts, contact: contact });
    }


    const handleChatNavigate = (contact) => {
        setSt({ ...st, contact: contact })
    }

    const renderChat = () => {
        const { contact, user } = st;
        if (!contact) return;
        let messages = st.messages.filter(e => e.sender === contact.id || e.receiver === contact.id);
        return <Messages user={user} messages={messages} />
    }


    return loading || !connected || !st.contacts || !st.messages ? <Spinner id="loader" color="success" /> : (
        <Row className='h-100'>
            <div id="contacts-section" className="col-6 col-md-4">
                <ContactHeader />
                <Contacts contacts={st.contacts} messages={st.messages} handleChatNavigate={handleChatNavigate} />
            </div>
            <div id="messages-section" className="col-6 col-md-8">
                <ChatHeader contact={st.contact} typing={st.typing} />
                {renderChat()}
                <MessageForm sender={sendMessage} sendType={sendType} />
            </div>
        </Row>


    )
}


export default Chat
