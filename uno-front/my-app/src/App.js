import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UnoForm from "./UnoForm";
import FirstPage from "./FirstPage";
import Game from "./Game"

function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/UnoForm" element={<UnoForm />} />
        <Route path="/Game" element={<Game />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
