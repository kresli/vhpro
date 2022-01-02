import classNames from "classnames";
import { FunctionComponent } from "react";

const Footer: FunctionComponent = ({ children }) => <div>{children}</div>;

interface Props {
  roundedBottom?: boolean;
}

type CardComponent = FunctionComponent<Props> & { Footer: typeof Footer };

export const Card: CardComponent = ({ children, roundedBottom = true }) => (
  <div
    className={classNames(
      "rounded-t-lg bg-white flex flex-1 flex-col",
      "shadow border-slate-300 border overflow-hidden",
      {
        "rounded-b-lg": roundedBottom,
      }
    )}
  >
    {children}
  </div>
);
Card.Footer = Footer;
