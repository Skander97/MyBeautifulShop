import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Sales.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB', '#FFCE56', '#7D4F6D', '#4BC0C0', '#36A3EB'];

const Sales = () => {
    const [salesByProduct, setSalesByProduct] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [salesByCategory, setSalesByCategory] = useState([]);
    const [salesByRegion, setSalesByRegion] = useState([]);
    const [salesKpis, setSalesKpis] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salesByProductResult = await axios.get('http://localhost:5000/ventes/sales-by-product');
                if (Array.isArray(salesByProductResult.data)) {
                    setSalesByProduct(salesByProductResult.data);
                } else {
                    setErrors(prevErrors => ({ ...prevErrors, salesByProduct: 'Invalid response' }));
                }
            } catch (error) {
                setErrors(prevErrors => ({ ...prevErrors, salesByProduct: error.message }));
            }

            try {
                const topProductsResult = await axios.get('http://localhost:5000/ventes/top-products');
                if (Array.isArray(topProductsResult.data)) {
                    setTopProducts(topProductsResult.data);
                } else {
                    setErrors(prevErrors => ({ ...prevErrors, topProducts: 'Invalid response' }));
                }
            } catch (error) {
                setErrors(prevErrors => ({ ...prevErrors, topProducts: error.message }));
            }

            try {
                const salesByCategoryResult = await axios.get('http://localhost:5000/ventes/sales-by-category');
                if (Array.isArray(salesByCategoryResult.data)) {
                    setSalesByCategory(salesByCategoryResult.data);
                } else {
                    setErrors(prevErrors => ({ ...prevErrors, salesByCategory: 'Invalid response' }));
                }
            } catch (error) {
                setErrors(prevErrors => ({ ...prevErrors, salesByCategory: error.message }));
            }

            try {
                const salesByRegionResult = await axios.get('http://localhost:5000/ventes/sales-by-region');
                if (Array.isArray(salesByRegionResult.data)) {
                    setSalesByRegion(salesByRegionResult.data);
                } else {
                    setErrors(prevErrors => ({ ...prevErrors, salesByRegion: 'Invalid response' }));
                }
            } catch (error) {
                setErrors(prevErrors => ({ ...prevErrors, salesByRegion: error.message }));
            }

            try {
                const kpisResult = await axios.get('http://localhost:5000/ventes/kpis');
                setSalesKpis(kpisResult.data);
            } catch (error) {
                setErrors(prevErrors => ({ ...prevErrors, kpis: error.message }));
            }
        };

        fetchData();
    }, []);

    return (
        <Container fluid className="sales-dashboard">
            <Row>
                <Col>
                    <h2 className="text-center my-4">Sales Dashboard</h2>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total des Ventes par Produit</Card.Title>
                            {errors.salesByProduct ? (
                                <p className="text-center text-danger">Error: {errors.salesByProduct}</p>
                            ) : (
                                salesByProduct.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={salesByProduct}>
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
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Top 10 des Produits</Card.Title>
                            {errors.topProducts ? (
                                <p className="text-center text-danger">Error: {errors.topProducts}</p>
                            ) : (
                                topProducts.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={topProducts}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="_id" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center">Loading data...</p>
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total des Ventes par Catégorie</Card.Title>
                            {errors.salesByCategory ? (
                                <p className="text-center text-danger">Error: {errors.salesByCategory}</p>
                            ) : (
                                salesByCategory.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <PieChart>
                                            <Pie
                                                data={salesByCategory}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="total_sales"
                                                nameKey="_id"
                                                label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
                                            >
                                                {salesByCategory.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center">Loading data...</p>
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>Total des Ventes par Région</Card.Title>
                            {errors.salesByRegion ? (
                                <p className="text-center text-danger">Error: {errors.salesByRegion}</p>
                            ) : (
                                salesByRegion.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={400}>
                                        <BarChart data={salesByRegion}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="region" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="total_sales" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <p className="text-center">Loading data...</p>
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <Card.Title>KPIs des Ventes</Card.Title>
                            {errors.kpis ? (
                                <p className="text-center text-danger">Error: {errors.kpis}</p>
                            ) : (
                                Object.keys(salesKpis).length > 0 ? (
                                    <ul>
                                        <li>Total des Ventes: {salesKpis.total_sales}</li>
                                        <li>Ventes Moyennes: {salesKpis.avg_sales}</li>
                                        <li>Total des Commandes: {salesKpis.total_orders}</li>
                                        <li>Total des Clients: {salesKpis.total_customers}</li>
                                    </ul>
                                ) : (
                                    <p className="text-center">Loading data...</p>
                                )
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Sales;
