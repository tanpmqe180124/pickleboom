// Toast manager for non-React contexts
let toastCallbacks: {
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
} | null = null;

export const setToastCallbacks = (callbacks: typeof toastCallbacks) => {
  toastCallbacks = callbacks;
};

export const showToast = {
  success: (title: string, message?: string) => {
    if (toastCallbacks) {
      toastCallbacks.showSuccess(title, message);
    } else {
      // Fallback to alert if toast is not available
      alert(`${title}${message ? `\n${message}` : ''}`);
    }
  },
  error: (title: string, message?: string) => {
    if (toastCallbacks) {
      toastCallbacks.showError(title, message);
    } else {
      // Fallback to alert if toast is not available
      alert(`${title}${message ? `\n${message}` : ''}`);
    }
  },
  warning: (title: string, message?: string) => {
    if (toastCallbacks) {
      toastCallbacks.showWarning(title, message);
    } else {
      // Fallback to alert if toast is not available
      alert(`${title}${message ? `\n${message}` : ''}`);
    }
  },
  info: (title: string, message?: string) => {
    if (toastCallbacks) {
      toastCallbacks.showInfo(title, message);
    } else {
      // Fallback to alert if toast is not available
      alert(`${title}${message ? `\n${message}` : ''}`);
    }
  }
};
