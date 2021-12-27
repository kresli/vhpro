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
import { OrganisationsPage } from "./pages/organisations/Organisations.page";
import { ProgramsPage } from "./pages/organisations/[:organisationId]/programs/Programs.page";
import { memo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ParticipantPage } from "./pages/programs/[:programId]/participants/[:participantId]/Participant.page";
import { QuestionnairesPage } from "./pages/programs/[:programId]/questionnaires/Questionnaires.page";
import { ReportsPage } from "./pages/programs/[:programId]/reports/Reports.page";
import { TeamPage } from "./pages/programs/[:programId]/team/Team.page";
import { ParticipantsPage } from "./pages/programs/[:programId]/participants/Participants.page";

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
        <Redirect
          exact
          path="/organisations/:organisationId"
          to="/organisations/:organisationId/programs"
        />
        <Route exact path="/organisations" component={OrganisationsPage} />
        <Route
          exact
          path="/organisations/:organisationId/programs"
          component={ProgramsPage}
        />
        <Redirect
          exact
          path="/programs/:programId"
          to="/programs/:programId/participants"
        />
        <Route
          exact
          path="/programs/:programId/participants"
          component={ParticipantsPage}
        />
        <Route
          exact
          path="/programs/:programId/reports"
          component={ReportsPage}
        />
        <Route
          exact
          path="/programs/:programId/questionnaires"
          component={QuestionnairesPage}
        />
        <Route exact path="/programs/:programId/team" component={TeamPage} />
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
