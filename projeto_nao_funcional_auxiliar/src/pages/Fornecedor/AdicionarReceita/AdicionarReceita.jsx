import React, { useState, useEffect } from 'react';
import api from '../../../api/api';
import HeaderFornecedor from '../../../components/Fornecedor/HeaderFornecedor/HeaderFornecedor';
import style from './AdicionarReceita.module.css';
import trash from '../../../assets/Fornecedor/Receitas/trash.svg';
import { FaUpload } from 'react-icons/fa';
import { FaPlus } from "react-icons/fa";
import ModalPreferencias from '../../../components/Fornecedor/ModalPreferencias/ModalPreferencias';
import ModalCategorias from '../../../components/Fornecedor/ModalCategorias/ModalCategorias';
import { useNavigate } from "react-router-dom";

function AdicionarReceita() {

  const [preferencias, setPreferencias] = useState([])
  const [categorias, setCategorias] = useState([])
  const [imagem, setImagem] = useState(null);
  const [imagemUpload, setImagemUpload] = useState(null);
  const [exibirModalPreferencias, setExibirModalPreferencias] = useState(false);
  const [exibirModalCategorias, setExibirModalCategorias] = useState(false);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [preferenciasSelecionadas, setPreferenciasSelecionadas] = useState([]);
  const navigate = useNavigate();
  const [receita, setReceita] = useState({
    nome: '',
    horas: '',
    minutos: '',
    rendimento: '',
    descricao: '',
    ingredientes: [{
      quantidade: '',
      unidadeMedidaEnum: '',
      nome: ''
    }],
    modoPreparo: [{
      passo: ''
    }],
  });

  const atualizarCategoriasSelecionadas = (categorias) => {
    setCategoriasSelecionadas(categorias);
  };

  const atualizarPreferenciasSelecionadas = (preferencias) => {
    setPreferenciasSelecionadas(preferencias);
  };

  const handleFileUploadClick = () => {
    document.getElementById('seuInputFile').click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('Arquivo selecionado:', selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemUpload(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setImagem(selectedFile);
    }
  };

  const adicionarPasso = () => {
    setReceita((prevState) => ({
      ...prevState,
      modoPreparo: [...prevState.modoPreparo, { passo: '' }],
    }));
  };

  const adicionarIngrediente = () => {
    setReceita((prevState) => ({
      ...prevState,
      ingredientes: [...prevState.ingredientes, { quantidade: '', unidadeMedidaEnum: '', nome: '' }],
    }));
  };

  const handleSubmit = (e) => {
    const corpoRequisicao = {
      nome: receita.nome,
      horas: receita.horas,
      minutos: receita.minutos,
      descricao: receita.descricao,
      qtdPorcoes: receita.rendimento,
      imagem: '',
      ingredientes: receita.ingredientes,
      modoPreparos: receita.modoPreparo,
      categorias: categoriasSelecionadas,
      preferencias: preferenciasSelecionadas
    };

    e.preventDefault();

    //Cria a receita
    api.post('/receitas', corpoRequisicao, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
      },
    })
      .then((response) => {
        console.log('Nova receita adicionada:', response);
        const idReceita = response.data.id;

        const formData = new FormData();
        formData.append('imagem', imagem);

        //Salva a imagem no banco de dados
        api.post(`/receitas/salvar-imagem/${idReceita}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        })
          .then((response) => {
            console.log(response);

            //Enviar email e volta para a tela de receitas do fornecedor
            api.post(`emails/publicar/receitas/${idReceita}`, null, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
              },
            })
              .then((response) => {
                console.log(response);
                navegarReceitas();
              })
              .catch((error) => {
                console.error('Erro ao adicionar receita:', error);
              });
          })
              .catch ((error) => {
            console.error('Erro ao adicionar receita:', error);
          });
          })
          .catch((error) => {
            console.error('Erro ao adicionar imagem a receita:', error);
          });


  console.log('Esta é a receita', corpoRequisicao);
};

const buscarPreferencias = () => {
  api.get('/preferencias', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
    }
  }).then((response) => {
    setPreferencias(response.data);
  }).catch((error) => {
    console.log(error);
  });
};

const buscarCategorias = () => {
  api.get('/categorias', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
    }
  }).then((response) => {
    setCategorias(response.data);
  }).catch((error) => {
    console.log(error);
  });
};

const handleInputChange = (index, field, value, arrayField) => {
  setReceita((prevState) => {
    const newArrayField = [...prevState[arrayField]];
    newArrayField[index][field] = value;
    return { ...prevState, [arrayField]: newArrayField };
  });
};

const removerIngrediente = (index) => {
  if (receita.ingredientes.length > 1) {
    setReceita((prevState) => {
      const novosIngredientes = prevState.ingredientes.filter((_, i) => i !== index);
      return { ...prevState, ingredientes: novosIngredientes };
    });
  }
};

const removerPasso = (index) => {
  setReceita((prevState) => {
    const novoModoPreparo = prevState.modoPreparo.filter((_, i) => i !== index);
    return { ...prevState, modoPreparo: novoModoPreparo };
  });
};

const handleAbrirModalPreferencias = () => {
  setExibirModalPreferencias(true);
};

const handleFecharModalPreferencias = () => {
  setExibirModalPreferencias(false);
};

const handleAbrirModalCategorias = () => {
  setExibirModalCategorias(true);
};

const handleFecharModalCategorias = () => {
  setExibirModalCategorias(false);
};

const navegarReceitas = () => {
  navigate("/fornecedor/receitas");
};
useEffect(() => {
  buscarPreferencias();
  buscarCategorias();
}, []);

return (
  <>
    <HeaderFornecedor />
    <section onSubmit={handleSubmit} className={style.body}>
      <div className={style.topo}>
        <h1 className={`${style.titulo_pagina} mt-8 text-2xl`}>Adicionar Receita</h1>
        <div className={style.linha_horizontal} />
      </div>
      <div className={style.container_imagem_titulo}>
        <div className={style.container_imagem}>
          <div className={style.icone_upload} onClick={handleFileUploadClick}>
            <FaUpload size={25} color="rgba(0, 0, 0, 0.5)" />
          </div>
          {imagem && (
            <div className={style.imagem}>
              <img src={imagemUpload} alt="Imagem selecionada" />
            </div>
          )}
          <input
            type="file"
            id="seuInputFile"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept="image/jpeg"
          />
        </div>
        <div className={style.container_titulo_categoria}>
          <label>
            <span className=' text-base'>Titulo</span>
            <input
              className={style.input_titulo}
              value={receita.nome || ''}
              onChange={(e) => setReceita({
                ...receita,
                nome: e.target.value,
              })}
            />
          </label>
          <label>
            <span className=' text-base'>Descrição</span>
            <textarea cols="30" rows="3"
              value={receita.descricao || ''}
              onChange={(e) => setReceita({
                ...receita,
                descricao: e.target.value,
              })}
            />
          </label>
          <div className={style.container_categoria_preferencia}>
            <div onClick={handleAbrirModalPreferencias} className={style.itens}>
              <FaPlus /> ⠀
              <b>Preferências: </b>
              {preferenciasSelecionadas.slice(0, 1).map((preferencia, index) => (
                <React.Fragment key={index}>
                  <span style={{ backgroundColor: '#' + preferencia.corFundo, color: '#' + preferencia.corTexto }} className={style.item}>{preferencia.nome}</span>
                </React.Fragment>
              ))}
              {preferenciasSelecionadas.length > 1 && (
                <span>⠀e⠀mais {preferenciasSelecionadas.length - 1}</span>
              )}
            </div>
            <div onClick={handleAbrirModalCategorias} className={style.itens}>
              <FaPlus /> ⠀
              <b>Categorias:</b>
              {categoriasSelecionadas.slice(0, 1).map((categoria, index) => (
                <React.Fragment key={index}>
                  <span>{categoria.nome}</span>
                </React.Fragment>
              ))}
              {categoriasSelecionadas.length > 1 && (
                <span>⠀e⠀mais {categoriasSelecionadas.length - 1}</span>
              )}
            </div>
          </div>

        </div>
      </div>
      <div className={style.container_medida_rendimento}>
        <div className={style.container_rendimento_tempo}>
          <div className={style.container_rendimento}>
            <h1 className=' text-base'>Rendimento</h1>
            <div className={style.rendimento}>
              <span>Ingredientes para render</span>
              <input
                type='number'
                value={receita.rendimento || ''}
                onChange={(e) => setReceita({
                  ...receita,
                  rendimento: e.target.value
                })}
                min={0}
              />
              <span>porções</span>
            </div>
          </div>
          <div className={style.container_tempo}>
            <h1 className=' text-base'>Tempo de preparo</h1>
            <div className={style.tempo}>
              <input
                type='number'
                value={receita.horas || ''}
                onChange={(e) => setReceita({
                  ...receita,
                  horas: e.target.value
                })}
                min={0}
              />
              <span>Hora(s) e</span>
              <input
                type='number'
                value={receita.minutos || ''}
                onChange={(e) => setReceita({
                  ...receita,
                  minutos: e.target.value,
                })}
                min={0}
              />
              <span>Minuto(s)</span>
            </div>
          </div>
        </div>
        <div className={style.unidade_medida}>
          <div className={style.titulos_medida}>
            <h1 className={`${style.titulo_quantidade} text-base`}>Quantidade</h1>
            <h1 className={`${style.titulo_unidade} text-base`}>Unidade</h1>
            <h1 className={`${style.titulo_ingrediente} text-base`}>Ingrediente</h1>
          </div>
          {receita.ingredientes.map((ingrediente, index) => (
            <div className={style.inputs_medida} key={index}>
              <input
                type="number"
                value={ingrediente.quantidade || ''}
                className={style.input_quantidade}
                onChange={(e) => handleInputChange(index, 'quantidade', e.target.value, 'ingredientes')}
                min={0}
              />
              <select
                name="select"
                value={ingrediente.unidadeMedidaEnum || ''}
                className={style.input_unidade}
                onChange={(e) => handleInputChange(index, 'unidadeMedidaEnum', e.target.value, 'ingredientes')}
              >
                <option value="">--</option>
                <option value="UNIDADE">Unidade</option>
                <option value="LITRO">Litro</option>
                <option value="KILO">Kilo</option>
                <option value="GRAMA">Grama</option>
                <option value="MILIGRAMA">Miligrama</option>
                <option value="MILILITRO">Mililitro</option>
                <option value="XICARA">Xicara</option>
                <option value="SEM_UNIDADE">Sem Unidade</option>
                <option value="COLHER_SOPA">Colher de sopa</option>
                <option value="COLHER_CHA">Colher de chá</option>
              </select>
              <input
                type="text"
                value={ingrediente.nome || ''}
                className={style.input_ingrediente}
                onChange={(e) => handleInputChange(index, 'nome', e.target.value, 'ingredientes')}
              />
              <img src={trash} className={style.icone} onClick={() => removerIngrediente(index)} alt="icone de lata de lixo" />
            </div>
          ))}

          <button className={style.adicionar_ingrediente} onClick={adicionarIngrediente}>
            Adicionar Ingrediente
          </button>
        </div>
      </div>
      <div className={style.container_modo_preparo}>
        <h1 className={style.titulo_preparo}>Modo de preparo</h1>
        {receita.modoPreparo.map((passo, index) => (
          <div key={index}>
            <div className={style.passo}>
              <span>Passo {index + 1}</span>
              <img src={trash} className={style.icone} onClick={() => removerPasso(index)} alt="icone de lata de lixo" />
              <textarea cols="30" rows="3" value={passo.passo} onChange={(e) => handleInputChange(index, 'passo', e.target.value, 'modoPreparo')} />
            </div>
          </div>
        ))}
        <button className={style.adicionar_ingrediente} onClick={adicionarPasso}>
          Adicionar passo
        </button>
      </div>
      <div className={style.botoes}>
        <button className={style.cancelar} onClick={() => navigate(-1)}> Cancelar </button>
        <button onClick={handleSubmit} className={style.confirmar}>Confirmar</button>
      </div>
    </section>
    {exibirModalPreferencias && (
      <ModalPreferencias
        handleFecharModal={handleFecharModalPreferencias}
        preferencias={preferencias}
        atualizarPreferenciasSelecionadas={atualizarPreferenciasSelecionadas}
        listaPreferenciasSelecionadas={preferenciasSelecionadas}
      />
    )}
    {exibirModalCategorias && (
      <ModalCategorias
        handleFecharModal={handleFecharModalCategorias}
        categorias={categorias}
        atualizarCategoriasSelecionadas={atualizarCategoriasSelecionadas}
        listaCategoriasSelecionadas={categoriasSelecionadas}
      />
    )}
  </>
);
}

export default AdicionarReceita;