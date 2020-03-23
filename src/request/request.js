import axios from 'axios'

export function request(config){
  let myaxios=axios.create({
    //baseURL:'http://123.207.32.32:8000/api/wh'
    baseURL:"http://106.54.54.237:8000/api/wh/home/multidata"
    ,timeout:10000
  });
  return myaxios(config)
}