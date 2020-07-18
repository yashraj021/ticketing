import axios from 'axios';

export default ({ req }, service) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: `http://${service}:3000`,
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: '/',
    });
  }
};
