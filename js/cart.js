const cart = CART_INFO_URL + "25801.json";
cartInfo = {};

function showCart(array){
    //inicio estructura del carrito
    htmlContentToAppend = `
    <div>
        <table class="table cart-table">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Costo</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Subtotal</th>
                    <th class="tablefixer"></th>
                </tr>
            </thead>
            <tbody>`;
    //productos del carrito
    for (i=0; i<array.length; i++){
        let product = array[i];
        htmlContentToAppend += `
                <tr>
                    <td class="tableImg"><img class="cart-img" src="${product.image}"></td>
                    <td>${product.name}</td>
                    <td>${product.currency} ${product.unitCost}</td>
                    <td class="cartInput"><input type="number" id="inputCount${product.id}" name="count" value="${product.count}" min="1"></td>
                    <td id="subtotal${product.id}">${product.currency} ${product.unitCost*product.count}</td>
                    <td class="tablefixer"></td>
                </tr>`
    }
    //final estructura del carrito
    htmlContentToAppend += `
            </tbody>
        </table>
    </div>
    `;
    document.getElementById("cartBody").innerHTML = htmlContentToAppend;
    
    //addEventListeners para el calculo del subtotal
    for(i=0; i<array.length; i++){
        let product = array[i];
        document.getElementById(`inputCount${product.id}`).addEventListener("input", function(event){
            document.getElementById(`subtotal${product.id}`).innerHTML = `${product.currency} ${product.unitCost*document.getElementById(`inputCount${product.id}`).value}`
    })
    }
}


//ejecucion del codigo
document.addEventListener("DOMContentLoaded", function(event){

    getJSONData(cart).then(function(resultObj){
        if (resultObj.status === "ok"){
            cartInfo = resultObj.data.articles;
            showCart(cartInfo)
        }
    })

})