import React from "react"
import style from "./ComoFunciona.module.css";
import Header from "../../../components/Institucional/Header/Header";
import { useNavigate } from 'react-router-dom';

import duvida from "../../../assets/como-funciona/duvida.svg";
import refeicoes from "../../../assets/como-funciona/refeicoes.svg";
import plano from "../../../assets/como-funciona/escolha-plano.svg";
import entrega from "../../../assets/como-funciona/entrega.svg";
import fazendo_receita from "../../../assets/como-funciona/fazendo-receita.svg";
import comendo from "../../../assets/como-funciona/aproveitando-refeicao.svg";
import Footer from "../../../components/Cliente/Footer/Footer";

function ComoFunciona() {

    const navigate = useNavigate()

    const cadastro = () => {
        navigate('/cadastro/info-pessoal')
    }

    return (
        <>
            <Header />
            <body className={style.body}>
                <section className={style.oque_e}>
                    <img src={duvida} className={style.imagem_topico} alt="" />
                    <div className={style.texto}>
                        <h1>O que é kit de refeição</h1>
                        <p>
                            <p>
                                Kit de refeição é um conjunto de ingredientes e receitas pré-selecionados e pré-embalados, que são entregues na casa do consumidor. O consumidor deve apenas seguir as instruções de preparo para preparar a refeição.
                            </p>
                            <br />
                            <p>
                                Os kits de refeição são uma opção conveniente e prática para pessoas que desejam economizar tempo na cozinha, ou que não possuem habilidades culinárias. Os kits geralmente incluem ingredientes frescos e de boa qualidade, e as instruções são claras e fáceis de seguir.
                            </p>
                        </p>
                    </div>
                </section>

                <section className={style.como_fazemos}>
                    <h1>Como fazemos arte</h1>
                    <div className={style.container_itens}>
                        <div className={style.item}>
                            <img src={plano} alt="" />
                            <span>Escolha um plano</span>
                            <div className={style.linha}>
                                <div className={style.circulo} />
                            </div>
                        </div>
                        <div className={style.item}>
                            <img src={entrega} alt="" />
                            <span>Receba os ingredientes</span>
                            <div className={style.linha}>
                                <div className={style.circulo} />
                            </div>
                        </div>
                        <div className={style.item}>
                            <img src={fazendo_receita} alt="" />
                            <span>Prepare as receitas</span>
                            <div className={style.linha}>
                                <div className={style.circulo} />
                            </div>
                        </div>
                        <div className={style.item}>
                            <img src={comendo} alt="" />
                            <span>Aproveite sua refeição!</span>
                            <div className={style.linha}>
                                <div className={style.circulo} />
                            </div>
                        </div>
                    </div>
                </section>

                <section className={style.variedade}>
                    <img src={refeicoes} className={style.imagem_topico} alt="" />
                    <div className={style.texto}>
                        <h1>Qual a variedade das receitas?</h1>
                        <p>
                            Uma das principais vantagens dos kits de refeição é a variedade de receitas disponíveis. Os kits oferecem uma ampla gama de opções, desde pratos tradicionais até receitas mais exóticas. Isso torna possível experimentar novos sabores e pratos sem ter que planejar ou comprar os ingredientes.
                        </p>
                        <button onClick={cadastro}>Faça parte disso!</button>
                    </div>
                </section>
            </body>
            <Footer />
        </>
    )
}

export default ComoFunciona;
