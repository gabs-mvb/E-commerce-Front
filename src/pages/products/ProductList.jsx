import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Product from "../../pages/products/Product";
import ProductGrid from "./ProductGrid";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollToTopOnMount from "../../components/ScrollToTopOnMount";
import api from "../../api/Api";
import FilterMenuLeft from "../../../src/components/FilterMenuLeft";  // Importando o FilterMenuLeft

function ProductList() {
  const [viewType, setViewType] = useState({ grid: true });
  const [categorias, setCategorias] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Número de produtos por página
  
  const produtoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleBrandToggle = (brand, isChecked) => {
    setSelectedBrands(prev =>
      isChecked ? [...prev, brand] : prev.filter(b => b !== brand)
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(prev => prev === category ? null : category); 
  };

  const changeViewType = () => {
    setViewType({ grid: !viewType.grid });
  };

  // Simulando um fetch de produtos da API
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/produtos");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  // Filtrando os produtos com base nos parâmetros selecionados
  const filteredProducts = produtos.filter((produto) => {
    const matchesSearchTerm = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Verificação de categoria ajustada para comparar com o nome da categoria selecionada
    const matchesCategory = selectedCategory && typeof selectedCategory === "object" && selectedCategory.nome
      ? produto.categoria?.nome?.toLowerCase() === selectedCategory.nome.toLowerCase()
      : true;
  
    const matchesBrand = selectedBrands.length > 0 ? selectedBrands.includes(produto.marca) : true;
  
    const matchesPriceRange = (priceRange.min ? produto.preco >= priceRange.min : true) &&
      (priceRange.max ? produto.preco <= priceRange.max : true);
  
    return matchesSearchTerm && matchesCategory && matchesBrand && matchesPriceRange;
  });

  // Número total de páginas
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Paginação: seleciona os produtos para a página atual
  const currentPageProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    api.get("/categorias")
      .then((response) => setCategorias(response.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded">
  <ol className="breadcrumb p-3 mb-0">
    <li className="breadcrumb-item">
      <Link className="text-decoration-none link-secondary" to="/products" replace>
        Todos Produtos
      </Link>
    </li>

    {/* Verifica se existe uma categoria selecionada */}
    {selectedCategory ? (
      <li className="breadcrumb-item">
        <Link className="text-decoration-none link-secondary" to={`/products/category/${selectedCategory.id}`} replace>
          {selectedCategory.nome}
        </Link>
      </li>
    ) : null}

    {/* Se houver um termo de pesquisa, adiciona ao breadcrumb */}
    {searchTerm && (
      <li className="breadcrumb-item active" aria-current="page">
        {`Resultados para: ${searchTerm}`}
      </li>
    )}
    {/* Caso esteja na página de produtos sem categoria nem pesquisa */}
    {!selectedCategory && !searchTerm && (
      <li className="breadcrumb-item active" aria-current="page">
        Todos Produtos
      </li>
    )}
  </ol>
</nav>

      <div className="h-scroller d-block d-lg-none">
        <nav className="nav h-underline">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              className={`btn btn-sm rounded-pill me-2 mb-2 ${selectedCategory === categoria.nome ? "btn-dark text-white" : "btn-outline-dark"}`}
              onClick={() => handleCategorySelect(categoria.nome)}
            >
              {categoria.nome}
            </button>
          ))}
        </nav>
      </div>

      <div className="row mb-3 d-block d-lg-none">
        <div className="col-12">
          <div id="accordionFilter" className="accordion shadow-sm">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button className="accordion-button fw-bold collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-expanded="false" aria-controls="collapseFilter">
                  Filtro de Produtos
                </button>
              </h2>
            </div>
            <div id="collapseFilter" className="accordion-collapse collapse" data-bs-parent="#accordionFilter">
              <div className="accordion-body p-0">
                <FilterMenuLeft
                  categories={categorias}
                  brands={produtos.map((produto) => produto.marca).filter((value, index, self) => self.indexOf(value) === index)} // Obtendo marcas únicas
                  onBrandToggle={handleBrandToggle}
                  onCategorySelect={handleCategorySelect}
                  onPriceMinChange={(min) => setPriceRange(prev => ({ ...prev, min }))}
                  onPriceMaxChange={(max) => setPriceRange(prev => ({ ...prev, max }))}
                  selectedBrands={selectedBrands}
                  selectedCategory={selectedCategory}
                  selectedPriceRange={priceRange}
                  products={produtos}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 mt-lg-3">
        <div className="d-none d-lg-block col-lg-3">
          <div className="border rounded shadow-sm">
            <FilterMenuLeft
              categories={categorias}
              brands={produtos.map((produto) => produto.marca).filter((value, index, self) => self.indexOf(value) === index)} // Obtendo marcas únicas
              onBrandToggle={handleBrandToggle}
              onCategorySelect={handleCategorySelect}
              onPriceMinChange={(min) => setPriceRange(prev => ({ ...prev, min }))}
              onPriceMaxChange={(max) => setPriceRange(prev => ({ ...prev, max }))}
              selectedBrands={selectedBrands}
              selectedCategory={selectedCategory}
              selectedPriceRange={priceRange}
            />
          </div>
        </div>
        <div className="col-lg-9">
          <div className="d-flex flex-column h-100">
            <div className="row mb-3">
              <div className="col-lg-9 col-xl-5 offset-xl-7 d-flex flex-row">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Procurar produto..."
                    aria-label="search input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o termo de pesquisa
                  />
                  <button className="btn btn-outline-dark">
                    <FontAwesomeIcon icon={["fas", "search"]} />
                  </button>
                </div>
                <button className="btn btn-outline-dark ms-2 d-none d-lg-inline" onClick={changeViewType}>
                  <FontAwesomeIcon icon={["fas", viewType.grid ? "th-list" : "th-large"]} />
                </button>
              </div>
            </div>

            {/* Produtos Filtrados */}
            <div
              className={ 
                "row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3 mb-4 flex-shrink-0 " +
                (viewType.grid ? "row-cols-xl-3" : "row-cols-xl-2")
              }
            >
              {currentPageProducts.length > 0 ? (
                currentPageProducts.map((produto, index) => (
                  <motion.div
                    key={produto.id}
                    variants={produtoVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {viewType.grid ? (
                      <Product key={produto.id} produto={produto} percentOff={produto.desconto} />
                    ) : (
                      <ProductGrid key={produto.id} produto={produto} percentOff={produto.desconto} />
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-center w-100">Nenhum produto encontrado.</p>
              )}
            </div>

            {/* Paginação */}
            <div className="d-flex align-items-center mt-auto">
              <span className="text-muted small d-none d-md-inline">
                Listar {filteredProducts.length} de {filteredProducts.length}
              </span>
              <nav aria-label="Page navigation example" className="ms-auto">
                <ul className="pagination my-0">
                  <li className="page-item">
                    <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      Anterior
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => (
                    <li className={`page-item ${currentPage === index + 1 ? "active" : ""}`} key={index}>
                      <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      Próximo
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
