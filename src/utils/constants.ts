// IPFS MODULE
import { create } from "ipfs-http-client";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL
export const IPFS = "ipfs://";
export const INFURA_IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_DEDICATED_GATEWAY_SUBDOMAIN;
export const ipfsClient = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
        authorization:
            "Basic " +
            Buffer.from(
                process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID +
                    ":" +
                    process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
            ).toString("base64"),
    },
});
export const DARK_THEME = "dark";
export const LIGHT_THEME = "light";
// CryptoCompare
export const CRYPTOCOMPARE_API_KEY = process.env.NEXT_PUBLIC_CRYPTOCOMPARE_API_KEY;

// EVM MODULE
export const INFURA_ID = process.env.NEXT_PUBLIC_INFURA_ID;
export const ALCHEMY_ID = process.env.NEXT_PUBLIC_ALCHEMY_ID;

export const FOLLOW_TWITTER_GM_LINK =
    "https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fdeveloper.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Eloyalty_gm&screen_name=loyalty_gm";
export const RETWEET_GM_LINK = "https://twitter.com/intent/retweet?tweet_id=" + process.env.NEXT_PUBLIC_RETWEET_GM_LINK_ID;

export const FOLLOW_TWITTER_ETHOS_LINK =
    "https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fdeveloper.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5Eethoswalletxyz&screen_name=ethoswalletxyz";
export const RETWEET_ETHOS_LINK = "https://twitter.com/intent/retweet?tweet_id=" + process.env.NEXT_PUBLIC_RETWEET_ETHOS_LINK_ID;



export const DISCORD_LINK = process.env.NEXT_PUBLIC_DISCORD_LINK