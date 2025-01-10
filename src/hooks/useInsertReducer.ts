import { useReducer } from "react";

interface InsertState {
  focusedItemId: string | null;
  insertPosition: "above" | "below" | null;
}

type InsertAction =
  | { type: "FOCUS_ITEM"; id: string }
  | { type: "BLUR_ITEM" }
  | { type: "START_INSERT"; position: "above" | "below" }
  | { type: "CANCEL_INSERT" };

const initialState: InsertState = {
  focusedItemId: null,
  insertPosition: null,
};

function insertReducer(state: InsertState, action: InsertAction): InsertState {
  switch (action.type) {
    case "FOCUS_ITEM":
      return { ...state, focusedItemId: action.id };
    case "BLUR_ITEM":
      return { ...state, focusedItemId: null };
    case "START_INSERT":
      return { ...state, insertPosition: action.position };
    case "CANCEL_INSERT":
      return { ...state, insertPosition: null };
    default:
      return state;
  }
}

export function useInsertReducer() {
  const [state, dispatch] = useReducer(insertReducer, initialState);
  return { state, dispatch };
}

export type { InsertState, InsertAction };