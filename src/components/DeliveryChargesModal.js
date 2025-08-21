
import React from 'react';
import { Modal, Button, Table, Row, Col, ListGroup } from 'react-bootstrap';

const DeliveryChargesModal = ({ onClose }) => {
    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Delivery Charges</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Col xs={12} sm={12} md={5}>
                        <Table striped bordered hover size="sm">
                            <thead>
                            <tr>
                                <th>Miles</th>
                                <th>Prices</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>0 to 2</td>
                                <td>$20</td>
                            </tr>
                            <tr>
                                <td>2 to 5</td>
                                <td>$30</td>
                            </tr>
                            <tr>
                                <td>5 to 7</td>
                                <td>$40</td>
                            </tr>
                            <tr>
                                <td>7 to 10</td>
                                <td>$50</td>
                            </tr>
                            <tr>
                                <td>10 to 13</td>
                                <td>$60</td>
                            </tr>
                            <tr>
                                <td>13 to 17</td>
                                <td>$65</td>
                            </tr>
                            <tr>
                                <td>17 to 20</td>
                                <td>$70</td>
                            </tr>
                            <tr>
                                <td>20 to 25</td>
                                <td>$80</td>
                            </tr>
                            <tr>
                                <td>25 to 30</td>
                                <td>$90</td>
                            </tr>
                            <tr>
                                <td>30 to 35</td>
                                <td>$100</td>
                            </tr>
                            <tr>
                                <td>35 to 40</td>
                                <td>$110</td>
                            </tr>
                            <tr>
                                <td>40 to 45</td>
                                <td>$120</td>
                            </tr>
                            <tr>
                                <td>45 to 50</td>
                                <td>$130</td>
                            </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col xs={12} sm={12} md={7}>
            <div className="dnote">
              <h3>Note to Customers:</h3>
              <ListGroup variant="flush">
                <ListGroup.Item>Please be available to answer the calls during the food delivery hours.</ListGroup.Item>
                <ListGroup.Item>Please offer help if needed when unloading food from the car.</ListGroup.Item>
                <ListGroup.Item>Ensure the cash/cheque is ready with you to hand over immediately after the food delivery.</ListGroup.Item>
                <ListGroup.Item>The warmer/burner setup adds extra cost depending on the number of food trays.</ListGroup.Item>
              </ListGroup>
            </div>
                    </Col>
                </Row>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeliveryChargesModal;
