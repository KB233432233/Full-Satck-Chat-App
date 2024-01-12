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
        user: '',
        contact: {},
    });

    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (guest()) {
            setRedirected(true);
            navigate('/login');
        } else {
            setLoading(false)
            initSocketConnection();
        }
    }, [navigate, guest, redirected]);

    useEffect(() => {
        socket.on('new_user', onNewUser);
        socket.on('message', onNewMessage);
        socket.on('user_status', updateUsersState);
    }, [st])

    const onNewUser = (user) => {
        let contacts2 = st.contacts.concat(user);
        setSt({ ...st, contacts: contacts2 });
    }

    const onNewMessage = (message) => {
        let messages = st.messages.concat(message);
        setSt({ ...st, messages: messages });
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
        socket.on('data', (user, contacts, messages, users) => {
            let contact = contacts[0] || {}
            setSt({ messages: messages, contacts: contacts, user: user, contact: contact }, () => updateUsersState(users));
        })


        socket.on('error', err => {
            if (err === 'auth_error') {
                Logout();
                navigate('/login');
            }
        });
    }


    const updateUsersState = users => {
        let contacts = st.contacts;
        contacts.forEach((element, index) => {
            if (users[element.id]) contacts[index].status = users[element.id];
        });
        let contact = st.contact;
        if (users[contact.id]) contact.status = users[contact.id];
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

    if (!connected || !st.contacts || !st.messages) {
        return <Spinner id="loader" color="success" />
    }
    return loading ? null : (
        <Row className='h-100'>
            <div id="contacts-section" className="col-6 col-md-4">
                <ContactHeader />
                <Contacts contacts={st.contacts} messages={st.messages} handleChatNavigate={handleChatNavigate} />
            </div>
            <div id="messages-section" className="col-6 col-md-8">
                <ChatHeader contact={st.contact} />
                {renderChat()}
                <MessageForm sender={sendMessage} />
            </div>
        </Row>


    )
}


export default Chat
