import "./App.css";
import { Route, Routes } from "react-router-dom";
import FrontPage from "./Components/FrontPage.jsx";
import Users from "./Components/Users/Users.jsx";
import CreateAccount from "./Components/Forms/CreateAccount.tsx";
import Unauthorized from "./ProtectedRoutes/Unauthorized.jsx";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute.tsx";
import RouterAdmin from "./Components/Admin/RouterAdmin.jsx";
import ForgotPassword from "./Components/Forms/ForgotPassword.tsx";
// import DevToolsBlocker from "./ProtectedRoutes/DevToolsBlocker.jsx";

function App() {
  return (
    <div className="App">
      {/* <DevToolsBlocker />  */}
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin/*" element={<RouterAdmin />}></Route>
        </Route>
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path={`/forgotpassword`} element={<ForgotPassword />} />
        <Route path="/characters/*" element={<Users />}></Route>
      </Routes>
    </div>
  );
}

export default App;
