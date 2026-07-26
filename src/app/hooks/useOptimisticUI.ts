// Optimistic UI Hook - Instant Feedback for Better UX
import { useState, useCallback, useRef } from 'react';

interface OptimisticState<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  isOptimistic: boolean;
}

export function useOptimisticUI<T>(initialData: T) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    isLoading: false,
    error: null,
    isOptimistic: false,
  });
  
  const pendingOperations = useRef<Map<string, { previousData: T; rollback: () => void }>>(new Map());

  const executeOptimistic = useCallback((
    operationId: string,
    optimisticData: T,
    actualOperation: () => Promise<T>,
    rollbackData?: T
  ): Promise<T> => {
    // Store previous data for rollback
    pendingOperations.current.set(operationId, {
      previousData: state.data,
      rollback: () => {
        if (rollbackData) {
          setState(prev => ({ ...prev, data: rollbackData, isOptimistic: false }));
        }
      }
    });

    // Immediately update UI with optimistic data
    setState(prev => ({
      ...prev,
      data: optimisticData,
      isLoading: true,
      error: null,
      isOptimistic: true,
    }));

    return actualOperation()
      .then((result) => {
        // Success - update with real data
        pendingOperations.current.delete(operationId);
        setState(prev => ({
          ...prev,
          data: result,
          isLoading: false,
          isOptimistic: false,
        }));
        return result;
      })
      .catch((error) => {
        // Failure - rollback to previous state
        const pending = pendingOperations.current.get(operationId);
        if (pending) {
          pending.rollback();
          pendingOperations.current.delete(operationId);
        }
        setState(prev => ({
          ...prev,
          isLoading: false,
          isOptimistic: false,
          error,
        }));
        throw error;
      });
  }, [state.data]);

  const updateOptimistic = useCallback((operationId: string, optimisticData: T) => {
    setState(prev => ({
      ...prev,
      data: optimisticData,
      isOptimistic: true,
    }));
  }, []);

  const confirmOptimistic = useCallback((operationId: string) => {
    pendingOperations.current.delete(operationId);
    setState(prev => ({
      ...prev,
      isOptimistic: false,
    }));
  }, []);

  const cancelOptimistic = useCallback((operationId: string, rollbackData: T) => {
    const pending = pendingOperations.current.get(operationId);
    if (pending) {
      pending.rollback();
      pendingOperations.current.delete(operationId);
    } else {
      setState(prev => ({
        ...prev,
        data: rollbackData,
        isOptimistic: false,
      }));
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback((newData: T) => {
    pendingOperations.current.clear();
    setState({
      data: newData,
      isLoading: false,
      error: null,
      isOptimistic: false,
    });
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    isOptimistic: state.isOptimistic,
    executeOptimistic,
    updateOptimistic,
    confirmOptimistic,
    cancelOptimistic,
    clearError,
    reset,
  };
}

// Hook for batch optimistic updates
export function useBatchOptimistic<T>(initialData: T[]) {
  const [state, setState] = useState<{
    data: T[];
    pending: Set<string>;
    errors: Map<string, Error>;
  }>({
    data: initialData,
    pending: new Set(),
    errors: new Map(),
  });

  const optimisticAdd = useCallback((item: T, operation: () => Promise<T>) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;
    
    setState(prev => ({
      ...prev,
      data: [...prev.data, { ...item, id: tempId } as any],
      pending: new Set(prev.pending).add(tempId),
    }));

    return operation()
      .then((result) => {
        setState(prev => {
          const newPending = new Set(prev.pending);
          newPending.delete(tempId);
          return {
            ...prev,
            data: prev.data.map(item => (item as any).id === tempId ? result : item),
            pending: newPending,
          };
        });
        return result;
      })
      .catch((error) => {
        setState(prev => {
          const newErrors = new Map(prev.errors);
          newErrors.set(tempId, error);
          return {
            ...prev,
            data: prev.data.filter(item => (item as any).id !== tempId),
            pending: new Set(prev.pending).delete(tempId) ? prev.pending : new Set(prev.pending),
            errors: newErrors,
          };
        });
        throw error;
      });
  }, []);

  const optimisticUpdate = useCallback((
    id: string,
    updates: Partial<T>,
    operation: () => Promise<T>
  ) => {
    const previousItem = state.data.find(item => (item as any).id === id);
    
    setState(prev => ({
      ...prev,
      data: prev.data.map(item => 
        (item as any).id === id ? { ...item, ...updates } : item
      ),
      pending: new Set(prev.pending).add(id),
    }));

    return operation()
      .then((result) => {
        setState(prev => {
          const newPending = new Set(prev.pending);
          newPending.delete(id);
          return {
            ...prev,
            data: prev.data.map(item => (item as any).id === id ? result : item),
            pending: newPending,
          };
        });
        return result;
      })
      .catch((error) => {
        setState(prev => {
          const newPending = new Set(prev.pending);
          newPending.delete(id);
          return {
            ...prev,
            data: prev.data.map(item => 
              (item as any).id === id ? previousItem || item : item
            ),
            pending: newPending,
            errors: new Map(prev.errors).set(id, error),
          };
        });
        throw error;
      });
  }, [state.data]);

  const optimisticDelete = useCallback((id: string, operation: () => Promise<void>) => {
    const previousItem = state.data.find(item => (item as any).id === id);
    
    setState(prev => ({
      ...prev,
      data: prev.data.filter(item => (item as any).id !== id),
      pending: new Set(prev.pending).add(id),
    }));

    return operation()
      .then(() => {
        setState(prev => {
          const newPending = new Set(prev.pending);
          newPending.delete(id);
          return {
            ...prev,
            pending: newPending,
          };
        });
      })
      .catch((error) => {
        setState(prev => {
          const newPending = new Set(prev.pending);
          newPending.delete(id);
          return {
            ...prev,
            data: previousItem ? [...prev.data, previousItem] : prev.data,
            pending: newPending,
            errors: new Map(prev.errors).set(id, error),
          };
        });
        throw error;
      });
  }, [state.data]);

  const retry = useCallback((id: string) => {
    const error = state.errors.get(id);
    if (!error) return Promise.reject(new Error('No error to retry'));

    state.errors.delete(id);
    // Return a rejected promise to allow caller to handle retry
    return Promise.reject(error);
  }, [state.errors]);

  return {
    data: state.data,
    pending: Array.from(state.pending),
    errors: Array.from(state.errors.entries()),
    optimisticAdd,
    optimisticUpdate,
    optimisticDelete,
    retry,
    clearError: (id?: string) => {
      if (id) {
        state.errors.delete(id);
      } else {
        state.errors.clear();
      }
    },
  };
}