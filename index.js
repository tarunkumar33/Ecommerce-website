const cart_items = document.querySelector('#cart .cart-items');
const ecommContainer=document.getElementById('EcommerceContainer');
const pagination=document.getElementById('pagination');
//axios
const axiosObj=axios.create({
    baseURL:'http://localhost:3000'
});

window.addEventListener('DOMContentLoaded',fetchProductsHandler);
window.addEventListener('DOMContentLoaded',fetchCartProductsHandler);
ecommContainer.addEventListener('click',ecommContainerHandler);

function fetchProductsHandler(){
    axiosObj.get('/product')
    .then(res=>{
        displayProducts(res.data.products);
        displayPagination(res.data);

    })
    .catch(err=>console.log(err));
}
function displayPagination({hasPreviousPage,previousPage,hasNextPage,nextPage,currentPage,lastPage}){
    pagination.innerHTML='';
    if(hasPreviousPage){
        pagination.innerHTML+=`<button class="btn" onClick="showPageProducts(${previousPage})">
        ${previousPage} </button>`;
    }
    pagination.innerHTML+=`<button class="btn active" onClick="showPageProducts(${currentPage})">
        ${currentPage}</button>`;
    if(hasNextPage){
        pagination.innerHTML+=`<button class="btn" onClick="showPageProducts(${nextPage})">
        ${nextPage}</button>`;
    }
    if(lastPage!=currentPage && lastPage!=nextPage)
        pagination.innerHTML+=`<button class="btn" onClick="showPageProducts(${lastPage})">
        ${lastPage}</button>`;
}
function showPageProducts(page){
    axiosObj.get(`/product?page=${page}`)
    .then(res=>{
        displayProducts(res.data.products);
        displayPagination(res.data);

    })
    .catch(err=>console.log(err));
}
function displayProducts(products){
    const productsUI=document.getElementById('music-content');
        let childUI='';
        products.forEach((item)=>{
            childUI+=`<div id='product-${item.id}'>
                    <h3>${item.productName}</h3>
                    <div class="image-container">
                        <img class="prod-images" src="${item.imageUrl}" alt="">
                    </div>
                    <div class="prod-details">
                        <span>$<span>${item.price}</span></span>
                        <button class="shop-item-button" type='button'>ADD TO CART</button>
                    </div>
                </div>`;
        })
        productsUI.innerHTML=childUI;
}

function fetchCartProductsHandler(){
    axiosObj.get('/cart')
    .then(res=>{
        // navbar cart count increase
        document.querySelector('.cart-number').innerText = res.data.length;
        let total_cart_price = document.querySelector('#total-value').innerText;
        res.data.forEach((item)=>{
            //adding product to cart and updating the total price
            const cart_item = document.createElement('div');
            cart_item.classList.add('cart-row');
            cart_item.setAttribute('id',`in-cart-${item.id}`);
            total_cart_price = parseFloat(total_cart_price) + parseFloat(item.price)
            total_cart_price = total_cart_price.toFixed(2)
            document.querySelector('#total-value').innerText = `${total_cart_price}`;
            cart_item.innerHTML = `
            <span class='cart-item cart-column'>
                <img class='cart-img' src="${item.imageUrl}" alt="">
                <span>${item.productName}</span>
            </span>
            <span class='cart-price cart-column'>${item.price}</span>
            <span class='cart-quantity cart-column'>
                <input type="text" value="${item.cartItem.quantity}">
                <button>REMOVE</button>
            </span>`
            cart_items.appendChild(cart_item)
        })

    })
    .catch(err=>console.log(err));

}

function ecommContainerHandler(e){

    //if add to cart btn clicked
    if (e.target.className=='shop-item-button'){
        //storing values
        const id = e.target.parentNode.parentNode.id
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
        let total_cart_price = document.querySelector('#total-value').innerText;
        console.log(id.split('-')[1]);
        axiosObj.post('/cart',{productId:id.split('-')[1]})
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
        console.log(id.split('-')[1]);
        if (document.querySelector(`#in-cart-${id.split('-')[1]}`)){
            alert('This item is already added to the cart');
            
            return
        }
        // navbar cart count increase
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1;

        //adding product to cart and updating the total price
        const cart_item = document.createElement('div');
        cart_item.classList.add('cart-row');
        cart_item.setAttribute('id',`in-cart-${id.split('-')[1]}`);
        total_cart_price = parseFloat(total_cart_price) + parseFloat(price)
        total_cart_price = total_cart_price.toFixed(2)
        document.querySelector('#total-value').innerText = `${total_cart_price}`;
        cart_item.innerHTML = `
        <span class='cart-item cart-column'>
            <img class='cart-img' src="${img_src}" alt="">
            <span>${name}</span>
        </span>
        <span class='cart-price cart-column'>${price}</span>
        <span class='cart-quantity cart-column'>
            <input type="text" value="1">
            <button>REMOVE</button>
        </span>`
        cart_items.appendChild(cart_item)

        //notification
        const container = document.getElementById('container');
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
        container.appendChild(notification);
        setTimeout(()=>{
            notification.remove();
        },2500)
    }

    //to open hamburger menu
    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        document.querySelector('#cart').style = "display:block;"
    }
    //to close hamburger menu
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }

    //purchase
    if (e.target.className=='purchase-btn'){
        if (parseInt(document.querySelector('.cart-number').innerText) === 0){
            alert('You have Nothing in Cart , Add some products to purchase !');
            return
        }
        axiosObj.get('/create-order')
        .then(res=>{
            console.log(res.data);
            alert(`Order id ${res.data.id} Placed Successfully.Thanks for the purchase`);
            cart_items.innerHTML = ""
            document.querySelector('.cart-number').innerText = 0
            document.querySelector('#total-value').innerText = `0`;
        })
        .catch(err=>console.log(err));
        
    }

    //remove product
    if (e.target.innerText=='REMOVE'){
        let total_cart_price = document.querySelector('#total-value').innerText;
        total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2) ;
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)-1
        document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
        e.target.parentNode.parentNode.remove()
    }

}