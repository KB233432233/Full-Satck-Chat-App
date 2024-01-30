import { Row, Input } from 'reactstrap'
import Contact from './Contact'
import { useState } from 'react';

function Contacts({ contacts, messages, handleChatNavigate }) {


    const [search, setSearch] = useState('');

    const handleSearch = (e) => {
        setSearch(e.target.value)
    }

    const renderContact = (contact, index) => {
        if (!contact.name.includes(search)) return;
        let messages2 = messages.filter(e => e.sender === contact.id || e.receiver === contact.id);
        let lastMessage = messages2[messages2.length - 1];

        let unseen = messages2.filter(e => !e.seen && e.sender === contact.id).length;

        return (
            <div className="w-100" key={index} onClick={() => handleChatNavigate(contact)}>
                <Contact contact={contact} message={lastMessage} unseen={unseen} />
            </div>
        );
    }


    return (
        <div className='list'>
            <Row className='search'>
                <Input onChange={handleSearch} placeholder='search' />
            </Row>
            <Row id='contacts'>
                {contacts.map((contact, index) => renderContact(contact, index))}
            </Row>
        </div>
    )
}






export default Contacts
