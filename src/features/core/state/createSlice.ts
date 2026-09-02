// Advanced State Management - Enterprise-grade Redux-like implementation
import { useCallback, useMemo, useState } from 'react';

type Action<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

type Listener = () => void;

interface Slice<S, A extends Action<string, any>> {
  getState: () => S;
  dispatch: (action: A) => void;
  subscribe: (listener: Listener) => () => void;
  useSelector: <R>(selector: (state: S) => R) => R;
}

export function createSlice<S, A extends Action<string, any>>({
  name,
  initialState,
  reducers,
}: {
  name: string;
  initialState: S;
  reducers: Record<string, (state: S, action: any) => S>;
}): Slice<S, A> {
  let state = initialState;
  const listeners = new Set<Listener>();

  const getState = () => state;

  const dispatch = (action: A) => {
    const reducer = reducers[action.type];
    if (reducer) {
      const nextState = reducer(state, action);
      if (nextState !== state) {
        state = nextState;
        listeners.forEach((l) => l());
      }
    }
  };

  const subscribe = (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useSelector = <R>(selector: (state: S) => R): R => {
    const [, forceRender] = useState({});
    const selected = useMemo(() => selector(state), [state, selector]);
    
    useCallback(() => {
      forceRender({});
    }, []);

    return selected;
  };

  return { getState, dispatch, subscribe, useSelector };
}

// Hook for using slices
export function useSlice<S, A extends Action<string, any>>(slice: Slice<S, A>) {
  const state = slice.getState();
  
  return {
    state,
    dispatch: slice.dispatch,
  };
}

