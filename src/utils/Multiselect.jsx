import { useEffect, useRef, useState, useCallback } from "react";

function Multiselect({ Heading, children }) {
  const [selectorOpened, setSelectorOpened] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  // Click outside handler
  const hideSelector = useCallback((e) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target) && // Click is outside the menu
      buttonRef.current &&
      !buttonRef.current.contains(e.target) // Click is outside the button
    ) {
      setSelectorOpened(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", hideSelector);
    return () => {
      document.removeEventListener("mousedown", hideSelector);
    };
  }, [hideSelector]);

  return (
    <div>
      {/* Button */}
      <div
        ref={buttonRef}
        style={{ border: "none", background: "transparent" }}
        onClick={() => setSelectorOpened((prev) => !prev)}
        role="button"
        aria-expanded={selectorOpened}
      >
        <span className="text-md font-medium">{Heading}</span>
      </div>

      {/* Dropdown Menu */}
      {selectorOpened && (
        <div
          ref={menuRef}
          style={{
            marginTop: "7.5px",
            position: "absolute",
            zIndex: "50",
            background: "white",
            display: "grid",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default Multiselect;
