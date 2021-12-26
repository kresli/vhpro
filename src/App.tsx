import { LoginPage } from "src/pages";
import {
  ApiContext,
  AuthContext,
  useApiContext,
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

const env = new Env({
  apiEndpoint: "https://staging.api.vinehealth.ai/api/v1",
});

export const App = () => {
  const apiContext = useApiContext(env);
  const authContext = useAuthContext(apiContext);
  const { isSigned, isAdmin } = authContext;
  return (
    <AuthContext.Provider value={authContext}>
      <ApiContext.Provider value={apiContext}>
        <Router>
          <Switch>
            {isSigned && <Redirect exact path="/login" to="/" />}
            {isAdmin && <Redirect exact path="/" to="/organisations" />}
            <Route exact path="/login" component={LoginPage} />
            {!isSigned && <Redirect exact path="*" to="/login" />}
            <Route exact path="/organisations" component={OrganisationsPage} />
          </Switch>
        </Router>
      </ApiContext.Provider>
    </AuthContext.Provider>
  );
};
