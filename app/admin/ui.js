"use client";

// Small client-side helpers shared by admin pages.

export function ConfirmButton({ children, message = "Are you sure? This can’t be undone.", className = "danger-btn", formAction }) {
  return (
    <button
      type="submit"
      className={className}
      formAction={formAction}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
