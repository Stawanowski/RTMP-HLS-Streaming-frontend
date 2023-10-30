// import nextAppSession, {promisifyStore} from 'next-app-session';
// import Redis from 'ioredis';
// import RedisStore from 'connect-redis';
// const maxAge = 30 * 24 * 60 * 60 * 100;

// export const session = nextAppSession<SessionData>({
  
//   name: 'session-id',
//   secret: process.env.SESSION_SECRET,
//   cookie: {maxAge: maxAge},
//   store: promisifyStore(
//     new RedisStore({
//       client: new Redis({
//         host: '192.168.1.94',
//         port: 6379
//       })
//     })
//   )
// }); 
