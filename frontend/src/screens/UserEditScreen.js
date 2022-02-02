import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { getUserDetails, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../actions/types";

const UserEditScreen = ({ match, history }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState("");

    const userId = match.params.id

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.userDetails);  
    const { error, loading, user } = userDetails;
    
    const userUpdate = useSelector(state => state.userUpdate);  
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            console.log("r")
            history.push("/admin/userList")
        }
        else if (!successUpdate) {
            if (!user || !user.name || user.id !== Number(userId)) {
                dispatch(getUserDetails(userId))
            }
            else if (user) {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.is_admin)
            }
        }
    }, [dispatch, user, userId, successUpdate, history])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ id: user.id, name, email, isAdmin }))
    }

    return (
        <div>
            <Link to="/admin/userlist">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
                {loading ? <Loader/> : error ? <Message variant="danger">{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email Adress</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="isadmin">
                            <Form.Label>Is Admin</Form.Label>
                            <Form.Check type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="my-2">Update</Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    )
}

export default UserEditScreen
