import { FunctionComponent } from "react";

export const Page: FunctionComponent = ({ children }) => {
  return (
    <div className="bg-gray-50 w-screen h-screen flex flex-col overflow-hidden">
      {children}
    </div>
  );
};
