import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Container, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import RedirectSpinner from "../components/RedirectSpinner";

const ProfilePage = () => {
  const {
    isAuthenticated,
    user,
    isLoading,
  } = useAuth0();

  useEffect(() => {
    console.log(user);
  }, [user, isLoading, isAuthenticated])

  if (isLoading) {
    return <>Loading</>;
  }


  return (
    <Container>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          item
          xs={12}
          container
          direction="column"
        >
          <Grid item xs={12} alignItems='center'>
            <Typography
              gutterBottom
              variant="h4"
            >Profile</Typography>
            {isAuthenticated &&
              <>
                <img src={user?.picture} alt={user?.name} />
                <h2>{user?.name}</h2>
                <p>{user?.email}</p>
              </>
            }
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withAuthenticationRequired(ProfilePage, {
  onRedirecting: () => <RedirectSpinner />
})