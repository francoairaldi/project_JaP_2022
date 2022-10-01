console.log(localStorage.getItem("storedProductID"));
const product = PRODUCT_INFO_URL + localStorage.getItem("storedProductID") + ".json";
const productComments = PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("storedProductID") + ".json";

//mostrar informacion del producto
function showInfo(object){
    document.getElementById("title").innerHTML = `${object.data.name}`;
    document.getElementById("price").innerHTML = `${object.data.currency} ${object.data.cost}`;
    document.getElementById("description").innerHTML = `${object.data.description}`;
    document.getElementById("category").innerHTML = `${object.data.category}`;
    document.getElementById("sold").innerHTML = `${object.data.soldCount}`;
    let htmlContentToAppend = "";
    for (let i = 0; i<object.data.images.length; i++){
        let images = object.data.images[i];
        htmlContentToAppend += `
        <div class="col">
            <img src="${images}" class="img-thumbnail">
        </div>
        `;
        document.getElementById("img").innerHTML = htmlContentToAppend
    }
}

//mostrar estrellas
function stars(n){
    let starsHTML = ``;
    for (let i = 1; i<=n; i++){
        starsHTML += `
        <span class="fa fa-star checked"></span>`
    }
    for(let i = 1; i<=5-n; i++){
        starsHTML += `
        <span class="fa fa-star"></span>`
    }
    return starsHTML
}

//mostrar comentarios del producto
function showComments(object){
    let htmlContentToAppend = "";
    for (let i = 0; i<object.data.length; i++){
        let comment = object.data[i];
        htmlContentToAppend += `
        <div class="list-group-item">
            <div class="row">
                <div class="col">
                <p><strong>${comment.user}</strong> - ${comment.dateTime} -`;
                htmlContentToAppend += stars(comment.score);
                htmlContentToAppend += `</p>
                </div>;
            </div>
            <div class="row">
                <span>${comment.description}</span> 
            </div>
        </div>
        `
        ;
    }
    document.getElementById("comments").innerHTML = htmlContentToAppend;
}

//ejecucion del codigo
document.addEventListener("DOMContentLoaded", function(event){

    getJSONData(product).then(function(resultObj){
        if (resultObj.status === "ok"){
            console.log(resultObj.data)
            showInfo(resultObj)
        }
    })
    getJSONData(productComments).then(function(resultObj){
        if (resultObj.status === "ok"){
            console.log(resultObj.data)
            showComments(resultObj)
        }   
    })
})