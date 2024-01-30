import { Row } from 'reactstrap'
import Avatar from '../../Avatar'

function UserProfile({ contact, open, toggle }) {
    return (
        <div className={open ? 'side-profile open' : 'side-profile'}>
            <Row className='heading'>
                <div className="mr-2 nav-link" onClick={toggle}>
                    <i className='fa fa-arrow-right'></i>
                </div>
            </Row>

            <div className="d-flex flex-column overflow-auto">
                <Avatar src={contact.avatar} />
                <div className="bg-white px-3 py-2">
                    <label className="text-muted">
                        status
                    </label>
                    <p>{contact.about ? contact.about : 'Hey I am using big boss chat app'}</p>
                </div>
            </div>

        </div>
    )
}

export default UserProfile
