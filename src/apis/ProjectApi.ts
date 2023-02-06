import { api } from './configs/axiosConfig';
import { defineCancelApiObject } from './configs/axiosUtils';

export const ProjectAPI = {
  getAll: async (cancel: boolean = false) => {
    const response = await api.request({
      url: `/projects`,
      method: 'GET',
      signal: cancel
        ? cancelApiObject['ProjectAPI.getAll'].handleRequestCancellation().signal
        : undefined,
    });
  },
};

const cancelApiObject = defineCancelApiObject(ProjectAPI);
