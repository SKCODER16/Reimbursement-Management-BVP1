import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn("Error reading localStorage", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
}

export function AppProvider({ children }) {
  const [company, setCompany] = useLocalStorage("app_company", null);
  const [currentUser, setCurrentUser] = useLocalStorage("app_currentUser", null);
  const [users, setUsers] = useLocalStorage("app_users", [
    { id: "1", name: 'Sarah', email: 'sarah@company.com', role: 'Employee', manager: 'John' },
    { id: "2", name: 'John', email: 'john@company.com', role: 'Manager', manager: '' },
    { id: "3", name: 'Mitchell', email: 'mitchell@company.com', role: 'Manager', manager: '' },
    { id: "4", name: 'Elon', email: 'elon@company.com', role: 'CFO', manager: '' }
  ]);
  const [expenses, setExpenses] = useLocalStorage("app_expenses", []);
  
  // Expose the array-based rules for the Admin panel. We use the most recently added rule as active.
  const [approvalRulesArray, setApprovalRulesArray] = useLocalStorage("app_approvalRules_v2", [
    { id: 1, name: 'Default Rule', sequence: ['Manager', 'Finance', 'Director'], type: 'sequential', percentage: 100, approvers: 'Manager, Finance, Director' }
  ]);

  const createUser = (userData) => {
    setUsers(prev => [...prev, { id: "user_" + Date.now(), ...userData }]);
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const submitExpense = (expenseData) => {
    // Get the most recently added rule
    const activeRule = approvalRulesArray[approvalRulesArray.length - 1];
    
    const employeeUser = users.find(u => u.name === expenseData.employeeName);
    const specificManager = employeeUser ? employeeUser.manager : null;

    let steps = [];
    
    // Inject the specific manager as Step 1 always (per requirements)
    if (specificManager) {
        steps.push({ step: 1, role: "Manager", specificApprover: specificManager, status: "pending", comment: "" });
    } else {
        // Fallback generic manager
        steps.push({ step: 1, role: "Manager", status: "pending", comment: "" });
    }

    // Append the rest of the sequence from the active rule (skipping 'Manager' if it's the first one to avoid duplicates)
    activeRule.sequence.forEach((role, idx) => {
        if (idx === 0 && role.toLowerCase() === 'manager') return;
        steps.push({ step: steps.length + 1, role, status: "pending", comment: "" });
    });

    const newExpense = {
      id: "exp_" + Date.now(),
      ...expenseData,
      status: "pending",
      currentStep: 0,
      approvalSteps: steps,
      ruleType: activeRule.type,
      rulePercentage: activeRule.percentage,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const processApproval = (expenseId, decision, comment) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== expenseId) return exp;
      
      const updatedSteps = [...exp.approvalSteps];
      updatedSteps[exp.currentStep] = { ...updatedSteps[exp.currentStep], status: decision, comment };
      
      // If CFO approves, auto-approve the whole thing (Specific Approver override)
      if (currentUser?.role === 'CFO' && decision === 'approved') {
          return { ...exp, approvalSteps: updatedSteps, status: "approved", currentStep: updatedSteps.length };
      }

      if (decision === "rejected") return { ...exp, approvalSteps: updatedSteps, status: "rejected" };
      
      const nextStep = exp.currentStep + 1;
      
      // Calculate percentage for rules
      if (exp.ruleType === 'percentage' || exp.ruleType === 'hybrid') {
          const approvedCount = updatedSteps.filter(s => s.status === 'approved').length;
          const totalApprovers = updatedSteps.length;
          const currentPercentage = (approvedCount / totalApprovers) * 100;
          
          if (currentPercentage >= exp.rulePercentage) {
              return { ...exp, approvalSteps: updatedSteps, status: "approved", currentStep: nextStep };
          }
      }

      // Sequential completion
      if (nextStep >= updatedSteps.length) {
          return { ...exp, approvalSteps: updatedSteps, status: "approved", currentStep: nextStep };
      }
      
      return { ...exp, approvalSteps: updatedSteps, currentStep: nextStep };
    }));
  };

  return (
    <AppContext.Provider value={{
      company, setCompany,
      currentUser, setCurrentUser,
      users, setUsers,
      expenses, setExpenses,
      approvalRulesArray, setApprovalRulesArray,
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