
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}`

export const login = async (email:string, password:string) => {
  const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, {
    email,
    password
  });
  delete response.data.follows
  return response.data;
};


export const register = async (email:String, password:String, username:String, file:File) => {
  
  const extension = file.name.split('.').pop();
  const type = file.type
  const uuidName = uuidv4(); // Assuming you have a function to generate a UUID.
  const newFileName = `${uuidName}.${extension}`;

  var blob = file.slice(0, file.size, file.type); 
  var newFile = new File([blob], newFileName, {type: file.type});
  try {
    const formData = new FormData()
    formData.append('file', newFile)
    formData.append('test', 'test')
    const ftpRes = await axios.post(`${API_BASE_URL}/api/v1/file/upload`, formData)
    const response = await axios.post(`${API_BASE_URL}/api/v1/auth/register`, {
      email,
      password,
      username,
      pfp:newFileName,
    });
    delete response.data.follows
    return response.data;
  } catch (error) {
    // Handle error
    console.error('Error during registration:', error);
    throw new Error('Registration failed');
  }
};


export const refreshToken = async (refreshToken:string) => {
  const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refreshToken`, {
    refreshToken,
  });
  return response.data;
};
