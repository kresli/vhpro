import { Logo } from ".";
import { UserCircleIcon } from "@heroicons/react/outline";
import { BellIcon } from "@heroicons/react/outline";
import { Link, NavLink } from "react-router-dom";
import { ComponentProps } from "react";
import classNames from "classnames";

export interface Breadcrumb {
  href: string;
  label: string;
  Icon: (props: ComponentProps<"svg">) => JSX.Element;
}
export interface NavigationSection {
  label: string;
  link: string;
  Icon?: (props: ComponentProps<"svg">) => JSX.Element;
}
interface Props {
  breadcrumbs?: Breadcrumb[];
  title?: string | JSX.Element;
  sections?: NavigationSection[];
}
export function Navigation({ breadcrumbs, title, sections }: Props) {
  return (
    <div
      className={classNames(
        "h-44 flex-shrink-0 bg-gradient-to-r",
        "to-gray-800 from-secondary-900 flex flex-row"
      )}
    >
      <div className="flex flex-col p-4 justify-center items-center">
        <Logo className="w-14 h-14 flex-shrink-0" />
        <span className="text-primary-400 text-xl inline-flex">VHPRO</span>
      </div>
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="flex whitespace-nowrap space-x-8 flex-1">
          {breadcrumbs?.map(({ href, label, Icon }) => (
            <Link
              key={label}
              to={href}
              className={classNames(
                "text-gray-400 flex flex-1 items-end",
                "hover:text-white"
              )}
            >
              <Icon className="w-6 mr-2" /> {label}
            </Link>
          ))}
        </div>
        <div
          className={classNames(
            "justify-center items-center flex flex-1 text-4xl",
            "text-gray-300 whitespace-nowrap p-2"
          )}
        >
          {title}
        </div>
        <div className="flex justify-center text-secondary-200/50 h-11">
          {sections?.map(({ label, link, Icon }) => (
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
                "flex"
              )}
            >
              {Icon && <Icon className="w-6 mr-2" />}
              <span>{label}</span>
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
