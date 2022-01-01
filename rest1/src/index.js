import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Form from "./Form";
import NotFound from "./NotFound";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/*trong react router 6 Switch la Routers, component la element */}
        <Route path="/" element={<App />} />
        <Route path="form" element={<Form />}>
          <Route path=":id" element={<Form />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
