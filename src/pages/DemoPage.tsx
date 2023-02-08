import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getProjects } from "../apis/project/ProjectApi";

const DemoPage = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [c, sc] = useState<any>();

  useEffect(() => {
    const getCompanies = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const res = await getProjects(accessToken);
        sc(res.data);
      } catch (e: any) {
        console.error(e.message);
      }
    };

    getCompanies();
  }, [])

  return <>{JSON.stringify(c)}</>
}

export default DemoPage;