import classNames from "classnames";
import { FunctionComponent } from "react";

export const QuestionnaireTag: FunctionComponent<{ label: string }> = ({
  label,
}) => {
  return (
    <div>
      <div
        className={classNames(
          "inline-flex py-1 px-2 text-sm rounded-full",
          "h-fit m-1",
          {
            "bg-red-300": label === "EQ5D",
            "bg-cyan-300": label === "FACTG",
            "bg-violet-300": label === "QLQC30",
            "bg-lime-300": label === "BN20",
          }
        )}
      >
        {label}
      </div>
    </div>
  );
};
