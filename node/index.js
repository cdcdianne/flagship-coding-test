import fetch from 'node-fetch';

const args = process.argv.slice(2)
const product_id = typeof(args[0]) === Number ? args[0] : Number(args[0]) 
const SHOP_URL = "https://flagship-dayana.myshopify.com/admin/api/2022-04"

const headersOptions = {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': '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'
}

async function fetchMetaData(product_id) {
    
    if(!product_id){
        console.error("NO/INVALID PRODUCT ID PROVIDED")
        return
    }
    
    let paramsData = 
    {
        "metafield":
        {
            "namespace":"global",
            "key":"test2",
            "value":0,
            "type":"integer"
        }
    }

    const response = await fetch(`${SHOP_URL}/products/${product_id}/metafields.json`,
        {
            method: 'get',
            headers: headersOptions
        }
    )

    const { metafields, errors } = await response.json()
    
    if(errors){
        console.log(errors);
        return
    }

    // check if metafield already exists
    let findExistingMetafield = metafields.find(o => o.key === paramsData.metafield.key);

    // if metafield exist, increment value
    if(findExistingMetafield){
        paramsData.metafield.value = findExistingMetafield.value + 1
    }

    postMetafield(paramsData, product_id)

}  


async function postMetafield (paramsData, product_id){
    const postMetaDataResponse = await fetch(`${SHOP_URL}/products/${product_id}/metafields.json`,
        {
            method: 'post',
            body: JSON.stringify(paramsData),
            headers: headersOptions
        }
    )

    const { metafield } = await postMetaDataResponse.json()
    
    if(metafield) console.log("SUCCESS");
    else console.log("FAILED");

    return postMetaDataResponse
}


fetchMetaData(product_id);

