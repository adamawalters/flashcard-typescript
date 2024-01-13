import { Route, Routes, BrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";

function App() {
  return (
    <div className="app-routes">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />} path="/*"></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
