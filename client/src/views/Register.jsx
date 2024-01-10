import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button } from 'reactstrap';
import Error from '../components/Error';
import Logo from '../assets/logo.png';
import axios from 'axios';
import Auth from '../auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Register() {
    const navigate = useNavigate();
    const { authentication } = useAuth();
    const [redirected, setRedirected] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authentication()) {
            setRedirected(true);
            navigate('/');
        } else { setLoading(false) }
    }, [navigate, authentication, redirected])



    const [data, setData] = useState({
        name: '',
        username: '',
        password: '',
        error: '',
    });



    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value, error: null })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let data2 = { ...data };
        axios.post('/api/auth/register', data2).then(res => {
            Auth(res.data);
            navigate('/');

        }).catch(err => {
            setData({ ...data, error: err.response.data });
        });
    }



    return loading ? null : (
        <Card>
            <Form onSubmit={handleSubmit} className='auth col-lg-3 col-sm-6'>
                <img src={Logo} alt='' width='200' />
                <h5 className='mb-4'>Register new account</h5>
                <Error error={data.error} />
                <Input value={data.name} name='name' onChange={handleChange} placeholder='name' required autoFocus />
                <Input value={data.username} name='username' onChange={handleChange} placeholder='username' required autoFocus />
                <Input value={data.password} name='password' onChange={handleChange} placeholder='password' required autoFocus />
                <Button color='primary' block className='mb-3'>Register</Button>
                <small><Link to={'/login'}>Log in</Link></small>
                <p className='m-3 text muted'>&copy; 2023 - 2024</p>


            </Form>

        </Card>
    )
}

export default Register;
