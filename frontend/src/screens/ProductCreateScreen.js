import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../actions/types";

const ProductCreateScreen = ({ match, history }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const dispatch = useDispatch();

    const productCreate = useSelector(state => state.productCreate);  
    const { error: errorCreate, loading: loadingCreate, success: successCreate } = productCreate;

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (successCreate) {
            dispatch({ type: PRODUCT_CREATE_RESET })
            history.push("/admin/productlist")
        }
        else if (!userInfo || !userInfo.isAdmin) {
            history.push("/")
        }
    }, [dispatch, history, successCreate])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProduct({
            name,
            price,
            brand,
            category,
            countInStock,
            description
        }))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append("image", file)

        setUploading(true)

        try {
            const res = await fetch("http://localhost:8000/api/product/upload/", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: formData
            });
            const data = await res.json();

            setImage(data)
            setUploading(false)
        } catch (error) {
            setUploading(false)
        }
    }

    return (
        <div>
            <Link to="/admin/productlist">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {errorCreate && <Message variant="danger">{errorCreate}</Message>}
                {loadingCreate ? <Loader/> : errorCreate ? <Message variant="danger">{errorCreate}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="name" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="text" placeholder="Enter image" value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>
                            <Form.File id="image-file" label="Choose File" custom onChange={uploadFileHandler}></Form.File>
                            {uploading && <Loader/>}
                        </Form.Group>
                        <Form.Group controlId="brand">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="category">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="countInStock">
                            <Form.Label>Count in stock</Form.Label>
                            <Form.Control type="number" placeholder="Enter countInStock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Button type="submit" variant="primary" className="my-2">Create</Button>
                    </Form>
                )}
            </FormContainer>
        </div>
    )
}

export default ProductCreateScreen
