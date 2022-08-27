// DEPRECATED CODE
// async function populate(){
//     const requestURL = PRODUCTS_URL+"101.json"; // ver despues como modificar la url dinamicamente para cada cat
//     const request = new Request(requestURL);
//     const response = await fetch(request);
//     const myobject = await response.json();
//     const products = myobject.products; //array con productos
// }
// DEPRECATED CODE

const products = PRODUCTS_URL+"101.json"; // ver despues como modificar dinamicamente la url para cada cat
let productsArray = []; //inicializar el arreglo

function showProducts(array){
    let htmlContentToAppend = "";

    for (let i = 0; i<array.length; i++){ //aqui es donde sucede la magia
        let product = array[i];
        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="row">
                <div class="col-3">
                    <img src="` + product.image + `" alt="product image" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <h4>`+ product.name +` - ` + product.currency +` `+ product.cost +`</h4>
                        <p> `+ product.description +`</p>
                        </div>
                        <small class="text-muted">` + product.soldCount + ` vendidos</small>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.getElementById("product-list-container").innerHTML = htmlContentToAppend; //appendeando todo el chorizo de arriba con el .innerHTML
    }
}

document.addEventListener("DOMContentLoaded", function(event){ //esperando a que se cargue el DOM
    getJSONData(products).then(function(resultObj){ //getJSONData definida en init.js
        if (resultObj.status === "ok")
        {
            productsArray = resultObj.data.products; //llenar productsArray con los products del json
            showProducts(productsArray); //invocar showProducts definida mas arriba con productsArray para que me genere la lista en el HTML
        }
    });
});