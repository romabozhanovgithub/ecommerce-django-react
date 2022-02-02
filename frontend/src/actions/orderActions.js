import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    CART_CLEAR_ITEMS,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_LIST_MY_REQUEST,
    ORDER_LIST_MY_SUCCESS,
    ORDER_LIST_MY_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DELIVER_FAIL
} from "./types";

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_CREATE_REQUEST })

        const { userLogin: { userInfo }, } = getState();

        const res = await fetch("http://localhost:8000/api/order/add/", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(order)
        });
        const data = await res.json();

        if (res.ok === false) {
            throw new Error(data.detail);
        }

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        });

        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data
        });

        localStorage.removeItem("cartItems");
    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DETAILS_REQUEST })

        const { userLogin: { userInfo }, } = getState();

        const res = await fetch(`http://localhost:8000/api/order/${id}/`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            }
        });
        const data = await res.json();

        console.log(data)

        if (res.ok === false) {
            throw new Error(data.detail);
        }

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const payOrder = (id, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_PAY_REQUEST })

        const { userLogin: { userInfo }, } = getState();

        const res = await fetch(`http://localhost:8000/api/order/${id}/pay/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(paymentResult)
        });
        const data = await res.json();

        if (res.ok === false) {
            throw new Error(data.detail);
        }

        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const listMyOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_MY_REQUEST })

        const { userLogin: { userInfo }, } = getState();

        const res = await fetch("http://localhost:8000/api/order/myorders/", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            }
        });
        const data = await res.json();

        if (res.ok === false) {
            throw new Error(data.detail);
        }

        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const listOrders = () => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_LIST_REQUEST })

        const { userLogin: { userInfo }, } = getState();

        const res = await fetch("http://localhost:8000/api/order/", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            }
        });
        const data = await res.json();

        if (res.ok === false) {
            throw new Error(data.detail);
        }

        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}

export const deliverOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({ type: ORDER_DELIVER_REQUEST })

        const { userLogin: { userInfo }, } = getState();

        const res = await fetch(`http://localhost:8000/api/order/${order.id}/deliver/`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
            body: JSON.stringify(order)
        });
        const data = await res.json();

        if (res.ok === false) {
            throw new Error(data.detail);
        }

        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.detail ? error.data.detail : error.message
        })
    }
}
