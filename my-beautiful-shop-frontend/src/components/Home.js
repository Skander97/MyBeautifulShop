import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Home = () => {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <h2 className="text-center my-4">Choose a View</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Sales View</Card.Title>
                            <Card.Text>
                                <Link to="/login/sales" className="btn btn-primary">Go to Sales View</Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Analytics View</Card.Title>
                            <Card.Text>
                                <Link to="/login/analytics" className="btn btn-primary">Go to Analytics View</Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Finance View</Card.Title>
                            <Card.Text>
                                <Link to="/login/finance" className="btn btn-primary">Go to Finance View</Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Admin View</Card.Title>
                            <Card.Text>
                                <Link to="/login/admin" className="btn btn-primary">Go to Admin View</Link>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
