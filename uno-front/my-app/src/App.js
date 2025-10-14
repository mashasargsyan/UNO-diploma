import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UnoForm from "./UnoForm";
import FirstPage from "./FirstPage";

function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/UnoForm" element={<UnoForm />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
