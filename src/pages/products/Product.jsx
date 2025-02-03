import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from './../../assets/products/Kit-3.jpg';
import "../products/css/Product.css"; // Import the CSS file
import api from "../../api/Api";

function Product(props) {
  const { produto, percentOff } = props;

  const price = produto.preco.toFixed(2);
  let offPrice = `R$ ${price}`;

  // Handle percentOff if it exists
  if (percentOff && percentOff > 0) {
    offPrice = (
      <>
        <del>R$ {price}</del> - R$ {(price - (percentOff * price) / 100).toFixed(2)}
      </>
    );
  }

  return (
    <div className="col">
      <div className="card shadow-sm product-card">
        <Link to={`/products/${produto.id}`} href="!#" replace>
          {percentOff > 0 && (
            <div
              className="badge bg-dim py-2 text-white position-absolute"
              style={{ top: '0.5rem', right: '0.5rem' }}
            >
              {percentOff}% OFF
            </div>
          )}
          <div className="card-img-top bg-dark product-image" style={{ backgroundImage: `url(${Image})` }} />
        </Link>
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate">
            {produto.nome}
          </h5>
          <p className="card-text text-center text-muted mb-0">{offPrice}</p>
          <div className="d-grid d-block">
            <button className="btn btn-outline-dark mt-3"
            onClick={addProdutoCarrinho()}>
              <FontAwesomeIcon icon={['fas', 'cart-plus']} /> Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
