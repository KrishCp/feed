/* eslint-disable import/prefer-default-export */


import axios from "axios";
import { apiUrl } from "./config"

export const getDonation = async (id) => {
    try {
 const response = await axios({

    url: `${apiUrl}/api/donations/${id}`,
    method: 'GET',
    headers:{
        'Content-Type': 'application/json',
    },
 });
 if(response.statusText !== 'OK'){
     throw new Error(response.data.message);

 }
 return response.data; 
    } catch (err){
        console.log(err);
        return {error: err.response.data.message || err.message};
    }
}; 
export const getPaypalClientId = async () => {
    const response = await axios ({
    url:`${apiUrl}/api/paypal/clientId`,
    headers: {
        'Content-Type' : 'application/json'
    },
    });
    if(response.statusText !==  'OK'){
    throw new Error(response.data.message);

    }
    return response.data.clientId;
}