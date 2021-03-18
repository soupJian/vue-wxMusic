import axios from 'axios'
export const request = (params) => {
    const baseUrl = '/api';
    let url = `${baseUrl}${params.url}`;
    return axios.get(url);
  };
  export const requestCookie = (params) => {
    const baseUrl = 'http://www.soupjian.work:3000';
    const cookie = localStorage.getItem('cookie');
    let url = `${baseUrl}${params.url}?cookie=${cookie}`;
    return axios.get(url);
  };