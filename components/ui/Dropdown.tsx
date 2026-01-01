"use client";

import { useState, useRef, ReactNode } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import Button from "./Button";
import { MenuDotsIcon } from "./icons/MenuDotsIcon";

interface DropdownItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface DropdownProps {
  items: DropdownItem[];
  trigger?: ReactNode;
}

export function Dropdown({ items, trigger }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const handleItemClick = (item: DropdownItem) => {
    setIsOpen(false);
    item.onClick();
  };

  return (
    <div className="relative" ref={menuRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <Button variant="icon" onClick={() => setIsOpen(!isOpen)}>
          <MenuDotsIcon />
        </Button>
      )}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-[#0d1117] border border-white/10 rounded-lg shadow-lg z-10">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${
                item.variant === "danger" ? "text-red-400" : "text-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
