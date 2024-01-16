import React from "react"
import style from "./Home.module.css";
import Header from "../../../components/Institucional/Header/Header";
import Footer from "../../../components/Cliente/Footer/Footer";

import img1StoryBoard from "../../../assets/Institucional/Home/img1StoryBoard.png"
import img2StoryBoard from "../../../assets/Institucional/Home/img2StoryBoard.png"
import img3StoryBoard from "../../../assets/Institucional/Home/img3StoryBoard.png"
import imgContainerLaranja from "../../../assets/Institucional/Home/imgContainerLaranja.png"
import imgCategorias from "../../../assets/Institucional/Home/imgCategorias.png"
import imgCalendario from "../../../assets/Institucional/Home/imgCalendario.png"
import imgEntrega from "../../../assets/Institucional/Home/imgEntrega.png"
import imgReceita from "../../../assets/Institucional/Home/imgReceita.png"
import imgBeneficios from "../../../assets/Institucional/Home/imgBeneficios.png"
import circuloLaranja from "../../../assets/Institucional/Home/circuloLaranja.png"

function Home() {

  return (
    <>
      <div className={style.body}>
        <Header />
        <div className={style.containerVerde}>
          <div className={style.containerStoryBoard}>
            <div className={style.storyBoard}>
              <div className={style.cardStoryBoard}>
                <img src={img1StoryBoard} />
                <p>Crie seu plano de <br /> assinatura <br /> personalizado</p>
              </div>
              <div className={style.cardStoryBoard}>
                <img src={img2StoryBoard} />
                <p>Receba ingredientes<br />frescos e receitas,<br /> entregues na medida<br /> certa</p>
              </div>
              <div className={style.cardStoryBoard}>
                <img src={img3StoryBoard} />
                <p>Desfruta de uma<br /> refeição caseira de qualidade </p>
              </div>
            </div>
          </div>
        </div>
        <div className={style.container}>
          <div className={style.containerTituloStoryBoard}>
            <b>Da Arte à Praticidade</b>
            <p>Crie Obras-Primas na Sua Cozinha </p>
            <div className={style.linhaLaranja} />
          </div>
        </div>
        <div className={style.containerLaranja}>
          <div className={style.imgContainerLaranja}>
            <div className={style.containerImages}>
              <img src={imgContainerLaranja} className={style.imgContainerLaranja} />
              <img src={imgCategorias} className={style.imgCategorias} />
            </div>
          </div>
        </div>
        <div className={style.textoCategorias}>
          <p>
            Desde os pratos Rápidos e Fáceis até mais Fit e Saudáveis, nossas <br />
            categorias para todos os tipos de gostos, paladares e estilos de vida.
          </p>
        </div>
        <div className={style.containerDetalhesAplicacao}>
          <div className={style.containerDetalheAgenda}>
            <img src={imgCalendario} />
            <div>
              <b>Sem tempo para ir às compras?</b>
              <p>
                Com a Culinart você pode agendar os<br /> dias e horários para receber seus<br /> ingredientes
              </p>
            </div>
          </div>
          <div className={style.containerDetalheEntrega}>
            <img src={imgEntrega} alt="" />
            <div>
              <b>A arte vai até você</b>
              <p>
                Nas semanas e no horário de sua escolha, seus ingredientes serão entregues para você
              </p>
            </div>
          </div>
        </div>
        <div className={style.containerDetalhesReceitas}>
          <div className={style.textosDetalhesReceitas}>
            <b>Receitas através de vídeos</b>
            <p>
              Seja você um novato ou um amante da cozinha, nossos vídeos são um guia<br /> cativante para criar pratos excepcionais!
            </p>
            <button>Ver Mais</button>
          </div>
          <img src={imgReceita} />
        </div>
        <div className={style.containerBeneficios}>
          <div className={style.beneficios}>
            <img src={imgBeneficios} />
            <div className={style.listaBeneficos}>
              <div className={style.itemLista}>
                <img src={circuloLaranja} />
                <p>
                  Explore uma gama de sabores globais com nossos kits de refeições personalizáveis
                </p>
              </div>
              <div className={style.itemLista}>
                <img src={circuloLaranja} />
                <p>
                Desfrute da conveniência de ter ingredientes frescos, com receitas detalhadas
                </p>
              </div>
              <div className={style.itemLista}>
                <img src={circuloLaranja} />
                <p>
                Ganhe tempo sem as idas ao mercado e o planejamento de refeições
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Home;
