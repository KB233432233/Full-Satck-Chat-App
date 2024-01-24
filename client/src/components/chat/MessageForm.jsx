import moment from 'moment';
import React, { useState } from 'react'
import { Input } from 'reactstrap'

function MessageForm({ sender, sendType }) {

    const [st, setSt] = useState({
        message: '',
        lastType: false,
    });

    const handleChange = (e) => setSt({ message: e.target.value });
    const handleSend = () => {
        if (!st.message) return;
        let message = {
            content: st.message,
            date: new Date().getTime(),
        }
        sender(message);
        setSt({ message: '' });
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            setSt({ ...st, lastType: false });
            handleSend();
            e.preventDefault();
        } else if (!st.lastType || moment() - st.lastType > 2000) {
            setSt({ ...st, lastType: moment() });
            sendType();
        }
    }


    return (
        <div id='send-message'>
            <Input type='textarea' rows='1' onChange={handleChange} value={st.message} placeholder='type' onKeyDown={handleKeyPress} />
            <i className='fa fa-send text-muted px-3 send' onClick={handleSend} />
        </div>
    )
}

export default MessageForm
