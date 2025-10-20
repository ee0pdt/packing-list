import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@remix-run/react';
import { ListItem } from '../types';

export const useUrlHash = () => {
  const [state, setState] = useState<ListItem[]>([]);
  const { encodedState } = useParams<{ encodedState: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (encodedState) {
      try {
        const decodedState = atob(encodedState);
        setState(JSON.parse(decodedState));
      } catch (error) {
        console.error('Failed to decode state:', error);
      }
    }
  }, [encodedState]);

  const updateState = (newState: ListItem[]) => {
    setState(newState);
    const encodedNewState = btoa(JSON.stringify(newState));
    navigate(`/list/${encodedNewState}`);
  };

  return { state, updateState };
};

export default useUrlHash;