import { FunctionComponent } from "react";

import { ChevronLeftIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { Navigation } from ".";

interface Props {
  navigation?: boolean;
  title?: string;
  loadingContent?: boolean;
  backAction?: { href: string; label: string };
}

export const Page: FunctionComponent<Props> = ({
  navigation,
  children,
  title,
  loadingContent,
  backAction,
}) => {
  const showHeader = !!(title || backAction);
  return (
    <div className="bg-gray-50 w-screen h-screen flex  overflow-hidden flex-col">
      {navigation && <Navigation />}
      {loadingContent && <div>loading content</div>}
      {!loadingContent && (
        <div className="flex flex-col w-full h-full overflow-hidden">
          {showHeader && (
            <div className="flex border-b p-4">
              {backAction && (
                <Link to={backAction.href} className="flex items-center">
                  <ChevronLeftIcon className="w-8" /> {backAction.label}
                </Link>
              )}
              {title && (
                <div className="text-xl flex flex-1 justify-center">
                  {title}
                </div>
              )}
            </div>
          )}
          <div className="flex overflow-hidden flex-1 flex-col">{children}</div>
        </div>
      )}
    </div>
  );
};
