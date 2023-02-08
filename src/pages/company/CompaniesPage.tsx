import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForever from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Button, Container, Grid, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { deleteCompany, getCompanies } from '../../apis/company/CompanyApi';
import { CompanyResponseModel } from '../../apis/company/CompanyResponseModel';
import RedirectSpinner from '../../components/RedirectSpinner';

const CompaniesPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [companies, setCompanies] = useState<CompanyResponseModel[]>([]);
  const [token, setToken] = useState('');

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Company', flex: 0.4 },
    { field: 'tags', headerName: 'Tags', flex: 0.4 },
    { field: 'actions', headerName: '', sortable: false, renderCell: (p) => renderCompanyRowActions(p) }
  ];

  const loadData = async () => {
    const accessToken = await getAccessTokenSilently();
    const fetchedCompanies = await getCompanies(accessToken);

    setToken(accessToken);
    setCompanies(fetchedCompanies);
  };

  const handleCompanyDelete = async (id: string) => {
    await deleteCompany(token, id);
    let updatedCompanies = companies.filter(x => x.id !== +id);
    setCompanies(updatedCompanies);
  }

  useEffect(() => {
    loadData();
  }, []);

  const renderCompanyRowActions = (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
    return (
      <>
        <IconButton color='info' aria-label='info' component={RouterLink} to={`/companies/${params.row.id}`}>
          <InfoIcon />
        </IconButton>
        <IconButton color='error' aria-label='error' onClick={() => handleCompanyDelete(params.row.id)}>
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

          <Grid item xs={2}>
            <Button
              startIcon={<AddCircleOutlineIcon />}
              variant="outlined"
              fullWidth
              component={RouterLink}
              to={`/companies/create`}>Add Company</Button>
          </Grid>

          <Grid item xs={12}>
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