import React from "react";
import { Link } from "react-router-dom";
import Imagem from './../../assets/products/Kit-1.jpg';

function FeatureProduct({ image, title, price, productId }) {

  var baseUrl = './../../assets/products/';
  console.log(baseUrl+image)
  return (
    <div className="col">
      <div className="card shadow-sm">
        <img
          className="card-img-top bg-dark cover"
          height="240"
          alt=""
          src={Imagem}
        />
        <div className="card-body">
          <h5 className="card-title text-center">{title}</h5>
          <p className="card-text text-center text-muted">{price}</p>
          <div className="d-grid gap-2">
            <Link to={`/products/${productId}`} className="btn btn-outline-dark" replace>
              Detalhes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureProduct;
