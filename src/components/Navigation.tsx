import { Logo } from ".";
import { ChevronLeftIcon, UserCircleIcon } from "@heroicons/react/outline";
import { BellIcon } from "@heroicons/react/outline";
import { Link, NavLink } from "react-router-dom";
import { classNames } from "src/utils";
interface Props {
  backAction?: { href: string; label: string };
  title?: string;
  sections?: { label: string; link: string }[];
}
export function Navigation({ backAction, title, sections }: Props) {
  return (
    <div className=" bg-gradient-to-r from-gray-800 to-purple-900 ">
      <div className="flex items-center justify-between h-20 shrink-0 p-4  flex-1 flex-row">
        <div className="flex justify-center items-center flex-col">
          <Logo className="w-8 flex-shrink-0" />
          <div className="text-teal-400 text-xs">VHPRO</div>
        </div>
        <div className="flex flex-1">
          {backAction && (
            <Link
              to={backAction.href}
              className={classNames(
                "whitespace-nowrap",
                "text-gray-300 hover:bg-gray-700 hover:text-primary",
                "px-3 py-2 font-medium",
                "text-gray-400 w-full inline-flex justify-center rounded-md border border-gray-800 shadow-sm px-4 py-2 bg-opacity-20 bg-black text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              )}
            >
              <ChevronLeftIcon className="w-4 mr-1" /> {backAction.label}
            </Link>
          )}
          {title && (
            <div className="flex mx-8 justify-start items-center text-3xl text-gray-400 whitespace-nowrap">
              {title}
            </div>
          )}
        </div>
        <div className="ml-4 flex items-center">
          <button
            type="button"
            className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <UserCircleIcon className="w-6 h-6 text-gray-400 ml-3" />
        </div>
      </div>
      {sections && (
        <div className="flex flex-1 ml-8 justify-center">
          {sections.map(({ label, link }) => (
            <NavLink
              key={label}
              to={link}
              activeClassName="text-primary-500 font-normal border-primary-500"
              className={classNames(
                "hover:text-gray-300",
                "px-5",
                "border-transparent",
                "border-b-4",
                "flex-inline",
                "whitespace-nowrap",
                "py-2",
                "text-gray-400"
              )}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
