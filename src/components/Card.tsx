import { FunctionComponent } from "react";

const Footer: FunctionComponent = ({ children }) => <div>{children}</div>;

type CardComponent = FunctionComponent & { Footer: typeof Footer };

export const Card: CardComponent = ({ children }) => (
  <div className="rounded-t-lg bg-white flex flex-1 flex-col shadow border-slate-300 border overflow-hidden">
    {children}
  </div>
);
Card.Footer = Footer;
