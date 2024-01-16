import React, { useState, useEffect } from "react";
import HeaderFornecedor from "../../../components/Fornecedor/HeaderFornecedor/HeaderFornecedor";
import iconeBusca from "../../../assets/Fornecedor/Receitas/search.svg";
import { FiEdit } from "react-icons/fi";
import ItemReceita from "../../../components/Fornecedor/ItemReceita/ItemReceita";
import api from "../../../api/api";
import style from './Receitas.module.css';
import receitaDefault from '../../../assets/Receitas/receita-default.jpeg';


function ReceitasFornecedor() {
    const [preferencias, setPreferencias] = useState([]);
    const [receitas, setReceitas] = useState([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [isPesquisando, setIsPesquisando] = useState(false);

    const [modalAberto, setModalAberto] = useState(false);

    const handleFecharModal = () => {
        setModalAberto(false);
    }

    useEffect(() => {
        buscarReceitas();
    }, []);

    const buscarReceitas = () => {
        api.get('/receitas', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
          }
        })
          .then((response) => {
            const promises = response.data.map(async (receita) => {
              try {
                const idReceita = receita.id;
                const imagemResponse = await api.get(`/receitas/imagem/${idReceita}`, {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    responseType: 'arraybuffer'
                  }
                });
                if (imagemResponse.status == 204) {
                  receita.imagem = receitaDefault;
                  return receita;
                }
                receita.imagem = "data:image/jpeg;base64," + imagemResponse.data;
                return receita;
    
              } catch (error) {
                if (error.response && error.response.status === 404) {
                  // Se a imagem não for encontrada, atribua a imagem padrão
                  receita.imagem = receitaDefault;
                  return receita;
                } else {
                  console.error(`Erro ao processar imagem da receita ${receita.id}`, error);
                  return receita;
                }
              }
            });
    
            Promise.all(promises)
              .then((receitasComImagens) => {
                setReceitas(receitasComImagens);
              })
              .catch((error) => {
                console.error("Erro ao processar promessas", error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    
      const buscarReceitasPorTermo = (termo) => {
        if (termo.trim() === "") {
          // Se o termo estiver vazio, retorne todas as receitas
          buscarReceitas();
          return;
        }
    
        api.get(`/buscar?termo=${termo}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
          }
        })
          .then((response) => {
            const promises = response.data.map(async (receita) => {
              try {
                const idReceita = receita.id;
                const imagemResponse = await api.get(`/receitas/imagem/${idReceita}`, {
                  headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    responseType: 'arraybuffer'
                  }
                });
                if (imagemResponse.status == 204) {
                  receita.imagem = receitaDefault;
                  return receita;
                }
                
                receita.imagem = "data:image/jpeg;base64," + imagemResponse.data;
                return receita;
    
              } catch (error) {
                if (error.response && error.response.status === 404) {
                  // Se a imagem não for encontrada, atribua a imagem padrão
                  receita.imagem = receitaDefault;
                  return receita;
                } else {
                  console.error(`Erro ao processar imagem da receita ${receita.id}`, error);
                  return receita;
                }
              }
            });
    
            Promise.all(promises)
              .then((receitasComImagens) => {
                setReceitas(receitasComImagens);
              })
              .catch((error) => {
                console.error("Erro ao processar promessas", error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      };

      const handleBusca = (event) => {
        const novoTermo = event.target.value;
        setTermoBusca(novoTermo);
    
        if (novoTermo.trim() !== "") {
          setIsPesquisando(true);
          buscarReceitasPorTermo(novoTermo);
        } else {
          setIsPesquisando(false);
          buscarReceitas();
        }
      };
    
      const receitasFiltradas = receitas.filter((receita) => {
        return receita.nome.toLowerCase().includes(termoBusca.toLowerCase());
      });

    return (
        <>
            <HeaderFornecedor />
            <div className="items-center justify-center w-full mt-10 flex flex-col">
                <div className="pb-3 items-end justify-between w-4/5 flex border-b border-gray-300 ">
                    <div>
                        <h1 className="text-2xl text-[#045D53] mb-4">Você faz parte disso!</h1>
                        <button>
                            <a href="/fornecedor/adicionar-receita" className="rounded-lg border border-black bg-white px-5 py-0.4">
                                Adicionar Receita +
                            </a>
                        </button>
                    </div>
                    <div className="relative flex items-center">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-80 border border-gray-300 rounded-full py-1 px-4"
                                placeholder="Pesquisar..."
                                value={termoBusca}
                                onChange={handleBusca}
                            />
                            <img
                                src={iconeBusca}
                                alt="Search Icon"
                                className="absolute top-1/2 transform -translate-y-1/2 right-2 h-5 w-5 text-gray-500"
                            />
                        </div>
                    </div>
                </div>
                <div className={style.container_receitas}>
                {isPesquisando
                        ? receitasFiltradas.length > 0
                            ? receitasFiltradas.map((receita, index) => (
                                <ItemReceita
                                    key={index}
                                    id={receita.id}
                                    nome={receita.nome}
                                    horas={receita.horas}
                                    minutos={receita.minutos}
                                    descricao={receita.descricao}
                                    qtdAvaliacao={receita.qtdAvaliacoes}
                                    mediaAvaliacao={receita.mediaAvaliacoes}
                                    ingredientes={receita.ingredientes}
                                    rendimento={receita.porcoes}
                                    preparo={receita.modoPreparos}
                                    categoria={receita.categorias}
                                    preferencia={receita.preferencias}
                                    imagem={receita.imagem}
                                    abrirModal={() => setModalAberto(true)}
                                />
                            ))
                            : <div className="text-gray-600 text-2xl w-full text-center">Nenhum resultado encontrado</div>
                        : (receitas ?? []).length > 0
                            ? (receitas ?? []).map((receita, index) => (
                                <ItemReceita
                                key={index}
                                id={receita.id}
                                nome={receita.nome}
                                horas={receita.horas}
                                minutos={receita.minutos}
                                descricao={receita.descricao}
                                qtdAvaliacao={receita.qtdAvaliacoes}
                                mediaAvaliacao={receita.mediaAvaliacoes}
                                ingredientes={receita.ingredientes}
                                rendimento={receita.porcoes}
                                preparo={receita.modoPreparos}
                                categoria={receita.categorias}
                                preferencia={receita.preferencias}
                                imagem={receita.imagem}
                                    abrirModal={() => setModalAberto(true)}
                                />
                            ))
                            : <div className="text-gray-600 text-2xl w-full text-center">Nenhum resultado encontrado</div>
                    }
                </div>
            </div>
        </>
    );
}

export default ReceitasFornecedor;