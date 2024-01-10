import React, { useState } from 'react'
import { Input } from 'reactstrap'

function MessageForm({ sender }) {

    const [st, setSt] = useState({
        message: '',
    });

    const handleChange = (e) => setSt({ message: e.target.value });
    const handleSend = (e) => {
        if (!st.message) return;
        let message = {
            content: st.message,
            date: new Date().getTime(),
        }
        sender(message);
        setSt({ message: '' });
    }


    return (
        <div id='send-message'>
            <Input type='textarea' rows='1' onChange={handleChange} value={st.message} placeholder='type' />
            <i className='fa fa-send text-muted px-3 send' onClick={handleSend} />
        </div>
    )
}

export default MessageForm
