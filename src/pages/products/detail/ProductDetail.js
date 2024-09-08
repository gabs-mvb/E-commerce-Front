import Image from "../../../assets/products/Kit-1.jpg";
import RelatedProduct from "../detail/RelatedProduct";
import { Link } from "react-router-dom";
import ScrollToTopOnMount from "../../../components/ScrollToTopOnMount";
import Ratings from "react-ratings-declarative";


const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";

function ProductDetail() {
  function changeRating(newRating) { }

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded mb-4">
        <ol className="breadcrumb p-3">
          <li className="breadcrumb-item">
            <Link to="/products" className="text-decoration-none link-secondary">
              Todos os produtos
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products" className="text-decoration-none link-secondary">
              Kits
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Kit - 1
          </li>
        </ol>
      </nav>
      <div className="row mb-4">
        <div className="d-none d-lg-block col-lg-1">
          <div className="image-vertical-scroller">
            <div className="d-flex flex-column">
              {Array.from({ length: 10 }, (_, i) => {
                let selected = i !== 1 ? "opacity-6" : "";
                return (
                  <a key={i} href="!#">
                    <img
                      className={"rounded mb-2 ratio " + selected}
                      alt=""
                      src={Image}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="row">
            <div className="col-12 mb-4">
              <img
                className="border rounded ratio ratio-1x1"
                alt=""
                src={Image}
              />
            </div>
          </div>

          {/* <div className="row mt-2">
            <div className="col-12">
              <div
                className="d-flex flex-nowrap"
                style={{ overflowX: "scroll" }}
              >
                {Array.from({ length: 8 }, (_, i) => {
                  return (
                    <a key={i} href="!#">
                      <img
                        className="cover rounded mb-2 me-2"
                        width="70"
                        height="70"
                        alt=""
                        src={Image}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div> */}
        </div>

        <div className="col-lg-5">
          <div className="d-flex flex-column h-100">
            <h2 className="mb-1">Kit Customizado Nike Professional</h2>
            <h4 className="text-muted mb-4">R$ 500</h4>

            <div className="row g-3 mb-4">
              <div className="col">
                <button className="btn btn-outline-dark py-2 w-100">
                  Adicionar ao carrinho
                </button>
              </div>
              <div className="col">
                <button className="btn btn-dark py-2 w-100">Comprar agora</button>
              </div>
            </div>

            <h4 className="mb-0">Detalhes</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-4">Código</dt>
              <dd className="col-sm-8 mb-3">C0001</dd>

              <dt className="col-sm-4">Caregoria</dt>
              <dd className="col-sm-8 mb-3">Kits</dd>

              <dt className="col-sm-4">Marca</dt>
              <dd className="col-sm-8 mb-3">Nike</dd>

              <dt className="col-sm-4">Cores</dt>
              <dd className="col-sm-8 mb-3">Preto, Cinza e Branco</dd>

              <dt className="col-sm-4">Status</dt>
              <dd className="col-sm-8 mb-3">20 Unidades restantes</dd>

              <dt className="col-sm-4">Avaliações</dt>
              <dd className="col-sm-8 mb-3">
                <Ratings
                  rating={4.5}
                  widgetRatedColors="rgb(253, 204, 13)"
                  changeRating={changeRating}
                  widgetSpacings="2px"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    return (
                      <Ratings.Widget
                        key={i}
                        widgetDimension="20px"
                        svgIconViewBox="0 0 19 20"
                        svgIconPath={iconPath}
                        widgetHoverColor="rgb(253, 204, 13)"
                      />
                    );
                  })}
                </Ratings>
              </dd>
            </dl>

            <h4 className="mb-0">Descrição</h4>
            <hr />
            <p className="lead flex-shrink-0">
              <small>
                Boné Preto Nike na cor preta, com o logotipo da Nike bordado na parte frontal.
                Ideal para uso casual, proteção solar e compor looks esportivos ou casuais.
                <br />
                Camiseta Preta Nike de manga curta na cor preta.
                Confeccionada em tecido confortável, adequada para uso diário, atividades físicas leves ou para compor um look casual.
                <br />
                Shorts Cinza com Bolsos Nike na cor cinza claro com detalhes em preto e bolsos utilitários.
                Cós elástico com cordão para ajuste.
                Ideal para atividades esportivas, caminhadas ou uso casual.
                <br/>
                Chinelo Branco Nike na cor branca com detalhes acolchoados.
                <br/><br/>
                Adequado para uso em casa, na praia, na piscina ou em situações de lazer.
                Este conjunto é versátil, combinando elementos confortáveis e práticos para diferentes atividades do dia a dia, como esportes, caminhadas, passeios ou uso casual. O design moderno e os materiais de qualidade garantem conforto e estilo.
              </small>
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <hr />
          <h4 className="text-muted my-4">Produtos relacionados</h4>
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
            {Array.from({ length: 4 }, (_, i) => {
              return (
                <RelatedProduct key={i} percentOff={i % 2 === 0 ? 15 : null} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
