import toast from 'react-hot-toast';

const baseStyle = {
  background: '#1e293b',
  color: '#e2e8f0',
  border: '1px solid rgba(99, 102, 241, 0.1)',
  borderRadius: '12px',
  fontSize: '14px',
  fontFamily: 'Inter, system-ui, sans-serif',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
};

export function showSuccess(message: string) {
  toast.success(message, {
    style: {
      ...baseStyle,
      border: '1px solid rgba(34, 197, 94, 0.2)',
    },
    iconTheme: {
      primary: '#22c55e',
      secondary: '#1e293b',
    },
  });
}

export function showError(message: string) {
  toast.error(message, {
    style: {
      ...baseStyle,
      border: '1px solid rgba(239, 68, 68, 0.2)',
    },
    iconTheme: {
      primary: '#ef4444',
      secondary: '#1e293b',
    },
    duration: 5000,
  });
}

export function showWarning(message: string) {
  toast(message, {
    icon: '⚠️',
    style: {
      ...baseStyle,
      border: '1px solid rgba(245, 158, 11, 0.2)',
    },
  });
}

export function showInfo(message: string) {
  toast(message, {
    icon: '💡',
    style: {
      ...baseStyle,
      border: '1px solid rgba(99, 102, 241, 0.2)',
    },
  });
}

export function showLoading(message: string) {
  return toast.loading(message, {
    style: baseStyle,
  });
}

export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}
