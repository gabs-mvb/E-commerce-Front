import React from 'react';
import { Link } from 'react-router-dom';
import Image from "../../../assets/products/Kit-3.jpg";
import "../../products/css/Product.css"; // Import the CSS file

function RelatedProduct(props) {
  const price = 250;
  let percentOff;
  let offPrice = `R$ ${price}`;

  if (props.percentOff && props.percentOff > 0) {
    percentOff = (
      <div
        className="badge bg-dim py-2 text-white position-absolute"
        style={{ top: "0.5rem", right: "0.5rem" }}
      >
        {props.percentOff}% OFF
      </div>
    );

    offPrice = (
      <>
        <del>R$ {price}</del> - R$ {price - (props.percentOff * price) / 100}
      </>
    );
  }

  return (
    <div className="col">
      <div className="card shadow-sm product-card">
        <Link to="/products/1" href="!#" replace>
          {percentOff}
          <div className="card-img-top bg-dark product-image" style={{ backgroundImage: `url(${Image})` }} />
        </Link>
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate">
            Kit - 2
          </h5>
          <p className="card-text text-center text-muted mb-0">{offPrice}</p>
        </div>
      </div>
    </div>
  );
}

export default RelatedProduct;
