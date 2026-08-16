import React, { type CSSProperties } from 'react';
import { useToasts } from './useToasts';

type ToastProviderProps = {
  providerId?: string;
  providerStyle?: CSSProperties;
  providerClassName?: string;
  providerProps?: {
    duration?: number;
  };
};

const ToastStyle: CSSProperties = {
  width: 200,
  height: 50,
  background: '#fefefe',
  border: '1px solid red',
};

function ToastProvider({
  providerId = 'poptoast',
  providerStyle,
  providerClassName,
  providerProps,
}: ToastProviderProps) {
  const { toasts, toast } = useToasts({}, providerId);
  const As = providerProps?.as || 'div';
  return (
    <div>
      <h1>toast</h1>
      <button type='button' onClick={() => toast('test')}>
        add toast
      </button>
      <As
        id={providerId}
        style={{ ...providerStyle }}
        className={providerClassName}
        popover='manual'
        {...providerProps}
      >
        {toasts?.map(({ id, message }) => (
          <div key={id} id={`toast-${id}`} style={ToastStyle}>
            {message}
          </div>
        ))}
      </As>
    </div>
  );
}

export default ToastProvider;
