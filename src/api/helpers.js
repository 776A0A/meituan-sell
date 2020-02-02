import axios from 'axios';

const SUCCESS_CODE = 0;

export function get(url) {
  return params => {
    return axios
      .get(url, { params })
      .then(res => {
        const { errno, data } = res.data;
        if (errno === SUCCESS_CODE) {
          return data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}
