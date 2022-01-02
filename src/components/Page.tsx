import { FunctionComponent } from "react";
import { Breadcrumb, Navigation, NavigationSection } from ".";

interface Props {
  navigation?: boolean;
  title?: string;
  breadcrumbs?: Breadcrumb[];
  sections?: NavigationSection[];
}

export const Page: FunctionComponent<Props> = ({
  navigation,
  children,
  title,
  breadcrumbs,
  sections,
}) => {
  console.log(breadcrumbs);
  return (
    <div className="bg-secondary-600/10 w-screen h-screen flex  overflow-hidden flex-col">
      {navigation && (
        <Navigation
          breadcrumbs={breadcrumbs}
          title={title}
          sections={sections}
        />
      )}

      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex overflow-hidden flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
};
