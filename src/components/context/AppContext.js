import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [company, setCompany] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [approvalRules, setApprovalRules] = useState({
    isManagerApproverFirst: true,
    approverSequence: [
      { step: 1, role: "Manager" },
      { step: 2, role: "Finance" }
    ],
    conditionalRules: {
      minApprovalPercentage: 60,
      specificApproverOverride: "CFO",
      ruleType: "hybrid"
    }
  });

  const createUser = (userData) => {
    setUsers(prev => [...prev, { id: "user_" + Date.now(), ...userData }]);
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const submitExpense = (expenseData) => {
    const newExpense = {
      id: "exp_" + Date.now(),
      ...expenseData,
      status: "pending",
      currentStep: 0,
      approvalSteps: approvalRules.approverSequence.map(s => ({
        ...s, status: "pending", comment: ""
      })),
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const processApproval = (expenseId, decision, comment) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== expenseId) return exp;
      const updatedSteps = [...exp.approvalSteps];
      updatedSteps[exp.currentStep] = { ...updatedSteps[exp.currentStep], status: decision, comment };
      if (decision === "rejected") return { ...exp, approvalSteps: updatedSteps, status: "rejected" };
      const nextStep = exp.currentStep + 1;
      if (nextStep >= updatedSteps.length) return { ...exp, approvalSteps: updatedSteps, status: "approved", currentStep: nextStep };
      return { ...exp, approvalSteps: updatedSteps, currentStep: nextStep };
    }));
  };

  return (
    <AppContext.Provider value={{
      company, setCompany,
      currentUser, setCurrentUser,
      users, setUsers,
      expenses, setExpenses,
      approvalRules, setApprovalRules,
      createUser, deleteUser,
      submitExpense, processApproval
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}