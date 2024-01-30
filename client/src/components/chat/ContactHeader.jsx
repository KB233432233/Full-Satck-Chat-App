import Avatar from '../Avatar'
import { Row } from 'reactstrap'

function ContactHeader({ user, toggle }) {
    return (
        <Row className='heading'>
            <Avatar src='' />
            <div>Contacts</div>
            <div className="mr-auto nav-link" onClick={toggle}>
                <i className="fa fa-bars" />
            </div>
        </Row>
    )
}

export default ContactHeader
