const currentCat = localStorage.getItem("catID"); //obtener categoria seleccionada
const products = PRODUCTS_URL+currentCat+".json"; // url de la categoria seleccionada
let productsArray = []; //inicializar el arreglo
let productsArrayFiltered = []; //inicializar el arreglo filtrado

//mostrar descripcion de la seccion
function showSectionDescription(category){
    let p = document.getElementById("secDesc");
    p.innerHTML = `Aquí verás los productos de la categoría ${category}`
}

//llenar el contenedor con productos
function showProducts(array){
    if (array.length == 0){ //si el array esta vacio (no hay resultados)
        document.getElementById("product-list-container").innerHTML = `
        <div class="d-flex w-100 justify-content-between">
            <div class="mb-1">
            <p>No hay resultados</p>
            </div>
        </div>`
    } else { //si el arreglo no esta vacio (hay resultados)
        let htmlContentToAppend = "";
        for (let i = 0; i<array.length; i++){ //aqui es donde sucede la magia
            let product = array[i];
            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <a href="product-info.html" id="img-link-${product.id}">
                            <img src="` + product.image + `" alt="product image" class="img-thumbnail">
                        </a>
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1">
                                <a class="product-list-link" href="product-info.html" id="product-link-${product.id}">
                                    <h4>`+ product.name +` - ` + product.currency +` `+ product.cost +`</h4>
                                </a>
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
}

//desplegar los eventos
function deployEvents(array){
    for(i = 0; i<array.length; i++){
        let product = array[i];
        document.getElementById(`product-link-${product.id}`).addEventListener("click", function(event){
            event.preventDefault();
            localStorage.setItem("storedProductID", product.id);
            window.location.href="product-info.html"
        })
        document.getElementById(`img-link-${product.id}`).addEventListener("click", function(event){
            event.preventDefault();
            localStorage.setItem("storedProductID", product.id);
            window.location.href="product-info.html"
        })
    }
}


//ordenado del arreglo de productos

//relevancia descendente
function sortListRelDown(array){
    array.sort(function(a,b){
        if (a.soldCount < b.soldCount) {
            return 1;
        } 
        if (a.soldCount > b.soldCount) {
            return -1;
        }
        return 0;
    })
}

//precio descendente
function sortListPriceDown(array){
    array.sort(function(a,b){
        if (a.cost < b.cost) {
            return 1;
        } 
        if (a.cost > b.cost) {
            return -1;
        }
        return 0;
    })
}

//precio ascendente
function sortListPriceUp(array){
    array.sort(function(a,b){
        if (a.cost < b.cost) {
            return -1;
        } 
        if (a.cost > b.cost) {
            return 1;
        }
        return 0;
    })
}


//filtrado del arreglo de productos
function filterList(){
    if ((priceMin.value == "") && (priceMax.value == "")){ //si ambos campos estan vacios
        return (productsArray) //devolver la lista completa
    } else { //si se ingreso algo
        if (priceMax.value == ""){ //si solo se ingreso un minimo
            return(productsArray.filter(function(productToFilter){//filtrar segun minimo
                return (productToFilter.cost >= priceMin.value)
            }))
        } else if(priceMin.value == ""){//si solo se ingreso un maximo
            return (productsArray.filter(function(productToFilter){//filtrar segun maximo
                return (productToFilter.cost <= priceMax.value)
            }))
        } else {//si se ingreso minimo y maximo
            return (productsArray.filter(function(productToFilter){//filtrar segun minimo y maximo
                return ((productToFilter.cost >= priceMin.value) && (productToFilter.cost <= priceMax.value))
            }))
        }
    }
}

//limpiar filtros
function clearFilter(){
    priceMin.value = "";
    priceMax.value = "";
    productsArrayFiltered = productsArray;
}

//ejecucion del codigo
document.addEventListener("DOMContentLoaded", function(event){ //esperando a que se cargue el DOM
    getJSONData(products).then(function(resultObj){ //getJSONData definida en init.js
        if (resultObj.status === "ok")
        {
            showSectionDescription(resultObj.data.catName); //invocar showSectionDescription definida mas arriba para mostrar la descripcion de la seccion
            productsArray = resultObj.data.products; //llenar productsArray con los products del json
            sortListRelDown(productsArray); //ordenar el array por relevancia por defecto
            productsArrayFiltered = productsArray; //copiar el array original en ArrayFIltered
            showProducts(productsArrayFiltered); //invocar showProducts definida mas arriba con productsArrayFiltered para que me genere la lista en el HTML
            deployEvents(productsArrayFiltered)
        }
    });

    let priceDown = document.getElementById("priceDown");
    priceDown.addEventListener("click", function(event){ //click en priceDown
        sortListPriceDown(productsArray);
        sortListPriceDown(productsArrayFiltered);
        showProducts(productsArrayFiltered);
        deployEvents(productsArrayFiltered)
    })

    let priceUp = document.getElementById("priceUp");
    priceUp.addEventListener("click", function(event){ //click en priceUp
        sortListPriceUp(productsArray);
        sortListPriceUp(productsArrayFiltered);
        showProducts(productsArrayFiltered);
        deployEvents(productsArrayFiltered)
    })

    let RelDown = document.getElementById("relDown");
    RelDown.addEventListener("click", function(event){ //click en RelDown
        sortListRelDown(productsArray);
        sortListRelDown(productsArrayFiltered);
        showProducts(productsArrayFiltered);
        deployEvents(productsArrayFiltered)
    })

    let form = document.getElementById("filterForm");
    form.addEventListener("submit", function(event){ //prevent default del formulario de filtrado
        event.preventDefault()
    })
    let priceMin = document.getElementById("priceMin");
    let priceMax = document.getElementById("priceMax");
    let filter = document.getElementById("filterBtn");
    filter.addEventListener("click", function(event){ //click en filtrar
        productsArrayFiltered = filterList();
        showProducts(productsArrayFiltered);
        deployEvents(productsArrayFiltered)
    })
    let clear = document.getElementById("clrBtn");
    clear.addEventListener("click", function(event){//click en limpiar
        clearFilter(); //limpiar los filtros
        showProducts(productsArray); //mostrar el arreglo sin filtrar
        deployEvents(productsArray)
    })


}); 