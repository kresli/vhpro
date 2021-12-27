import { FunctionComponent } from "react";

import { ChevronLeftIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { Navigation } from ".";

interface Props {
  navigation?: boolean;
  title?: string;
  backAction?: { href: string; label: string };
  sections?: { label: string; link: string }[];
}

export const Page: FunctionComponent<Props> = ({
  navigation,
  children,
  title,
  backAction,
  sections,
}) => {
  return (
    <div className="bg-gray-50 w-screen h-screen flex  overflow-hidden flex-col">
      {navigation && (
        <Navigation backAction={backAction} title={title} sections={sections} />
      )}

      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex overflow-hidden flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
};
