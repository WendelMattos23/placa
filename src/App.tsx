import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrioridadePage from "./pages/PrioridadePage";
import FormularioPage from "./pages/FormularioPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/prioridade/:empresa",
    element: <PrioridadePage />,
  },
  {
    path: "/formulario/:empresa/:polo",
    element: <FormularioPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;