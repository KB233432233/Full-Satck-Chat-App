import { useNavigate } from "react-router"
import { useAuth } from "../context/useAuth";
import { useEffect, useState } from "react";
import { Row, Spinner } from 'reactstrap';
import { ContactHeader, Contacts, ChatHeader, Messages, MessageForm, UserProfile, EditProfile } from "../components";
import socketIO from 'socket.io-client';
import { getToken } from "../context/useAuth";


let socket = socketIO(process.env.REACT_APP_SOCKET, {
    query: 'token=' + getToken()
});


function Chat() {
    const navigate = useNavigate();
    const { guest, Logout, setUser } = useAuth();
    const [redirected, setRedirected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [st, setSt] = useState({
        messages: [],
        contacts: [],
        user: {},
        contact: {},
        timeout: {},
    });

    const [typing, setTyping] = useState(false);
    const [userProfile, setUserProfile] = useState(false);
    const [profile, setProfile] = useState(false);
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
        socket.on('update_user', onUpdateUser)
        socket.on('message', onNewMessage);
        socket.on('user_status', updateUsersState);
        socket.on('typing', onTypingMessage);
    }, [st])

    const onNewUser = (user) => {
        let contacts2 = st.contacts.concat(user);
        setSt({ ...st, contacts: contacts2 });
    }

    const onUpdateUser = (user) => {
        if (st.user.id === user.id) {
            setSt({ ...st, user });
            setUser(user);
            return;
        }
        let contacts = st.contacts;
        contacts.forEach((ele, index) => {
            if (ele.id === user.id) {
                contacts[index] = user;
                contacts[index].status = ele.status;
            }
        });
        setSt({ ...st, contacts });
        if (st.contact.id === user.id) setSt({ ...st, contact: user });
    }

    const onNewMessage = (message) => {
        if (message.sender === st.contact.id) {
            setTyping(false);
            socket.emit('seen', st.contact.id);
            // message.seen = true;
        }
        let messages = st.messages.concat(message);
        setSt({ ...st, messages: messages });
    }

    const onTypingMessage = sender => {
        if (st.contact.id !== sender) { setTyping(false); return; }
        setTyping(true);
        setTimeout(() => setTyping(false), 3000);
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
        socket.emit('seen', contact.id);
        let message = st.messages;
        message.forEach((ele) => {
            if (ele.sender === contact.id) ele.seen = true;
        })
        setSt({ ...st, messages: message, contact });
    }

    const userProfileToggle = () => {
        setUserProfile(!userProfile);
    };

    const profileToggle = () => setProfile(!profile);

    const renderChat = () => {
        const { contact, user } = st;
        if (!contact) return;
        let messages = st.messages.filter(e => e.sender === contact.id || e.receiver === contact.id);
        return <Messages user={user} messages={messages} />
    }


    return loading || !connected || !st.contacts || !st.messages ? <Spinner id="loader" color="success" /> : (
        <Row className='h-100'>
            <div id="contacts-section" className="col-6 col-md-4">
                <ContactHeader user={st.user} toggle={profileToggle} />
                <Contacts contacts={st.contacts} messages={st.messages} handleChatNavigate={handleChatNavigate} />
                <UserProfile
                    contact={st.contact}
                    toggle={userProfileToggle}
                    open={userProfile} />
                <EditProfile
                    user={st.user}
                    toggle={userProfileToggle}
                    open={userProfile} />
            </div>
            <div id="messages-section" className="col-6 col-md-8">
                <ChatHeader contact={st.contact} typing={typing} toggle={userProfileToggle} />
                {renderChat()}
                <MessageForm sender={sendMessage} sendType={sendType} />
            </div>
        </Row>


    )
}


export default Chat
