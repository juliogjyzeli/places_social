import { useState, useEffect , useCallback } from "react";

let logoutTimer;
export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokennExpirationDate , setTokennExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
  
     
  
    const login = useCallback((uid,token , expirationDate) => {
      setToken(token);
      const tokenExpirationDate = expirationDate ||  new Date(new Date().getTime() + 1000 * 60 *60)
      setTokennExpirationDate(tokenExpirationDate)
      localStorage.setItem('userData', JSON.stringify({
        userId:uid,
        token:token,
        expiration : tokenExpirationDate.toISOString()
      }))
      setUserId(uid);
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokennExpirationDate(null);
      setUserId(null);
      localStorage.removeItem('userData')
    },[]
    );
  
    useEffect(()=>{
      if(token &&tokennExpirationDate ){
        const remainingTime = tokennExpirationDate.getTime() - new Date().getTime()
       logoutTimer= setTimeout(logout ,remainingTime)
      }else{
        clearTimeout(logoutTimer);
      }
    },[token,logout ,tokennExpirationDate ])
  
    useEffect(() => {
      const storedData=  JSON.parse(localStorage.getItem('userData'));
      if(storedData && storedData.token && new Date(storedData.expiration) > new Date()){
        login(storedData.userId, storedData.token, new Date(storedData.expiration) )
      }  
    },[login])
    return {token , login , logout,userId };
}