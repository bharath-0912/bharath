import React, { ReactNode } from "react";

// Define the prop types
interface ButtonComponentProps {
  title?: string;
  clickFunction?: () => void;
  children?: ReactNode;
  type?: "light" | "dark"; // Define specific allowed values for `type`
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title = "",
  clickFunction = () => {},
  children,
  type = "light",
}) => {
  return (
    <button
      onClick={clickFunction}
      className={`mt-4 ${
        type === "light" ? "bg-white text-black" : "text-white bg-blue-500"
      }  rounded-lg border flex gap-2 items-center py-1 px-6`}
    >
      {children}
      <span>{title}</span>
    </button>
  );
};

export default ButtonComponent;
