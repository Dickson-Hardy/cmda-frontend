import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from "react";
import { classNames } from "~/utilities/classNames";
const Dropdown = ({ toggleElement, children, className }) => {
  const ref = useRef(null),
    trigger = useRef(null),
    id = useId();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const key = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.querySelector("button,[role=button]")?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", key);
    };
  }, [open]);
  const nativeButton = isValidElement(toggleElement) && toggleElement.type === "button";
  const control = isValidElement(toggleElement) ? (
    cloneElement(toggleElement, {
      "aria-expanded": open,
      "aria-controls": id,
      ...(nativeButton ? { type: "button" } : { role: "button", tabIndex: 0 }),
      onClick: (event) => {
        toggleElement.props.onClick?.(event);
        setOpen((previous) => !previous);
      },
      onKeyDown: (event) => {
        if (!nativeButton && ["Enter", " "].includes(event.key)) {
          event.preventDefault();
          setOpen((previous) => !previous);
        }
      },
    })
  ) : (
    <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
      {toggleElement}
    </button>
  );
  return (
    <div ref={ref} className="relative select-none">
      <div ref={trigger}>{control}</div>
      <div
        id={id}
        style={{ display: open ? "block" : "none" }}
        className={classNames("absolute right-0 top-full mt-2 z-30 min-w-full", className)}
        onClick={() => setOpen(false)}
      >
        {children}
      </div>
    </div>
  );
};
export default Dropdown;
