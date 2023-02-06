import { useAuth0 } from '@auth0/auth0-react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { CompanyResponseModel } from '../apis/company/CompanyResponseModel';
import { HttpResponseModel } from '../apis/HttpResponseModel';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';

export default function CompaniesPage() {
  const { getAccessTokenSilently } = useAuth0();
  const [companies, setCompanies] = useState<CompanyResponseModel[]>([]);

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
        setCompanies(fetchedCompanies.data.data);
      } catch (e: any) {
        console.log(e.message);
      }
    };

    getCompanies();
  }, []);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Company', flex: 0.3 },
    { field: 'tags', headerName: 'Tags', flex: 0.3 },
    { field: 'actions', headerName: '', sortable: false, renderCell: (p) => renderActions(p) }
  ];

  const renderActions = (params: GridRenderCellParams<any, any, any>): React.ReactNode => {
    return <Button
      color='primary'
      size='small'
      component={RouterLink}
      to={`/companies/${params.row.id}`}
    >
      Info
    </Button>
  }


  return (
    <Container>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          item
          xs={10}
          container
          direction="column"
        >
          <Grid item />
          <Grid item>
            <Typography
              gutterBottom
              variant="h3"
            >Companies</Typography>
          </Grid>
          <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={companies}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
