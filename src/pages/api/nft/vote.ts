import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { VoteNFTProps } from "src/types/nft";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsUserHandler(req:NextApiRequest, res:NextApiResponse) {
    return new Promise((resolve, reject) => {
        const handleError = (e:any) => errorHandling(e, resolve, res);

        try {
            const  { nftId} = req.body;
            getSessionUser(req, res)
                .then((user) => voteUser({properties:{votes:[user.handle]}, nftId: nftId }))
                .then((body) => resolve(res.status(200).json(body)))
                .catch(handleError)
        } catch(e:any) {
            handleError(e);
        }
    })
}

export async function voteUser(props:VoteNFTProps) {
    const response = await axios.put('https://api.assetlayer.com/api/v1/nft/update', 
        props, 
        {headers: headers}
    );

    return response.data.body;
}