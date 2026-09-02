import { Routes, Route } from "react-router-dom";
import { ProductsListPage } from "./pages/ProductsListPage";
import { ProductPage } from "./pages/ProductPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProductsListPage />} />
      <Route path="/products/:id" element={<ProductPage />} />
    </Routes>
  );
}

export default App;
