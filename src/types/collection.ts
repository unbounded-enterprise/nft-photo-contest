export interface NftId {
    nftId: string;
}

export interface CollectionCreationProps {
	collectionName: string;
	slotId: string;
	type: 'Identical' | 'Unique';
	nftMaximum: string;
	tags: string[];
	handle: string;
	collectionImage?: string;
}

export interface CollectionUpdateProps {
	collectionId: string;
	tags: string[];
	collectionImage?: string;
}

export interface CollectionVoteProps {
	collectionId: string;
    tags: string[];
	properties: object;
}

export interface GetCollectionProps{
    collectionId?: string;
    collectionIds?: string[];
}

export interface GetCollectionNftsProps {
    collectionId: string;
    serials?: string;
    idOnly?: boolean;
}

export interface Collection {
    collectionId: string;
    collectionName: string;
    collectionImage: string;
    creator: string; 
    slotId: string;
    minted: number;
    maximum: number;
    type: 'Indentical' | 'Unique';
    createdAt: number;
    updatedAt: number;
    expressions: string[];
    nfts: NftId[];
}

export default Collection;