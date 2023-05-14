import React, { type MouseEventHandler } from "react";
import clsx from "clsx";

export const Tag: React.FC<{
  isSelected: boolean;
  children: React.ReactNode;
  onClick?: MouseEventHandler;
}> = ({ isSelected, children, onClick }) => {
  return (
    <button
      type="button"
      className={clsx("h-6 bg-base-300 px-2 text-xs", {
        "border-2 border-solid border-black": isSelected,
        "cursor-default": !onClick,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
