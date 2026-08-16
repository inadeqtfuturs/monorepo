import { useEffect, useReducer } from 'react';
import { createContextReducer } from '../lib/createContextReducer';
import type { Toast, ToastOptions } from './types';

const id = (() => {
  let count = 0;
  return () => {
    return (++count).toString();
  };
})();

const createToast = (message: string, options?: ToastOptions): Toast => {
  const toast = {
    createdAt: Date.now(),
    type: options?.type || 'info',
    duration: options?.duration || 5000,
    message,
    ...options,
    id: options?.id || id(),
  };

  return toast;
};

type InitialState = {
  toasts: Toast[];
  settings: object;
};

export const useToasts = (options?: object, id = 'poptoast') => {
  const initialState = {
    toasts: [],
    settings: {
      id,
      ...options,
    },
  } as InitialState;
  const [reducer] = createContextReducer(
    {
      ADD_TOAST: (state, { message, options }) => {
        const toast = createToast(message, options);
        return {
          ...state,
          toasts: [...state.toasts, toast],
        };
      },
      REMOVE_TOAST: (state, { id }) => {
        const nextToasts = state?.toasts.filter(
          ({ id: toastId }) => toastId !== id,
        );
        return {
          ...state,
          toasts: nextToasts,
        };
      },
      CLEAR_TOASTS: (state) => ({
        ...state,
        toasts: [],
      }),
    },
    initialState,
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const provider = document.getElementById(id);
    if (state.toasts.length > 0) {
      provider?.showPopover();
    } else {
      provider?.hidePopover();
    }
  }, [state.toasts, id]);

  useEffect(() => {
    const now = Date.now();
    const timeouts = state.toasts.map(({ id, duration, createdAt }) => {
      const durationleft = (duration || 0) - (now - createdAt);
      if (durationleft < 0) {
        dispatch({ type: 'REMOVE_TOAST', payload: { id } });
      }
      return setTimeout(
        () => dispatch({ type: 'REMOVE_TOAST', payload: { id } }),
        durationleft,
      );
    });
    return () =>
      // biome-ignore lint/suspicious/useIterableCallbackReturn: use iterable
      timeouts.forEach((timeout) => timeout && clearTimeout(timeout));
  }, [state.toasts]);

  const toast = (message: Toast['message'], options?: ToastOptions) => {
    dispatch({ type: 'ADD_TOAST', payload: { message, options } });
  };

  toast.remove = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: { id } });
  };

  toast.clear = () => {
    dispatch({ type: 'CLEAR_TOASTS' });
  };

  return {
    toast,
    ...state,
  };
};
