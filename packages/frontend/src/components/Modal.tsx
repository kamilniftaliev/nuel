import {
  type KeyboardEvent,
  type MouseEvent,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { IoClose } from "react-icons/io5";
import { cn } from "@/utils";

interface Props extends PropsWithChildren {
  onClose?: () => void;
}

export function Modal({ children, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === e.currentTarget) {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 250);
    }
  };

  const handleEscPress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 250);
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <dialog
      onClick={handleClose}
      onKeyUp={handleEscPress}
      className="flex fixed z-10 inset-0 items-center justify-center bg-black/60 w-screen h-screen"
    >
      <div
        className={cn(
          "bg-white transition-all duration-300 dark:bg-dark-page sm:rounded-lg shadow-xl/10 w-screen sm:w-auto h-screen overflow-y-auto sm:overflow-y-visible sm:h-auto sm:min-w-1/2 relative",
          {
            "translate-y-full opacity-0": !isVisible,
          },
        )}
      >
        <IoClose
          className="cursor-pointer text-black dark:text-white sm:text-white absolute top-4 right-4 sm:-top-8 sm:-right-8"
          size={24}
          onClick={handleClose}
        />
        <div className="overflow-y-auto sm:max-h-[90vh] p-6">{children}</div>
      </div>
    </dialog>
  );
}
