import Header from "./../components/Header";
import Content from "./../components/Content";
import Footer from "./../components/Footer";

function Template(props) {
  return (
    <>
      <Header />
      <Content>{props.children}</Content>
      <Footer />
    </>
  );
}

export default Template;
