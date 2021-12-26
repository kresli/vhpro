import { FunctionComponent } from "react";
import { Logo } from ".";
import { CogIcon, UserCircleIcon } from "@heroicons/react/outline";

interface Props {
  navigation?: boolean;
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

export const Page: FunctionComponent<Props> = ({ navigation, children }) => {
  return (
    <div className="bg-gray-50 w-screen h-screen flex  overflow-hidden">
      {navigation && <Navigation />}
      <div className="flex flex-col w-full h-full">{children}</div>
    </div>
  );
};
