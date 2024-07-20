import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Finance.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#7D4F6D', '#4BC0C0', '#36A3EB'];

const Finance = () => {
    const [paymentsByType, setPaymentsByType] = useState([]);
    const [paymentsByCategory, setPaymentsByCategory] = useState([]);
    const [paymentsByMonth, setPaymentsByMonth] = useState([]);
    const [paymentsByYear, setPaymentsByYear] = useState([]);
    const [ordersByMonth, setOrdersByMonth] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [integrityIssues, setIntegrityIssues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const paymentsByTypeResult = await axios.get('http://localhost:5000/finance/payments-by-type');
                const paymentsByCategoryResult = await axios.get('http://localhost:5000/finance/payments-by-category');
                const paymentsByMonthResult = await axios.get('http://localhost:5000/finance/payments-by-month');
                const paymentsByYearResult = await axios.get('http://localhost:5000/finance/payments-by-year');
                const ordersByMonthResult = await axios.get('http://localhost:5000/finance/orders-by-month');
                const anomaliesResult = await axios.get('http://localhost:5000/finance/anomalies');
                const integrityResult = await axios.get('http://localhost:5000/finance/integrity-check');

                console.log('Payments by Category:', paymentsByCategoryResult.data);  // Log the data to debug

                setPaymentsByType(paymentsByTypeResult.data);
                setPaymentsByCategory(Array.isArray(paymentsByCategoryResult.data) ? paymentsByCategoryResult.data : []);
                setPaymentsByMonth(paymentsByMonthResult.data);
                setPaymentsByYear(paymentsByYearResult.data);
                setOrdersByMonth(ordersByMonthResult.data);
                setAnomalies(Array.isArray(anomaliesResult.data) ? anomaliesResult.data : []);
                setIntegrityIssues(integrityResult.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const precalculatePaymentsByCategory = async () => {
        try {
            await axios.post('http://localhost:5000/finance/precalculate-payments-by-category');
            const paymentsByCategoryResult = await axios.get('http://localhost:5000/finance/payments-by-category');
            console.log('Precalculated Payments by Category:', paymentsByCategoryResult.data);  // Log the data to debug
            setPaymentsByCategory(Array.isArray(paymentsByCategoryResult.data) ? paymentsByCategoryResult.data : []);
        } catch (error) {
            console.error('Error pre-calculating payments by category:', error);
        }
    };

    const formatMonth = (tickItem) => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthNames[tickItem - 1];
    };

    const formatYear = (tickItem) => {
        return tickItem;
    };

    return (
        <Container fluid className="finance-dashboard">
            <Row>
                <Col>
                    <h2 className="text-center my-4">Finance Dashboard</h2>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total des Paiements par Type</Card.Title>
                            {paymentsByType.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={paymentsByType}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="total"
                                            nameKey="_id"
                                            label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
                                        >
                                            {paymentsByType.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center">Loading data...</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total des Paiements par Catégorie de Produit</Card.Title>
                            <Button onClick={precalculatePaymentsByCategory} className="mb-3">Recalculer les Paiements par Catégorie</Button>
                            {paymentsByCategory.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={paymentsByCategory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="total"
                                            nameKey="_id"
                                            label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
                                        >
                                            {paymentsByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center">Loading data...</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Évolution des Paiements par Mois (Année en cours)</Card.Title>
                            {paymentsByMonth.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={paymentsByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" tickFormatter={formatMonth} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="total" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center">Loading data...</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Évolution des Commandes par Mois</Card.Title>
                            {ordersByMonth.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={ordersByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id.month" tickFormatter={formatMonth} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="total" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center">Loading data...</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Évolution des Paiements par Année</Card.Title>
                            {paymentsByYear.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={paymentsByYear}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="year" tickFormatter={formatYear} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="total" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-center">Loading data...</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Anomalies Financières</Card.Title>
                            {anomalies.length > 0 ? (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>ID de Commande</th>
                                            <th>Type de Paiement</th>
                                            <th>Valeur</th>
                                            <th>Détails de la Commande</th>
                                       
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {anomalies.map((anomaly, index) => (
                                                <tr key={index}>
                                                    <td>{anomaly.order_id}</td>
                                                    <td>{anomaly.payment_type}</td>
                                                    <td>{anomaly.payment_value}</td>
                                                    <td>{JSON.stringify(anomaly.order_details)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-center">Loading data...</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card className="mb-4 shadow-sm">
                            <Card.Body>
                                <Card.Title>Problèmes d'Intégrité des Données</Card.Title>
                                {integrityIssues.orders_without_payments && integrityIssues.orders_without_payments.length > 0 ? (
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>ID de Commande</th>
                                                <th>Détails de la Commande</th>
                                                <th>Détails de Paiement</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {integrityIssues.orders_without_payments.map((issue, index) => (
                                                <tr key={index}>
                                                    <td>{issue.order_id}</td>
                                                    <td>{JSON.stringify(issue)}</td>
                                                    <td>{JSON.stringify(issue.payment_details)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-center">Loading data...</p>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    };

    export default Finance;
