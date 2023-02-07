import { withAuthenticationRequired } from "@auth0/auth0-react";
import RedirectSpinner from "../../components/RedirectSpinner";

const ProjectsPage = () => {
  return <div>Projects!!!!</div>;
}

export default withAuthenticationRequired(ProjectsPage, {
  onRedirecting: () => <RedirectSpinner />
})