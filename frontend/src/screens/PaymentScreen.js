import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Button, Form } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = ({ history }) => {
    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    if (!shippingAddress.address) {
        history.push("/shipping");
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        history.push("/placeorder");
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="adress">
                    <Form.Label as="legend">Select Method</Form.Label>
                    <Col>
                        <Form.Check type="radio" label="PayPal or CreditCard" id="paypal" name="paymentmethod" checked onChange={(e) => setPaymentMethod(e.target.value)}>

                        </Form.Check>
                    </Col>
                </Form.Group>
                <Button type="submit" variant="primary" className="my-2">Continue</Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
