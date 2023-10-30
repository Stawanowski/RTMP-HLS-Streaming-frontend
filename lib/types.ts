type Ban = {
    id: String,
    username: String,
    channel: String
}

type Message = {
    id:Number,
    username:String,
    channel:String,
    content:String,
    sentOn: Date
}
type Vip = {
    id:String,
    username:String,
    channel:String,
    vipSince:Date
}
type Mod = {
    id:String,
    username:String,
    channel:String,
    modSince:Date
}
type Follow = {
    id:String,
    username:String,
    channel:String,
    followingSince:Date
}
type Live = {
    id: String,
    channelName: String,
    category: String,
    live:Boolean
}

type User = {
    id: string,
    email: string,
    username:string,
    bannedOnChannel: Array<Ban>,
    messagesSent: Array<Message>,
    isLive: Array<Live>,
    pfp: string,
    description:string,
    streamKey:string,
    createdAt:Date,
    updatedAt:Date,
    bans:Array<Ban>,
    follows:Array<Follow>,
    followedBy:Array<Follow>,
    modOn:Array<Mod>,
    moddedHere:Array<Mod>,
    vipOn:Array<Vip>,
    vipsHere:Array<Vip>,
    files: Array<{title:string, onChannel:string}>,
    Files: Array<{title:string, onChannel:string}>,
    emailVerified: Boolean
}

type SessionData = {
    _jwtAccessToken?: String,
    _jwtRefreshToken?: string,
    username?: string,
    email?: string,
    counter?: number;
    accessTokenExpires?: Date,
    refreshTokenExpires?: Date
}