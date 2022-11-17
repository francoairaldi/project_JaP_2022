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
                    <td class="cartInput"><input type="number" id="inputCount${product.id}" name="count" value="${product.count}" class="form-control"></td>
                    <td id="subtotal${product.id}" data-sub="${product.unitCost*product.count}">${product.currency} ${product.unitCost*product.count}</td>
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
            document.getElementById(`subtotal${product.id}`).innerHTML = `${product.currency} ${product.unitCost*document.getElementById(`inputCount${product.id}`).value}`; //subtotal por producto
            document.getElementById(`subtotal${product.id}`).setAttribute(`data-sub`, `${product.unitCost*document.getElementById(`inputCount${product.id}`).value}`) //data para el subtotal general
        })
    }
}

//calcular los costos
function calcCosts(array){
    let subtotal = 0;
    let shipment = 0;
    let total = 0;
    let shipmentMod = JSON.parse(document.querySelector('input[name="shipmentType"]:checked').value);
    //mostrar subtotal
    for (i=0; i<array.length; i++){
        let product = array[i];
        if (product.currency == "UYU"){
            subtotal += JSON.parse(document.getElementById(`subtotal${product.id}`).dataset.sub*0.025) //UYU to USD
        } else {
            subtotal += JSON.parse(document.getElementById(`subtotal${product.id}`).dataset.sub);
        }
    }
    document.getElementById("cost-subtotal").innerHTML = `USD ${subtotal}`;

    //mostrar envio
    shipment = Math.round((shipmentMod/100)*subtotal);
    document.getElementById("cost-shipment").innerHTML = `USD ${shipment}`;

    //mostrar total
    total = Math.round(subtotal + shipment);
    document.getElementById("cost-total").innerHTML = `USD ${total}`
}

//validar formulario
function validatePurchase(){
    let address1 = document.getElementById("calle");
    let addressNum = document.getElementById("numero");
    let address2 = document.getElementById("esquina");
    let rdCard = document.getElementById("rdCard");
    let rdTrans = document.getElementById("rdTrans");
    let cardNum = document.getElementById("cardNum");
    let cardCSC = document.getElementById("cardCSC");
    let cardExp = document.getElementById("cardExp");
    let bnkAcc = document.getElementById("bnkAcc");
    let pymtMethod = (rdCard.checked || rdTrans.checked);

    //datos de envio y metodo de pago
    function validate1(input){

        if (typeof input.value == "string"){
            if (input.value == ""){
                input.classList.remove("is-valid");
                input.classList.add("is-invalid")
            } else {
                input.classList.remove("is-invalid");
                input.classList.add("is-valid")
            }
        } else if (typeof input == "boolean"){
            if(input == false){
                document.getElementById("pymtWarn").removeAttribute("hidden")
            } else {
                document.getElementById("pymtWarn").setAttribute("hidden", true)
            }
        }
    }

    //campos pago
    function validate2(input){
        if (input.value == ""){
            input.classList.remove("is-valid");
            input.classList.add("is-invalid")
        } else {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid")
        }
    }

    //articulos > 0
    for (i=0; i<cartInfo.length; i++){
        let product = cartInfo[i];
        let productCountInput = document.getElementById(`inputCount${product.id}`);
        if (productCountInput.value<1){
            productCountInput.classList.remove("is-valid");
            productCountInput.classList.add("is-invalid")
        } else {
            productCountInput.classList.remove("is-invalid");
            productCountInput.classList.add("is-valid")
        }
    }

    validat1(address1);
    validat1(addressNum);
    validat1(address2);
    validate1(pymtMethod);
    validate2(cardNum);
    validate2(cardCSC);
    validate2(cardExp);
    validate2(bnkAcc);

    //exito

}

//ejecucion del codigo
document.addEventListener("DOMContentLoaded", function(event){

    getJSONData(cart).then(function(resultObj){
        if (resultObj.status === "ok"){
            cartInfo = resultObj.data.articles;
            showCart(cartInfo);
            calcCosts(cartInfo);
            document.getElementById("main-container").addEventListener("input", function(event){
                calcCosts(cartInfo)
            });
            //seleccionar metodo de pago
            document.getElementById("modalPayment").addEventListener("input", function(event){
                if (document.querySelector('input[name="paymentOption"]:checked').value == "card"){
                    //info tarjeta activa
                    document.getElementById("cardNum").removeAttribute("disabled");
                    document.getElementById("cardCSC").removeAttribute("disabled");
                    document.getElementById("cardExp").removeAttribute("disabled");
                    document.getElementById("bnkAcc").setAttribute("disabled", true)
                } else if (document.querySelector('input[name="paymentOption"]:checked').value == "transfer"){
                    //numero de cuenta activo
                    document.getElementById("bnkAcc").removeAttribute("disabled");
                    document.getElementById("cardNum").setAttribute("disabled", true);
                    document.getElementById("cardCSC").setAttribute("disabled", true);
                    document.getElementById("cardExp").setAttribute("disabled", true)
                }
            })
            //validacion
            document.addEventListener("submit", function(event){
                event.preventDefault();
                validatePurchase();
            })
        }
    })

})