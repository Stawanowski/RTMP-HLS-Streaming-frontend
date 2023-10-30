import React from "react";
import styles from "./Channels.module.css";
import axios from "axios";
import {
  ChannelCardLive,
  ChannelCardOffline,
  CompactChannelCardLive,
  CompactChannelCardOffline,
} from "../ChannelCards/ChannelCards.component";
import { channel } from "diagnostics_channel";

const Channels = async () => {
  const channelsResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/fetchUsers`
  );
  if (
    !channelsResponse ||
    channelsResponse.status != 200 ||
    channelsResponse.data == "Fetch failed"
    ) {
      return <>No channels</>;
    }
    const channels: Array<User> = channelsResponse.data;
    console.log(channels[1].isLive[0]?.live)
  return (
    <div className={styles.container}>
        <h4>Channels</h4>
        <div className={styles.wide}>
          {channels && (
            <>
              {channels.map((user: User) => (
                <div key={`${user.id}`}>
                  {user.isLive[0]?.live ? (
                    <>
                      <ChannelCardLive channel={user} />
                    </>
                  ) : (
                    <>
                      <ChannelCardOffline channel={user} />
                    </>
                  )}
                </div>
              ))}
            </>
          )}
      </div>
      <div className={styles.small}>
        <>
          {channels.map((user: User) => (
            <div key={`${user.id}`}>
              {user.isLive[0]?.live ? (
                <>
                  <CompactChannelCardLive channel={user} />
                </>
              ) : (
                <>
                  <CompactChannelCardOffline channel={user} />
                </>
              )}
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default Channels;
