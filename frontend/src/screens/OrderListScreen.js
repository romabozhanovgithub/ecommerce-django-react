import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listOrders } from "../actions/orderActions";

const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (userInfo && userInfo.is_admin) {
            dispatch(listOrders())
        }
        else if (!userInfo || !userInfo.is_admin) {
            history.push("/login")
        }
    }, [dispatch, history, userInfo])

    return (
        <div>
            <h1>Orders</h1>
            {loading ? (
                <Loader/>
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.created_at.substring(0, 10)}</td>
                                <td>{order.total_price}</td>
                                <td>{order.is_paid ? (
                                    order.paid_at.substring(0, 10)
                                ) : (
                                    <i className="fas fa-check" style={{ color: "red" }}></i>
                                )}</td>
                                <td>{order.is_delivered ? (
                                    order.delivered_at.substring(0, 10)
                                ) : (
                                    <i className="fas fa-check" style={{ color: "red" }}></i>
                                )}</td>
                                <td>
                                    <LinkContainer to={`/order/${order.id}`}>
                                        <Button variant="light" className="btn-sm">
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    )
}

export default OrderListScreen
