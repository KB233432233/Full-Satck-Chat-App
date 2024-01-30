import { Row, Form, Input, Button } from "reactstrap";
import Error from "../../Error";
import Avatar from '../../Avatar';
import axios from "axios";
import { useRef, useState } from "react";

function EditProfile({ user, toggle, open }) {

    const [st, setSt] = useState({
        name: user.name,
        about: user.about,
        image: null,
        avatar: null,
        error: null,
    });
    const fileUpload = useRef();

    const showFileUpload = () => fileUpload.current.click();

    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setSt({
                ...st,
                image: URL.createObjectURL(e.target.files[0]),
                avatar: e.target.files[0]
            });
        }
    };

    const onChange = e => {
        setSt({ ...st, [e.target.name]: e.target.value, error: null });
    }

    const onSubmit = e => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', st.name);
        data.append('about', st.about);
        if (st.avatar) data.append('avatar', st.avatar, st.avatar.name);
        axios.post('/api/account', data)
            .then(toggle)
            .catch(err => setSt({
                ...st,
                error: err.response.data.message
            }));
    };

    const onClose = e => {
        setSt({ ...st, image: false, name: this.props.user.name, about: this.props.user.about });
        toggle();
    };

    return (
        <div className={open ? 'side-profile open' : 'side-profile'}>

            <Row className="heading">
                <div className="mr-2 nav-link" onClick={onClose}>
                    <i className="fa fa-arrow-right" />
                </div>
                <div>الملف الشخصي</div>
            </Row>

            <div className="d-flex flex-column" style={{ overflow: 'auto' }}>

                <Form onSubmit={onSubmit}>

                    <Error error={st.error} />

                    <div className="text-center" onClick={showFileUpload}>
                        <Avatar src={user.avatar} file={st.image} />
                    </div>

                    <input type="file" ref={fileUpload} onChange={onImageChange} className="d-none" />

                    <div className="bg-white px-4 py-2">
                        <label className="text-muted">الاسم</label>
                        <Input value={st.name} name="name" onChange={onChange} required autoComplete="off" />
                    </div>

                    <div className="bg-white px-3 py-2">
                        <label className="text-muted">رسالة الحالة</label>
                        <Input value={st.about} name="about" onChange={onChange} required autoComplete="off" />
                    </div>

                    <div className="bg-white px-3 py-2">
                        <Button block className="mt-3">حفظ</Button>
                    </div>

                </Form>

            </div>

        </div>
    )
}

export default EditProfile
