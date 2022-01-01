import { FunctionComponent } from "react";

export const Highlight: FunctionComponent<{
  text: string;
  term: string;
}> = ({ text, term }) => {
  if (!term) return <>{text}</>;
  const index = text.toLowerCase().indexOf(term.toLowerCase());
  if (index === -1) return <>{text}</>;
  const prepend = text.slice(0, index);
  const highlight = text.slice(index, index + term.length);
  const append = text.slice(index + term.length);
  return (
    <>
      {prepend}
      {highlight && <span className="bg-yellow-200">{highlight}</span>}
      {append}
    </>
  );
};
