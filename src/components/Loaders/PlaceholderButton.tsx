import React, { useId } from "react";

export function PlaceholderButton() {
  const idPlaceholderButton = useId();

  return (
    <button
      key={idPlaceholderButton}
      type="button"
      aria-hidden="true"
      tabIndex={-1}
      className={"m-1 btn btn-secondary disabled placeholder col-2"}
    ></button>
  );
}
