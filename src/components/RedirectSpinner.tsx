import { Backdrop, CircularProgress, Container, Grid } from "@mui/material";

const RedirectSpinner = () => {

  return <Container>
    <Grid container style={{ marginTop: 20 }}>
      <Grid
        item
        xs={12}
        container
        direction="column"
      >
        <Grid item />
        <Grid item container direction="column" alignItems='center'>
          <Grid>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Container>;
}

export default RedirectSpinner;