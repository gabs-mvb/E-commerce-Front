import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollToTopOnMount from "../../components/ScrollToTopOnMount";
import { useCart } from "../../context/CartContext"; // Custom hook/contexto do carrinho

function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [viewType, setViewType] = useState({ grid: true });

  const produtoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Função para alterar a quantidade
  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, newQuantity);
  };

  // Função para remover um produto do carrinho
  const handleRemoveProduct = (productId) => {
    removeFromCart(productId);
  };

  // Calculando o total do carrinho
  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.preco * item.quantity, 0);
  };

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="bg-custom-light rounded">
        <ol className="breadcrumb p-3 mb-0">
          <li className="breadcrumb-item">
            <Link className="text-decoration-none link-secondary" to="/products" replace>
              Todos Produtos
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Carrinho
          </li>
        </ol>
      </nav>

      {/* Título do carrinho */}
      <h2 className="mb-4">Carrinho de Compras</h2>

      {/* Listagem de Produtos no Carrinho */}
      <div className="row mb-3">
        <div className="col-12">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={produtoVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="row mb-3"
              >
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="img-fluid rounded me-3"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <h5>{item.nome}</h5>
                        <p>{item.marca}</p>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => handleRemoveProduct(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                      <div>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="form-control"
                          style={{ width: "70px" }}
                        />
                      </div>
                      <div className="ms-3">
                        <strong>R$ {item.preco * item.quantity}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center w-100">Seu carrinho está vazio.</p>
          )}
        </div>
      </div>

      {/* Resumo do Carrinho */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="border rounded p-3 shadow-sm">
            <h4>Resumo</h4>
            <div className="d-flex justify-content-between mt-3">
              <span>Total:</span>
              <strong>R$ {getTotal().toFixed(2)}</strong>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span>Frete:</span>
              <strong>R$ 0,00 (Grátis)</strong>
            </div>
            <div className="d-flex justify-content-between mt-3">
              <span>Total Final:</span>
              <strong>R$ {getTotal().toFixed(2)}</strong>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button className="btn btn-dark">Finalizar Compra</button>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Navegação */}
      <div className="d-flex justify-content-between mt-4">
        <Link to="/products" className="btn btn-outline-dark">
          Continuar Comprando
        </Link>
        <button className="btn btn-dark">Finalizar Compra</button>
      </div>
    </div>
  );
}

export default CartPage;
