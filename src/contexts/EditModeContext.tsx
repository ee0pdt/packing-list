import { createContext, useContext } from "react";

interface EditModeContextType {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

export const EditModeContext = createContext<EditModeContextType | undefined>(
  undefined,
);

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error("useEditMode must be used within an EditModeProvider");
  }
  return context;
};
