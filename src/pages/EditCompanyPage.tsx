import { useParams } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import axios, { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { CompanyResponseModel } from '../apis/company/CompanyResponseModel';
import { HttpResponseModel } from '../apis/HttpResponseModel';
import { DataGrid, GridColDef, GridValueGetterParams, GridRenderCellParams } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';

const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const [company, setCompany] = useState<CompanyResponseModel | undefined>();

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
      } catch (e: any) {
        console.log(e.message);
      }
    };

    // const getProjects = async () => {
    //   try {
    //     const accessToken = await getAccessTokenSilently();
    //     const fetchedCompany: AxiosResponse<HttpResponseModel<CompanyResponseModel>> =
    //       await axios.get<HttpResponseModel<CompanyResponseModel>>(
    //         `http://localhost:8012/company/${companyId}/projects`,
    //         {
    //           headers: {
    //             Authorization: `bearer ${accessToken}`,
    //           },
    //         },
    //       );
    //     setCompany(fetchedCompany.data.data);
    //   } catch (e: any) {
    //     console.log(e.message);
    //   }
    // };

    getCompany();
  }, []);

  return <div>edit page: {company && <p>{company.name}</p>}</div>
}

export default CompanyDetailsPage;