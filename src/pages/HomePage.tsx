import { useAuth0 } from "@auth0/auth0-react";
import { Container, Grid, Typography, Backdrop, CircularProgress } from "@mui/material";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth0();

  const showLoader = () => {
    return (
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>)
  }

  const showContent = () => {
    return (
      isAuthenticated ? (
        <Grid item xs> < Typography
          gutterBottom
          variant="h4"
        >Welcome</Typography >
        </Grid >) : (
        <Grid item xs> < Typography
          gutterBottom
          variant="h4"
        >Login to continue</Typography >
        </Grid >
      )
    )
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
          <Grid item />

          <Grid item container direction="column" alignItems='center'>
            <Grid>{isLoading ? showLoader() : showContent()}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
