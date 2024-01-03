import Register from "./components/Register";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
