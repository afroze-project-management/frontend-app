import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { Container, Grid, Typography, Button, TextField, Snackbar, Alert, SnackbarCloseReason } from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { CompanyResponseModel } from "../../apis/company/CompanyResponseModel";
import { HttpResponseModel } from "../../apis/HttpResponseModel";
import RedirectSpinner from "../../components/RedirectSpinner";

const defaultValues = {
  name: "",
  tags: "",
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
}

const CreateCompanyPage = () => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [error, setError] = useState<ErrorState>(errorDefaults);
  const [validation, setValidation] = useState(defaultValidation);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): React.FormEventHandler<HTMLFormElement> | undefined => {
    event.preventDefault();
    createCompany().then();
    return undefined;
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

  const createCompany = async () => {
    if (!isFormValid()) {
      setError({
        errorMessage: 'Invalid data',
        showError: true
      });
      return;
    }
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.post<HttpResponseModel<CompanyResponseModel>>(
        `http://localhost:8012/company`, formValues,
        {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        },
      );
      navigate('/companies');
    } catch (e) {
      const err = e as AxiosError<HttpResponseModel<CompanyResponseModel>>;
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
          >Create Company</Typography>
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

export default withAuthenticationRequired(CreateCompanyPage, {
  onRedirecting: () => <RedirectSpinner />
})