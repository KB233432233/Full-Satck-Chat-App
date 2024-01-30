import Avatar from "../Avatar"
import moment from 'moment';
import { Badge } from 'reactstrap';


function Contact({ contact, message, unseen }) {


    return (
        <div className="contact">
            <div>
                <Avatar src={contact.avatar} />
                {contact.status === true ? <i className="fa fa-circle online" /> : ''}
            </div>
            <div className="w-50">
                <div className="name">{contact.name}</div>
                <div className="small last-message">{message ? message.content : 'click here to begin conversation'}</div>
            </div>

            <div className="flex-grow-1 text-left">
                <div className="small text-muted">
                    {message ? moment(message.date).format('hh:mm a') : ''}
                </div>
                {unseen > 0 ? <Badge color="success">{unseen}</Badge> : ''}
            </div>
        </div>
    )
}

export default Contact
