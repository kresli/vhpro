import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createBrowserHistory } from "history";
interface RouterRouteRedirect {
  type: "REDIRECT";
  path: string;
  redirectTo: string;
}

type RoutePage = FunctionComponent<{ getParams: (key: string) => string }>;
interface RouterRoute {
  type: "ROUTE";
  path: string;
  Page: RoutePage;
}

export interface UseRouterConfig {
  routes: (RouterRoute | RouterRouteRedirect)[];
}
interface RouterProps {
  Page?: RoutePage;
}

const Router = ({ Page }: RouterProps) => {
  const getParams = useCallback((key: string) => "", []);
  if (!Page) return null;
  return <Page getParams={getParams} />;
};

export function useRouter(config: UseRouterConfig) {
  const [routerParams, setRouterParams] = useState<RouterProps | null>(null);
  const history = useMemo(() => createBrowserHistory(), []);
  const paths = useMemo(
    () => new Map(config.routes.map((route) => [route.path, route])),
    [config.routes]
  );
  const renderRoute = useCallback(
    (pathname: string) => {
      const route = paths.get(pathname);
      if (!route) return;
      if (route.type === "REDIRECT") {
        history.push(route.redirectTo);
        return;
      }
      const { Page } = route;
      setRouterParams({ Page });
    },
    [history, paths]
  );
  useEffect(() => {
    const unlisten = history.listen(({ location, action }) => {
      renderRoute(location.pathname);
    });
    renderRoute(history.location.pathname);
    return unlisten;
  }, [history, renderRoute]);
  return { Router, routerProps: routerParams };
}
