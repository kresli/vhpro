import { LoginPage } from "src/pages";
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
import { OrganisationsPage } from "./pages/organisations";
import { OrganisationPage } from "./pages/organisations/[:organisationId]";
import { memo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ProgramPage } from "./pages/programs/[:programId]/Program.page";
import { ParticipantPage } from "./pages/programs/[:programId]/participants/[:participantId]/Participant.page";

const env = new Env({
  apiEndpoint: "https://staging.api.vinehealth.ai/api/v1",
});

const Routes = memo(() => {
  const { isSigned } = useAuth();
  return (
    <Router>
      <Switch>
        {!isSigned && <Route exact path="/login" component={LoginPage} />}
        {!isSigned && <Redirect path="*" to="/login" />}
        <Redirect exact path="/login" to="/" />
        <Redirect exact path="/" to={"/organisations"} />
        <Route exact path="/organisations" component={OrganisationsPage} />
        <Route
          exact
          path="/organisations/:organisationId"
          component={OrganisationPage}
        />
        <Route exact path="/programs/:programId" component={ProgramPage} />
        <Route
          exact
          path="/programs/:programId/participants/:participantId"
          component={ParticipantPage}
        />
        <Route path="*" component={() => <div>404</div>} />
      </Switch>
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
