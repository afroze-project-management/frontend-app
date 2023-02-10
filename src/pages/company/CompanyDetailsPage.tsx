import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { Container, Grid, Typography, TextField, Button, Snackbar, Alert, SnackbarCloseReason, Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DeleteForever } from "@mui/icons-material";
import InfoIcon from '@mui/icons-material/Info';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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

const CompanyDetailsPage = () => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [error, setError] = useState<ErrorState>(errorDefaults);
  const [validation, setValidation] = useState(defaultValidation);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [company, setCompany] = useState<CompanyResponseModel>({
    id: 0,
    name: '',
    projects: [],
    tags: ''
  });
  const [token, setToken] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): React.FormEventHandler<HTMLFormElement> | undefined => {
    event.preventDefault();
    updateCompany().then();
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

  const deleteProject = async (id: number) => {
    await axios.delete(`http://localhost:8012/project/${id}/`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    let updatedProjects = company.projects === undefined ? [] : company.projects.filter(x => x.id !== +id);
    setCompany({ ...company, projects: updatedProjects });
  }


  const renderProjectActions = (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
    return (
      <>
        <IconButton color='info' aria-label='info' component={RouterLink} to={`/projects/${params.row.id}`}>
          <InfoIcon />
        </IconButton>
        <IconButton color='error' aria-label='error' onClick={() => deleteProject(params.row.id)}>
          <DeleteForever />
        </IconButton>
      </>);
  }

  const projectColumns: GridColDef[] = [
    { field: 'name', headerName: 'Project', flex: 0.4 },
    { field: 'tags', headerName: 'Tags', flex: 0.2 },
    { field: 'taskCount', headerName: 'Tasks', flex: 0.2 },
    { field: 'actions', headerName: '', sortable: false, renderCell: (p) => renderProjectActions(p) }
  ];

  useEffect(() => {
    const getCompany = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const fetchedCompany: AxiosResponse<HttpResponseModel<CompanyResponseModel>> =
          await axios.get<HttpResponseModel<CompanyResponseModel>>(
            `http://localhost:8012/company/${companyId}/`,
            {
              headers: {
                Authorization: `bearer ${accessToken}`,
              },
            },
          );

        if (fetchedCompany.data.data !== null) {
          setCompany(fetchedCompany.data.data);
          setFormValues(fetchedCompany.data.data);
          setValidation({
            name: fetchedCompany.data.data.name === '',
            tags: fetchedCompany.data.data.tags === '',
          });
        }
        setToken(accessToken);
      } catch (e: any) {
        console.error(e.message);
      }
    };


    getCompany();
  }, []);

  const updateCompany = async () => {
    if (!isFormValid()) {
      setError({
        errorMessage: 'Invalid data',
        showError: true
      });
      return;
    }
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.put<HttpResponseModel<CompanyResponseModel>>(
        `http://localhost:8012/company/${companyId}/`, formValues,
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
          direction="row"
          alignItems='center'
        >
          <Grid item xs={10} direction='row' alignItems='center'>
            <Typography
              gutterBottom
              variant="h4"
            >{company?.name === '' ? 'Loading' : company?.name}</Typography>
          </Grid>

          <Grid xs={2}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              fullWidth
              component={RouterLink}
              to={`/companies/${companyId}/projects/create`}>Add Project</Button>
          </Grid>

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

              <Grid container style={{ marginTop: 24 }} direction='row' spacing={2}>
                <Grid item xs={6}>
                  <Button variant="contained" color="secondary" type="submit" fullWidth component={RouterLink} to='/companies'>
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                    Update
                  </Button>
                </Grid>
              </Grid>

              <Grid container style={{ marginTop: 24 }}>
                <Box sx={{ height: 500, width: '100%' }}>
                  <DataGrid
                    rows={company.projects}
                    columns={projectColumns}
                    pageSize={7}
                    rowsPerPageOptions={[7]}
                  />
                </Box>
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


export default withAuthenticationRequired(CompanyDetailsPage, {
  onRedirecting: () => <RedirectSpinner />
})