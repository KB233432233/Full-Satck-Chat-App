import moment from 'moment';

function Message({ message }) {
    return (
        <div className={message.outgoing ? 'message-item' : 'message-item incoming'}>
            <div className="d-flex flex-row">
                <div className="body m-1 mr-2">
                    <div>{message.content}</div>
                    <span className='small text-muted'>
                        {moment(message.date).format('hh:mm a | MM D')}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Message
