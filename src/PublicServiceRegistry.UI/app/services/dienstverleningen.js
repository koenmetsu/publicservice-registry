import axios from 'axios';

export default {
  loadUserInfo() {
    return axios.get('/v2/security');
  },

  getAllServices(filter = {}, sortOrder = {}, paging = {}, routerParams = {}) {
    const callParameters = {
      headers: {},
    };

    callParameters.headers['x-filtering'] = encodeURIComponent(JSON.stringify(filter));

    if (sortOrder.sortField && sortOrder.direction) {
      callParameters.headers['x-sorting'] = `${sortOrder.direction},${sortOrder.sortField}`;
    }

    if (paging.offset != null && paging.limit != null) {
      callParameters.headers['x-pagination'] = `${paging.offset},${paging.limit}`;
    }

    if (routerParams.lop != null) {
      callParameters.lop = routerParams.lop;
    }

    return axios.get('/v1/dienstverleningen', callParameters);
  },

  getAllIpdcChanges(changedSince) {
    return axios.get(`/v1/ipdc/${changedSince}`);
  },

  getIpdcProduct(id) {
    return axios.get(`/v1/ipdc/product/${id}`);
  },

  getAllServicesAsCsv(filter) {
    return axios.get(
      '/v1/dienstverleningen', {
        headers: {
          accept: 'text/csv',
          'x-pagination': 'none',
          'x-filtering': encodeURIComponent(JSON.stringify(filter)),
        },
        transformRequest: [(data, headers) => {
          // eslint-disable-next-line
          delete headers.common.Accept;
          return data;
        }],
      });
  },

  getMyService(id, lop) {
    return axios.get(`/v1/dienstverleningen/${id}`, {
      lop,
    });
  },

  getLabelTypes() {
    return axios.get('/v1/alternatievebenamingstypes');
  },

  getLifeCycleStageTypes() {
    return axios.get('/v1/levensloopfasetypes');
  },

  createMyService(service) {
    return axios.post('/v1/dienstverleningen', service);
  },

  updateMyService(service) {
    const location = `/v1/dienstverleningen/${service.id}`;
    return axios.put(location, service);
  },

  getAlternativeLabels(id) {
    const location = `/v1/dienstverleningen/${id}/alternatievebenamingen`;
    return axios.get(location);
  },

  getLifeCycle(id, sortOrder = {}, paging = {}, lop) {
    const location = `/v1/dienstverleningen/${id}/levensloop/fases`;

    const callParameters = {
      headers: {},
    };

    if (sortOrder.sortField && sortOrder.direction) {
      callParameters.headers['x-sorting'] = `${sortOrder.direction},${sortOrder.sortField}`;
    }

    if (paging.offset != null && paging.limit != null) {
      callParameters.headers['x-pagination'] = `${paging.offset},${paging.limit}`;
    }

    if (lop) {
      callParameters.lop = lop;
    }

    return axios.get(location, callParameters);
  },

  getLifeCycleStage(publicServiceId, lifeCycleStageId) {
    const location = `/v1/dienstverleningen/${publicServiceId}/levensloop/fases/${lifeCycleStageId}`;
    return axios.get(location);
  },

  updateAlternativeLabels(id, labels) {
    const location = `/v1/dienstverleningen/${id}/alternatievebenamingen`;
    return axios.patch(location, { labels });
  },

  addStageToLifeCycle({ publicServiceId, body }) {
    const location = `/v1/dienstverleningen/${publicServiceId}/levensloop/fases`;
    return axios.post(location, body);
  },

  changePeriodOfLifeCycleStage({ publicServiceId, lifeCycleStageId, body }) {
    const location = `/v1/dienstverleningen/${publicServiceId}/levensloop/fases/${lifeCycleStageId}`;
    return axios.put(location, body);
  },

  removeLifeCycleStage({ publicServiceId, lifeCycleStageId }) {
    const location = `/v1/dienstverleningen/${publicServiceId}/levensloop/fases/${lifeCycleStageId}`;
    return axios.delete(location);
  },

  removeService(id, reasonForRemoval) {
    const location = `/v1/dienstverleningen/${id}`;
    return axios.delete(location, { data: { reden: reasonForRemoval } });
  },
};
