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
    <div className="h-32 flex-shrink-0 bg-gradient-to-r to-gray-800 from-secondary-900 flex flex-row">
      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center flex-1">
          <Logo className="w-10 flex-shrink-0" />
          <span className="text-primary-400 text-xl inline-flex ml-2">
            VHPRO
          </span>
        </div>
        <div className="flex">
          {backAction && (
            <div>
              <Link
                to={backAction.href}
                className={classNames(
                  "whitespace-nowrap",
                  "text-secondary-300 text-sm hover:text-primary",
                  "border border-black/50",
                  "bg-secondary-800 hover:bg-secondary-700",
                  "px-3 py-2",
                  "w-full inline-flex",
                  "justify-center rounded-md",
                  "shadow-sm"
                )}
              >
                <ChevronLeftIcon className="w-4 mr-1" /> {backAction.label}
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="justify-center items-center flex flex-1 text-3xl text-gray-300 whitespace-nowrap">
          {title}
        </div>
        <div className="flex justify-center text-secondary-200/50 h-11">
          {sections?.map(({ label, link }) => (
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
                "py-2"
              )}
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex flex-row items-start p-4">
        <button
          type="button"
          className="bg-gray-800 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
        </button>
        <UserCircleIcon className="w-6 h-6 text-gray-400 ml-3" />
      </div>
    </div>
  );
}
