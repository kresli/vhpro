import { LoginPage } from "src/pages/login/Login.page";
import {
  ApiContext,
  AuthContext,
  useApiContext,
  useAuth,
  useAuthContext,
} from "./contexts";
import { Env } from "./env";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { OrganisationsPage } from "./pages/organisations/Organisations.page";
import { ProgramsPage } from "./pages/organisations/[:organisationId]/programs/Programs.page";
import { FunctionComponent, memo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ParticipantPage } from "./pages/programs/[:programId]/participants/[:participantId]/Participant.page";
import { QuestionnairesPage } from "./pages/programs/[:programId]/questionnaires/Questionnaires.page";
import { ReportsPage } from "./pages/programs/[:programId]/reports/Reports.page";
import { TeamPage } from "./pages/programs/[:programId]/team/Team.page";
import { ParticipantsPage } from "./pages/programs/[:programId]/participants/Participants.page";

const env = new Env({
  apiEndpoint: "https://staging.api.vinehealth.ai/api/v1",
});

type RouteData =
  | [string, string, boolean]
  | [string, FunctionComponent, boolean]
  | [string, string]
  | [string, FunctionComponent];

const buildRoutes = <T extends RouteData | boolean>(paths: T[]) => {
  const definedPaths = paths.filter(Boolean) as RouteData[];
  return definedPaths.map(([path, component, exact = true]) => {
    return typeof component === "string" ? (
      <Redirect key={path} exact={exact} path={path} to={component} />
    ) : (
      <Route key={path} exact={exact} path={path} component={component} />
    );
  });
};

const Routes = memo(() => {
  const { isSigned } = useAuth();
  const routes = buildRoutes([
    !isSigned && ["/login", LoginPage],
    !isSigned && ["/*", "/login", false],
    ["/login", "/"],
    ["/", "/organisations"],
    [
      "/organisations/:organisationId",
      "/organisations/:organisationId/programs",
    ],
    ["/organisations", OrganisationsPage],
    ["/organisations/:organisationId/programs", ProgramsPage],
    ["/programs/:programId", "/programs/:programId/participants"],
    ["/programs/:programId/participants", ParticipantsPage],
    ["/programs/:programId/reports", ReportsPage],
    ["/programs/:programId/questionnaires", QuestionnairesPage],
    ["/programs/:programId/team", TeamPage],
    ["/programs/:programId/participants/:participantId", ParticipantPage],
    ["*", () => <div>404</div>, false],
  ]);

  return (
    <Router>
      <Switch>{routes}</Switch>
    </Router>
  );
});

const queryClient = new QueryClient();

export const App = memo(() => {
  const apiContext = useApiContext(env);
  const authContext = useAuthContext(apiContext);
  const { isSigned } = authContext;
  const { hasToken } = apiContext;
  if (hasToken && !isSigned) return <div>loading</div>;
  return (
    <AuthContext.Provider value={authContext}>
      <ApiContext.Provider value={apiContext}>
        <QueryClientProvider client={queryClient}>
          <Routes />
        </QueryClientProvider>
      </ApiContext.Provider>
    </AuthContext.Provider>
  );
});
