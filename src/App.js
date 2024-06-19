import Template from "./components/Template";
import ProductDetail from "./pages/products/detail/ProductDetail";
import { Switch, Route } from "react-router-dom";
import Landing from "./pages/landing/Landing";
import ProductList from "./pages/products/ProductList";
import Login from "./pages/login/Login";
import Singup from "./pages/login/Singup";

function App() {
  return (
    <Template>
      <Switch>
        <Route path="/products" exact>
          <ProductList />
        </Route>
        <Route path="/products/:slug">
          <ProductDetail />
        </Route>
        <Route path="/" exact>
          <Landing />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/singup" exact>
          <Singup />
        </Route>
      </Switch>
    </Template>
  );
}

export default App;
