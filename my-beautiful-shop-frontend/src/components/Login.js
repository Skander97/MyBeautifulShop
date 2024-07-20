import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const Login = () => {
    const { view } = useParams();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if ((view === 'sales' && username === 'sales' && password === 'sales_pass') ||
            (view === 'analytics' && username === 'analytics' && password === 'analytics_pass') ||
            (view === 'finance' && username === 'finance' && password === 'finance_pass') ||
            (view === 'admin' && username === 'admin' && password === 'admin_pass')) {
            await login(username, view);
            navigate(`/${view}`);
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="6">
                    <h2 className="text-center my-4">Login to {view.charAt(0).toUpperCase() + view.slice(1)} View</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                            />
                        </Form.Group>
                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
