import { FunctionComponent } from "react";
import { Logo } from ".";
import { CogIcon, UserCircleIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

interface Props {
  navigation?: boolean;
  title?: string;
  loadingContent?: boolean;
  backAction?: { href: string; label: string };
}

const Navigation = () => {
  return (
    <div className="w-14 bg-indigo-300 items-center flex flex-col space-y-4 pb-4 pt-2">
      <Logo className="w-8" />
      <div className="flex flex-1" />
      <CogIcon className="w-8" />
      <UserCircleIcon className="w-8" />
    </div>
  );
};

export const Page: FunctionComponent<Props> = ({
  navigation,
  children,
  title,
  loadingContent,
  backAction,
}) => {
  const showHeader = !!(title || backAction);
  return (
    <div className="bg-gray-50 w-screen h-screen flex  overflow-hidden">
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
          <div className="flex overflow-hidden flex-1">{children}</div>
        </div>
      )}
    </div>
  );
};
