import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Container, Box, Typography, Grid, Button, IconButton } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { CompanyResponseModel } from '../../apis/company/CompanyResponseModel';
import { HttpResponseModel } from '../../apis/HttpResponseModel';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import DeleteForever from '@mui/icons-material/DeleteForever';
import RedirectSpinner from '../../components/RedirectSpinner';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CompaniesPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [companies, setCompanies] = useState<CompanyResponseModel[]>([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const fetchedCompanies: AxiosResponse<HttpResponseModel<CompanyResponseModel[]>> =
          await axios.get<HttpResponseModel<CompanyResponseModel[]>>(
            `http://localhost:8012/company`,
            {
              headers: {
                Authorization: `bearer ${accessToken}`,
              },
            },
          );

        setToken(accessToken);
        setCompanies(fetchedCompanies.data.data);
      } catch (e: any) {
        console.error(e.message);
      }
    };

    getCompanies();
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Company', flex: 0.4 },
    { field: 'tags', headerName: 'Tags', flex: 0.4 },
    { field: 'actions', headerName: '', sortable: false, renderCell: (p) => renderActions(p) }
  ];

  const deleteCompany = async (id: string) => {
    await axios.delete(`http://localhost:8012/company/${id}/`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    let updatedCompanies = companies.filter(x => x.id !== +id);
    setCompanies(updatedCompanies);
  }

  const renderActions = (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
    return (
      <>
        <IconButton color='info' aria-label='info' component={RouterLink} to={`/companies/${params.row.id}`}>
          <InfoIcon />
        </IconButton>
        <IconButton color='error' aria-label='error' onClick={() => deleteCompany(params.row.id)}>
          <DeleteForever />
        </IconButton>
      </>);
  }


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
            >Companies</Typography>
          </Grid>

          <Grid xs={2}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              fullWidth
              component={RouterLink}
              to={`/companies/create`}>Add Company</Button>
          </Grid>

          <Grid xs={12}>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={companies}
                columns={columns}
                pageSize={7}
                rowsPerPageOptions={[7]}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default withAuthenticationRequired(CompaniesPage, {
  onRedirecting: () => <RedirectSpinner />
})