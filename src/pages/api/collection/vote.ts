import { NextApiRequest, NextApiResponse } from "next/types";
import axios from "axios";
import { CollectionVoteProps } from "src/types/collection";
import { getSessionUser } from "../auth/[...nextauth]";
import { errorHandling } from "../validate";

const headers = { appsecret: String(process.env.ASSETLAYER_APP_SECRET) };

export default function getNFTsUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return new Promise((resolve, reject) => {
    const handleError = (e: any) => errorHandling(e, resolve, res);

    try {
      const { tags, collectionId } = req.body;
      getSessionUser(req, res)
        .then((user) =>
          voteCollection(
            {
              properties: { votes: [user.handle] },
              tags: tags,
              collectionId: collectionId,
            },
            user.handle,
            collectionId
          )
        )
        .then((body) => resolve(res.status(200).json(body)))
        .catch(handleError);
    } catch (e: any) {
      handleError(e);
    }
  });
}

export async function voteCollection(
  props: CollectionVoteProps,
  handle: string,
  collectionId: string
) {
  let fullResponse;
  let response;
  let collectionInfo = await axios.get(
    "https://api.assetlayer.com/api/v1/collection/info",
    { data: { collectionId: collectionId }, headers }
  );
  console.log(collectionInfo.data.body);
  let contains = await containsUser(collectionInfo.data.body, handle);
  if (!contains) {
    console.log("here");
    fullResponse = await axios.put(
      "https://api.assetlayer.com/api/v1/collection/update",
      props,
      { headers: headers }
    );
    response = fullResponse.data.body;
  }

  return response;
}

const containsUser = async (collection, handle) => {
    console.log(handle);
  if (collection.properties) {
    if (collection.properties["6464dae89c62e203e8e57cd6"]) {
      if (collection.properties["6464dae89c62e203e8e57cd6"].votes) {
        if (
          collection.properties["6464dae89c62e203e8e57cd6"].votes.includes(
            handle
          )
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};
