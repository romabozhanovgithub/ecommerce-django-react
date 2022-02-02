import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product.id}`}>
                <Card.Img src={product.image}/>
            </Link>
            <Card.Body>
                <Link to={`/product/${product.id}`}>
                    <Card.Title as="div">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as="div">
                    <div className="my-3">
                        <Rating value={product.rating} text={`${product.num_reviews} reviews`} color={"#f83825"}/>
                    </div>
                </Card.Text>
                <Card.Text as="h4">
                    ${product.price}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
