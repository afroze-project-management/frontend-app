import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { CompanyResponseModel } from '../apis/company/CompanyResponseModel';
import { HttpResponseModel } from '../apis/HttpResponseModel';
import { Container, Grid, Typography, TextField, Button, Snackbar, Alert, SnackbarCloseReason, Box, IconButton } from "@mui/material";
import { ProjectSummaryResponseModel } from "../apis/project/ProjectSummaryResponseModel";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DeleteForever } from "@mui/icons-material";
import InfoIcon from '@mui/icons-material/Info';

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
  const [company, setCompany] = useState<CompanyResponseModel | undefined>();
  const [projects, setProjects] = useState<ProjectSummaryResponseModel[]>([]);
  const [token, setToken] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): React.FormEventHandler<HTMLFormElement> | undefined => {
    event.preventDefault();
    updateCompany().then(res => console.log(res));
    return undefined;
  };

  const handleInputChange: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.currentTarget;
    console.log('ic: name', name);
    console.log('ic: value', value === '');
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
    let updatedCompanies = projects.filter(x => x.id !== +id);
    setProjects(updatedCompanies);
  }


  const renderProjectActions = (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
    return (
      <>
        <IconButton color='info' aria-label='info' component={RouterLink} to={`/projects/edit/${params.row.id}`}>
          <InfoIcon />
        </IconButton>
        <IconButton color='error' aria-label='error' onClick={() => deleteProject(params.row.id)}>
          <DeleteForever />
        </IconButton>
      </>);
  }

  const projectColumns: GridColDef[] = [
    { field: 'name', headerName: 'Project', flex: 0.2 },
    { field: 'tags', headerName: 'Tags', flex: 0.2 },
    { field: 'taskCount', headerName: 'Tasks', flex: 0.2 },
    { field: 'actions', headerName: '', sortable: false, renderCell: (p) => renderProjectActions(p), flex: 0.2 }
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
        setCompany(fetchedCompany.data.data);
        setFormValues(fetchedCompany.data.data);
        setValidation({
          name: fetchedCompany.data.data.name === '',
          tags: fetchedCompany.data.data.tags === '',
        });
        setToken(accessToken);
        console.log(accessToken);
      } catch (e: any) {
        console.log(e.message);
      }
    };

    const getProjects = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const fetchedProjects: AxiosResponse<HttpResponseModel<ProjectSummaryResponseModel[]>> =
          await axios.get<HttpResponseModel<ProjectSummaryResponseModel[]>>(
            `http://localhost:8012/company/${companyId}/projects`,
            {
              headers: {
                Authorization: `bearer ${accessToken}`,
              },
            },
          );
        setProjects(fetchedProjects.data.data);
        console.log(fetchedProjects.data.data);
      } catch (e: any) {
        console.log(e.message);
      }
    };

    getCompany();
    getProjects();
  }, []);

  const updateCompany = async () => {
    debugger;
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
          direction="column"
        >
          <Grid item />
          <Typography
            gutterBottom
            variant="h4"
          >{company?.name === '' ? 'Loading' : company?.name}</Typography>
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
                    rows={projects}
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

export default CompanyDetailsPage;