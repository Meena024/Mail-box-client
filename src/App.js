import "bootstrap/dist/css/bootstrap.min.css";
import Main from "./Components/Main";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux store/store";

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Main />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
