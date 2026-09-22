import api from '../../utils/axios.js'


const logOut = async () => {
  try{
    const {data} = await api.get('/api/auth/logout')
    console.log(data)
  }
  catch(err){
    console.log(err)
  }
}

export default logOut