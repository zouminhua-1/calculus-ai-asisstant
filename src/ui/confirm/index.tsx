import { createRoot } from "react-dom/client";
import { ConfirmDialog } from "./ConfirmDialog";

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

let container: HTMLDivElement | null = null;

export function confirm(options: ConfirmOptions): Promise<boolean> {
  if (!container) {
    container = document.createElement("div");
    document.body.appendChild(container);
  }

  return new Promise((resolve) => {
    const root = createRoot(container!);

    const close = (result: boolean) => {
      resolve(result);
      setTimeout(() => root.unmount(), 0);
    };

    root.render(<ConfirmDialog {...options} onClose={close} />);
  });
}
