import axios from "axios";

interface UserData {
    username: string | undefined;
    accessTokenExpires: Date | undefined;
    refreshTokenExpires: Date | undefined;
    email: string | undefined;
    pfp: string | undefined;
  }
 
export const verifyLoginData = async (localStorageData:any) => {
    try{
        let sessionData = (await ( await axios.get("/api/readCookies/session")).data).userData
        if (
            (sessionData == "undefined" || !sessionData ) && (!localStorageData || localStorageData == "undefined")
          ) {
            throw new Error();
          }

          if (!sessionData || sessionData == 'undefined') {
            sessionData = localStorageData;
            if (!sessionData || sessionData == 'undefined') {
              throw new Error();
            }
          }
          const userData = await (
            await axios.post("/api/session/readSessionData", { sessionData: sessionData, x:'asfas' })
          ).data;
          let { username, accessTokenExpires, refreshTokenExpires, email, pfp, bannedOnChannel  } =
          userData;
          const follows = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/getFollowed/${username}`)
          const modOn = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/getMod/${username}`)
          if (!username) {
            throw new Error();
          } else if (refreshTokenExpires <= new Date().getDate()) {
            throw new Error();
          } else if (accessTokenExpires <= new Date().getDate()) {
            throw new Error();
          } else {
            return { username, accessTokenExpires, refreshTokenExpires, email, pfp, bannedOnChannel, follows: follows.data, mod:modOn.data }
          }
    }catch{
        return undefined
    }
  }