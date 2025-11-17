import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./Components/Main";
import { BrowserRouter } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

export default App;
