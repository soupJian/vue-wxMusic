import axios from 'axios'
export const request = (params) => {
    const baseUrl = 'http://www.soupjian.work:3000';
    let url = '';
    if (params.data) {
      url = `${baseUrl}${params.url}?${params.data}`;
    } else {
      url = `${baseUrl}${params.url}`;
    }
    return axios.get(url);
  };
  export const requestCookie = (params) => {
    const baseUrl = 'http://www.soupjian.work:3000';
    const cookie = localStorage.getItem('cookie');
    let url = '';
    if (params.data) {
      url = `${baseUrl}${params.url}?${params.data}&cookie=${cookie}`;
    } else {
      url = `${baseUrl}${params.url}?cookie=${cookie}`;
    }
    return axios.get(url);
  };