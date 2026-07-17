const TOAST_EVENT = "app-toast";

export function showToast(message: string): void {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: { message } }));
}

export function setupToastListener(onToast: (msg: string) => void): () => void {
  const handler = (e: Event) => {
    onToast((e as CustomEvent).detail.message);
  };
  window.addEventListener(TOAST_EVENT, handler);
  return () => window.removeEventListener(TOAST_EVENT, handler);
}
