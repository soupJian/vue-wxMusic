import axios from 'axios'
const baseUrl = 'https://music-soupjian.vercel.app'
const service = axios.create({
  
  method: 'get'
})
service.interceptors.request.use(config=>{
  config.params = {
    ...config.params,
    realIP: '116.25.146.177',
  }
  return config
})

export const request = (params) => {
  // const baseUrl = '/api';
  let url = `${baseUrl}${params.url}`;
  return service({
    url,
    withCredentials: true
  });
};
export const requestCookie = (params) => {
  // const baseUrl = '/api';
  const cookie = localStorage.getItem('cookie');
  let url = `${baseUrl}${params.url}?cookie=${cookie}`;
  return service({
    url,
    withCredentials: true
  });
};