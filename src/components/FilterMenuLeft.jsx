import React, { useState } from "react";

function FilterMenuLeft({
  categories,
  brands,
  onBrandToggle,
  onCategorySelect,
  onPriceMinChange,
  onPriceMaxChange,
  selectedBrands,
  selectedCategory,
  selectedPriceRange,
}) {
  const [minPrice, setMinPrice] = useState(selectedPriceRange?.min || "");
  const [maxPrice, setMaxPrice] = useState(selectedPriceRange?.max || "");

  // Função para formatar o preço para o formato brasileiro (ex: R$ 1.000,50)
  const formatPrice = (value) => {
    // Remover qualquer caractere não numérico (exceto a vírgula para a casa decimal)
    const numericValue = value.replace(/[^\d,]/g, "");
    
    // Se houver vírgula, garantir que ela seja usada corretamente
    if (numericValue.includes(",")) {
      const parts = numericValue.split(",");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Adiciona ponto como separador de milhar
      return `R$ ${parts.join(",")}`; // Junta as partes de volta com a vírgula
    } else {
      return `R$ ${numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`; // Adiciona ponto como separador de milhar
    }
  };

  // Função para manipular a mudança de preço mínimo
  const handlePriceMinChange = (e) => {
    const value = e.target.value;
    const unmaskedValue = value.replace(/[^\d,]/g, "").replace(",", "."); // Remove formatação e substitui vírgula por ponto
    setMinPrice(formatPrice(value)); // Aplica a formatação com o "R$"
    onPriceMinChange(parseFloat(unmaskedValue)); // Envia o valor numérico para o filtro
  };

  // Função para manipular a mudança de preço máximo
  const handlePriceMaxChange = (e) => {
    let value = e.target.value;
    const unmaskedValue = value.replace(/[^\d,]/g, "").replace(",", "."); // Remove formatação e substitui vírgula por ponto
  
    setMaxPrice(formatPrice(value)); // Aplica a formatação com o "R$"
    onPriceMaxChange(parseFloat(unmaskedValue)); // Envia o valor numérico para o filtro
  };
  

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      {/* Filtro de Categorias */}
      <div className="mb-4">
        <h5 className="mb-3">Categoria</h5>
        <ul className="list-unstyled">
          {categories.map((category) => (
            <li key={category.id} className="mb-2">
              <button
                onClick={() => onCategorySelect(category)}
                className={`btn text-start w-100 ${selectedCategory === category ? "fw-bold bg-primary text-white" : "text-dark"}`}
                style={{ textDecoration: "none", border: "none" }}
              >
                {category.nome}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Filtro de Marcas */}
      <div className="mb-4">
        <h5 className="mb-3">Marca</h5>
        <ul className="list-unstyled">
          {brands.map((brand) => (
            <li key={brand} className="mb-2">
              <label className="d-flex align-items-center">
                <input
                  type="checkbox"
                  onChange={(e) => onBrandToggle(brand, e.target.checked)}
                  checked={selectedBrands.includes(brand)}
                  className="form-check-input me-2"
                />
                {brand}
              </label>
            </li>
          ))}
        </ul>
      </div>

        {/* TODO: arrumar filtro de pesquisa por produto com desconto */}
      {/* Filtro de Faixa de Preço */}
      <div className="mb-4">
        <h5 className="mb-3">Faixa de Preço</h5>
        <div className="mb-3">
          <label htmlFor="minPrice" className="form-label">
            Preço Mínimo
          </label>
          <input
            id="minPrice"
            type="text"
            className="form-control"
            value={minPrice}
            placeholder="R$ 0"
            onChange={handlePriceMinChange}
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="form-label">
            Preço Máximo
          </label>
          <input
            id="maxPrice"
            type="text"
            className="form-control"
            value={maxPrice}
            placeholder="R$ 1000"
            onChange={handlePriceMaxChange}
          />
        </div>
      </div>
    </div>
  );
}

export default FilterMenuLeft;
