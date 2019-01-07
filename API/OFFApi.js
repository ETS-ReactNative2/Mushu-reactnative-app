
const lang = 'fr';
const apiUrl = 'https://' + lang + '.openfoodfacts.org';

export function getProductInfoFromApi(barcode) {
    const url = apiUrl + '/api/v0/product/' + barcode + '.json';
    return fetch(url)
        .then((response) => response.json())
        .then((json) => {
            console.log(json);
            if (json.status !== 0 && json.code && json.code.length > 0) {
                let jsonProduct = json.product;
                return {
                    "_id": json.code,
                    "product_name": jsonProduct.product_name_fr,
                    "image_url": jsonProduct.image_url,
                    "quantity": jsonProduct.quantity,
                    "packaging": jsonProduct.packaging,
                    "brands": jsonProduct.brands
                };
            } else {
                return undefined;
            }
        })
        .catch((error) => console.error(error))
}

export function getAllergensFromApi() {
    const url = apiUrl + '/allergens.json';
    return fetch(url)
        .then((response) => response.json())
        .then((json) => {
            // console.log(json);
            let allergens = [];
            if (json.tags) {
                allergens = json.tags
                    .filter((obj => (obj.id !== obj.name) && obj.products > 50))
                    .map((obj) => {
                        return {
                            id: obj.id,
                            name: obj.name,
                        }
                    });
            }
            return allergens;
        })
        .catch((error) => console.error(error))
}
