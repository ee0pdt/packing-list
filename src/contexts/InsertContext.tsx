import { createContext, useContext, ReactNode } from "react";
import { InsertState, InsertAction, useInsertReducer } from "../hooks/useInsertReducer";

interface InsertContextType {
  state: InsertState;
  dispatch: React.Dispatch<InsertAction>;
}

const InsertContext = createContext<InsertContextType | null>(null);

export function InsertProvider({ children }: { children: ReactNode }) {
  const { state, dispatch } = useInsertReducer();
  return (
    <InsertContext.Provider value={{ state, dispatch }}>
      {children}
    </InsertContext.Provider>
  );
}

export function useInsert() {
  const context = useContext(InsertContext);
  if (!context) {
    throw new Error("useInsert must be used within an InsertProvider");
  }
  return context;
}