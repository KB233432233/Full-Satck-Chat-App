import { useNavigate } from 'react-router'
import Avatar from '../Avatar'
import { useAuth } from '../../context/useAuth'
import { Row, DropdownItem, DropdownMenu, DropdownToggle, Nav, UncontrolledDropdown } from 'reactstrap';

function ChatHeader({ contact }) {
    const navigate = useNavigate();
    const { Logout } = useAuth()

    const logout = () => {
        Logout();
        navigate('/login');
    }



    return (
        <Row className="heading m-0">
            <Avatar src={''} />
            <div className="text-right">
                <div>{contact ? contact.name : ''}</div>
            </div>
            <Nav className="mr-auto" navbar>
                <UncontrolledDropdown>
                    <DropdownToggle tag='a' className='nav-link'>
                        <i className='fa fa-ellipsis-v' />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={logout}>Log out</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        </Row>
    )
}

export default ChatHeader
