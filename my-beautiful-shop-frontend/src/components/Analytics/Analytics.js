import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Table, Form, Button } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import './Analytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#7D4F6D', '#4BC0C0', '#36A3EB'];

const Analytics = () => {
    const [salesReport, setSalesReport] = useState([]);
    const [averageSalesByProduct, setAverageSalesByProduct] = useState([]);
    const [salesByRegion, setSalesByRegion] = useState([]);
    const [underperformingProducts, setUnderperformingProducts] = useState([]);
    const [topPerformingProducts, setTopPerformingProducts] = useState([]);
    const [vendorData, setVendorData] = useState([]);
    const [classificationResults, setClassificationResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salesReportResult = await axios.get('http://localhost:5000/analytics/sales-report');
                setSalesReport(salesReportResult.data);
            } catch (error) {
                console.error('Error fetching sales report data:', error);
            }

            try {
                const averageSalesByProductResult = await axios.get('http://localhost:5000/analytics/average-sales-by-product');
                setAverageSalesByProduct(averageSalesByProductResult.data);
            } catch (error) {
                console.error('Error fetching average sales by product data:', error);
            }

            try {
                const salesByRegionResult = await axios.get('http://localhost:5000/analytics/sales-by-region');
                setSalesByRegion(salesByRegionResult.data);
            } catch (error) {
                console.error('Error fetching sales by region data:', error);
            }

            try {
                const underperformingProductsResult = await axios.get('http://localhost:5000/analytics/underperforming-products');
                setUnderperformingProducts(underperformingProductsResult.data);
            } catch (error) {
                console.error('Error fetching underperforming products data:', error);
            }

            try {
                const topPerformingProductsResult = await axios.get('http://localhost:5000/analytics/top-performing-products');
                setTopPerformingProducts(topPerformingProductsResult.data);
            } catch (error) {
                console.error('Error fetching top performing products data:', error);
            }
        };

        fetchData();
    }, []);

    const handleClassify = async () => {
        try {
            const response = await axios.post('http://localhost:5000/analytics/classify-vendors', vendorData);
            setClassificationResults(response.data);
        } catch (error) {
            console.error('Error classifying vendors:', error);
        }
    };

    return (
        <Container fluid className="analytics-dashboard">
            <Row>
                <Col>
                    <h2 className="text-center my-4">Analytics Dashboard</h2>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Rapport des Ventes</Card.Title>
                            {salesReport.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={salesReport}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id.month" tickFormatter={(tick) => `Mois ${tick}`} />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="total_sales" stroke="#8884d8" />
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
                            <Card.Title>Ventes Moyennes par Produit</Card.Title>
                            {averageSalesByProduct.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={averageSalesByProduct}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="average_sales" fill="#82ca9d" />
                                    </BarChart>
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
                            <Card.Title>Ventes par Région</Card.Title>
                            {salesByRegion.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={salesByRegion}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total_sales" fill="#8884d8" />
                                    </BarChart>
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
                            <Card.Title>Produits les moins performants</Card.Title>
                            {underperformingProducts.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={underperformingProducts}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total_sales" fill="#ff6347" />
                                    </BarChart>
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
                            <Card.Title>Produits les plus performants</Card.Title>
                            {topPerformingProducts.length > 0 ? (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={topPerformingProducts}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="total_sales" fill="#32cd32" />
                                    </BarChart>
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
                            <Card.Title>Classification des Vendeurs</Card.Title>
                            <Form>
                                <Form.Group controlId="vendorData">
                                    <Form.Label>Entrer les données des vendeurs pour classification</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        value={JSON.stringify(vendorData, null, 2)}
                                        onChange={(e) => setVendorData(JSON.parse(e.target.value))}
                                    />
                                </Form.Group>
                                <Button variant="primary" onClick={handleClassify}>
                                    Classifier
                                </Button>
                            </Form>
                            {classificationResults.length > 0 && (
                                <Table striped bordered hover className="mt-4">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Vendeur</th>
                                            <th>Classification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classificationResults.map((result, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{vendorData[index]?.vendor_name}</td>
                                                <td>{result}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Analytics;
