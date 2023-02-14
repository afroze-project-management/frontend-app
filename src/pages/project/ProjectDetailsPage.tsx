import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { HttpResponseModel } from '../../apis/HttpResponseModel';
import { Container, Grid, Typography, TextField, Button, Snackbar, Alert, SnackbarCloseReason, Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DeleteForever } from "@mui/icons-material";
import InfoIcon from '@mui/icons-material/Info';
import RedirectSpinner from "../../components/RedirectSpinner";
import { ProjectResponseModel } from "../../apis/project/ProjectResponseModel";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { baseUrl } from "../../common/appenv";
import { errorStateDefaults, ErrorState } from "../../types/ErrorState";

const defaultValues = {
  name: "",
  tags: "",
};

const defaultValidation = {
  name: true,
  tags: true,
}

const ProjectDetailsPage = () => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [error, setError] = useState<ErrorState>(errorStateDefaults);
  const [validation, setValidation] = useState(defaultValidation);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [project, setProject] = useState<ProjectResponseModel>({
    id: 0,
    name: '',
    tasks: [],
    tags: '',
    companyId: 0
  });
  const [token, setToken] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): React.FormEventHandler<HTMLFormElement> | undefined => {
    event.preventDefault();
    updateProject().then();
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

  const handleSnackbarClose = (_event: Event | React.SyntheticEvent<any, Event>, _reason: SnackbarCloseReason) => {
    setError({ ...error, showError: false });
  }

  const handleAlertClose = (_event: React.SyntheticEvent<Element, Event>) => {
    setError({ ...error, showError: false });
  }

  const isFormValid = () => {
    return Object.values(validation).every(x => !x);
  }

  const deleteTask = async (projectId: number, taskId: number) => {
    await axios.delete(`${baseUrl}/project/${projectId}/task/${taskId}`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    let updatedTasks = project.tasks === undefined ? [] : project.tasks.filter(x => x.id !== +projectId);
    setProject({ ...project, tasks: updatedTasks });
  }

  const renderTaskActions = (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
    return (
      <>
        <IconButton color='info' aria-label='info' component={RouterLink} to={`/projects/${params.row.id}`}>
          <InfoIcon />
        </IconButton>
        <IconButton color='error' aria-label='error' onClick={() => deleteTask(project.id, params.row.id)}>
          <DeleteForever />
        </IconButton>
      </>);
  }

  const renderBooleanCell = (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
    return <>{params.row.complete ? 'Yes' : 'No'}</>;
  }

  const taskColumns: GridColDef[] = [
    { field: 'name', headerName: 'Task', flex: 0.4 },
    { field: 'actualEffort', headerName: 'Effort (hours)', flex: 0.2 },
    { field: 'complete', headerName: 'Completed', flex: 0.2, renderCell: (p) => renderBooleanCell(p) },
    { field: 'actions', headerName: '', sortable: false, renderCell: (p) => renderTaskActions(p) }
  ];

  useEffect(() => {
    const getProject = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const fetchedProject: AxiosResponse<HttpResponseModel<ProjectResponseModel>> =
          await axios.get<HttpResponseModel<ProjectResponseModel>>(
            `${baseUrl}/project/${projectId}/`,
            {
              headers: {
                Authorization: `bearer ${accessToken}`,
              },
            },
          );

        if (fetchedProject.data.data !== null) {
          setProject(fetchedProject.data.data);
          setFormValues(fetchedProject.data.data);
          setValidation({
            name: fetchedProject.data.data.name === '',
            tags: fetchedProject.data.data.tags === '',
          });
        }
        setToken(accessToken);
      } catch (e: any) {
        console.error(e.message);
      }
    };


    getProject();
  }, []);

  const updateProject = async () => {
    if (!isFormValid()) {
      setError({
        errorMessage: 'Invalid data',
        showError: true
      });
      return;
    }
    try {
      const accessToken = await getAccessTokenSilently();
      await axios.put<HttpResponseModel<ProjectResponseModel>>(
        `${baseUrl}/project/${projectId}/`, formValues,
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
          direction="row"
          alignItems='center'
        >

          <Grid item xs={10} direction='row' alignItems='center'>
            <Typography
              gutterBottom
              variant="h4"
            >{project?.name === '' ? 'Loading' : project?.name}</Typography>
          </Grid>
          <Grid xs={2}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              fullWidth
              component={RouterLink}
              to={`/projects/${projectId}/tasks/create`}>Add Task</Button>
          </Grid>

        </Grid>

        <Grid item xs={12}>
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
                  <Button variant="contained" color="secondary" type="submit" fullWidth component={RouterLink} to='/projects'>
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
                    rows={project.tasks}
                    columns={taskColumns}
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

export default withAuthenticationRequired(ProjectDetailsPage, {
  onRedirecting: () => <RedirectSpinner />
})