import { Auth0ContextInterface, useAuth0 } from '@auth0/auth0-react';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { ApplicationUser } from '../types/ApplicationUser';

const Profile = () => {
  const {
    isAuthenticated,
    user,
    getAccessTokenSilently,
  }: Auth0ContextInterface<ApplicationUser> = useAuth0();
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = 'afrozeprojectmanagement.us.auth0.com';

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: 'read:current_user',
          },
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user?.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();

        setUserMetadata(user_metadata);
      } catch (e) {
        console.error(e);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);
  return isAuthenticated ? (
    <Box sx={{ my: 4 }}>
      <img src={user?.picture} alt={user?.name} />
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <h3>User Metadata</h3>
      {userMetadata ? (
        <pre>{JSON.stringify(userMetadata, null, 2)}</pre>
      ) : (
        <div>No user metadata defined</div>
      )}
    </Box>
  ) : (
    <div>Not authenticated</div>
  );
};

export default Profile;
