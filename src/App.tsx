import { useRouter, UseRouterConfig } from "src/hooks";
import { LoginPage } from "src/pages";

const config: UseRouterConfig = {
  routes: [
    {
      type: "REDIRECT",
      path: "/",
      redirectTo: "/login",
    },
    {
      type: "ROUTE",
      path: "/login",
      Page: () => <LoginPage />,
    },
  ],
};

export const App = () => {
  const { Router, routerProps } = useRouter(config);
  return <Router {...routerProps} />;
};
