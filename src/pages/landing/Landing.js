import React from "react";
import Banner from "../../pages/landing/Banner";
import FeatureProduct from "../../pages/landing/FeatureProduct";
import ScrollToTopOnMount from "../../components/ScrollToTopOnMount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Landing() {
  const products = [
    {
      id: 1,
      title: "Kit 1",
      price: "R$ 350",
      image: "Kit-1.jpg",
    },
    {
      id: 2,
      title: "Kit 2",
      price: "R$ 250",
      image: "Kit-2.jpg",
    },
    {
      id: 4,
      title: "Kit 1",
      price: "R$ 350",
      image: "Kit-1.jpg",
    },
    {
      id: 5,
      title: "Kit 1",
      price: "R$ 350",
      image: "Kit-1.jpg",
    },
    // Adicione mais produtos conforme necessário
  ];

  return (
    <>
      <ScrollToTopOnMount />
      <Banner />
      <div className="d-flex flex-column bg-white py-4">
        <p className="text-center px-5">
          Descubra uma variedade incrível de produtos com preços reduzidos em nossa seção de outlet. 
        <br/>
          Aproveite para renovar seu guarda-roupa com estilo e economia!
        </p>
        <div className="d-flex justify-content-center">
          <Link to="/products" className="btn btn-primary" replace>
            Procure produtos
          </Link>
        </div>
      </div>
      <h2 className="text-muted text-center mt-4 mb-3">Lançamentos</h2>
      <div className="container pb-5 px-lg-5">
        <div className="row">
        {products.slice(0, 3).map((product) => (
            <FeatureProduct
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              productId={product.id}
            />
          ))}
        </div>
      </div>
      <div className="d-flex flex-column bg-white py-4">
        <h5 className="text-center mb-3">Siga-nos também</h5>
        <div className="d-flex justify-content-center">
          <a href="!#" className="me-3">
            <FontAwesomeIcon icon={["fab", "facebook"]} size="2x" />
          </a>
          <a href="!#">
            <FontAwesomeIcon icon={["fab", "instagram"]} size="2x" />
          </a>
          <a href="!#" className="ms-3">
            <FontAwesomeIcon icon={["fab", "twitter"]} size="2x" />
          </a>
        </div>
      </div>
    </>
  );
}

export default Landing;
