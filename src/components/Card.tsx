import { FunctionComponent } from "react";

export const Card: FunctionComponent = ({ children }) => (
  <div className="rounded-t-lg bg-white flex flex-1 flex-col shadow border-slate-300 border overflow-hidden">
    {children}
  </div>
);
