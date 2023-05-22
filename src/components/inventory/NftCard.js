import NextLink from 'next/link';
import { Card, Grid, Typography } from '@mui/material';

var menuViewExpressionValue;

export const NftCard = ({ search, collection, nft, slot }) => {
  const searchTrue = includeSerial(search, nft);

  nft.expressionValues.forEach((element) => {
    if (element.expression.expressionName === "Menu View") {
      menuViewExpressionValue = element.value;
    }
  });
    
  if (searchTrue) {
    return (
      <Grid item key={nft.nftId} xs={12} md={6} lg={4} xl={3} onClick={()=>{}}>
        <NextLink href={`/inventory/slot/${slot.slotId}/collection/${collection.collectionId}/nft/${nft.nftId}`} passHref legacyBehavior>
          <Card variant="outlined" sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 1,
            m: 1,
            minWidth: "320px"
          }}> 
            <img src={menuViewExpressionValue} alt={'Collection Image'} style={{ maxHeight: '500px', maxWidth: '300px', placeSelf: 'center' }} />
            <Typography variant="p2" sx={{ padding: 1, fontWeight: "bold" }}>
              {collection.collectionName} #{nft.serial}
            </Typography>
          </Card>
        </NextLink>
      </Grid>
    )
  }
}

var searchArray;
var finalArray;
var isTrue;

const includeSerial = (search, nft)=>{
  searchArray = [];
  finalArray = [];
  isTrue = true;

  if (search) {
    isTrue = false;
    searchArray = search.split(",");
    if (searchArray.length > 0) {
      searchArray.forEach((element) => {
        if (element.includes("-")) {
          element = element.split("-");
          finalArray.push(element);
        } else {
          element = parseInt(element);
          finalArray.push(element);
        }
      });
    }
  }

  finalArray.forEach((element) => {
    if (Number.isInteger(element)) {
      if (nft.serial === element) {
        isTrue = true;
      } 
    } else {
      if (Array.isArray(element)) {
        if (nft.serial >= parseInt(element[0]) && nft.serial <= parseInt(element[1])) {
          isTrue = true;
        }
      }
    }
  })

  return isTrue;
}