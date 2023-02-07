import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { SnackbarCloseReason, Container, Grid, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HttpResponseModel } from "../../apis/HttpResponseModel";
import { ProjectResponseModel } from "../../apis/project/ProjectResponseModel";
import RedirectSpinner from "../../components/RedirectSpinner"

const defaultValues = {
  name: "",
  tags: "",
  companyId: "",
};

interface ErrorState {
  showError: boolean;
  errorMessage: string;
}

const errorDefaults: ErrorState = {
  showError: false,
  errorMessage: ''
}

const defaultValidation = {
  name: true,
  tags: true,
  companyId: false,
}


const CreateProjectPage = () => {
  const { companyId } = useParams();
  const [formValues, setFormValues] = useState({ ...defaultValues, companyId: companyId });
  const [error, setError] = useState<ErrorState>(errorDefaults);
  const [validation, setValidation] = useState(defaultValidation);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<React.FormEventHandler<HTMLFormElement> | undefined> => {
    event.preventDefault();
    await createProject();
    return;
  };

  const handleInputChange: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    setFormValues({
      ...formValues,
      [name]: value,
    });

    setValidation({
      ...validation,
      [name]: value === ''
    });
  };

  const handleSnackbarClose = (event: Event | React.SyntheticEvent<any, Event>, reason: SnackbarCloseReason) => {
    setError({ ...error, showError: false });
  }

  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    setError({ ...error, showError: false });
  }

  const isFormValid = () => {
    return Object.values(validation).every(x => !x);
  }

  const createProject = async () => {
    if (formValues.companyId === '' || !isFormValid()) {
      setError({
        errorMessage: 'Invalid data',
        showError: true
      });
      return;
    }

    try {
      const accessToken = await getAccessTokenSilently();
      await axios.post<HttpResponseModel<ProjectResponseModel>>(
        `http://localhost:8012/project`, formValues,
        {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        },
      );
      navigate('/projects');
    } catch (e) {
      const err = e as AxiosError<HttpResponseModel<ProjectResponseModel>>;
      if (err.response?.status === 400) {
        setError({
          errorMessage: err.response.data.errorMessage,
          showError: true
        })
      } else {
        setError({
          errorMessage: 'An unexpected error occurred',
          showError: true
        })
      }
    }
  };

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
          <Typography
            gutterBottom
            variant="h4"
          >Create Project</Typography>
        </Grid>

        <Grid xs={12}>
          <form onSubmit={handleSubmit}>
            <Grid xs={12} alignItems="center" justifyContent='center' direction="column">
              <Grid item style={{ marginTop: 24 }}>
                <TextField
                  fullWidth
                  id="name-input"
                  name="name"
                  label="Name"
                  type="text"
                  value={formValues.name}
                  error={validation.name}
                  helperText={validation.name && 'Required'}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item style={{ marginTop: 24 }}>
                <TextField
                  fullWidth
                  id="tags-input"
                  name="tags"
                  label="Tags"
                  type="text"
                  value={formValues.tags}
                  error={validation.tags}
                  helperText={validation.tags && 'Required'}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item style={{ marginTop: 24 }}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
      <Snackbar open={error.showError} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert onClose={handleAlertClose} severity='error' sx={{ width: '100%' }}>{error.errorMessage}</Alert>
      </Snackbar>
    </Container>
  )
}


export default withAuthenticationRequired(CreateProjectPage, {
  onRedirecting: () => <RedirectSpinner />
})