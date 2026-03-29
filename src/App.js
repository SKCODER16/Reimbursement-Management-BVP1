import { useState } from "react";
import LoginPage from "./components/Admin/LoginPage";
import { AppProvider } from "./components/context/AppContext";

function AppInner() {
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [company, setCompany] = useState(null);

  const navigate = (target, user, comp) => {
    if (user) setCurrentUser(user);
    if (comp) setCompany(comp);
    setPage(target);
  };

  if (page === "login") return <LoginPage onNavigate={navigate} />;
  return <LoginPage onNavigate={navigate} />;
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}