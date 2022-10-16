const ordersSection=document.getElementById('orders');
//axios
const axiosObj=axios.create({
    baseURL:'http://localhost:3000'
});

window.addEventListener('DOMContentLoaded',fetchOrdersHandler);

function fetchOrdersHandler(){
    axiosObj.get('/orders')
    .then(res=>{
        displayOrders(res.data);
    })
    .catch(err=>console.log(err));
}
function displayOrders(orders){
    ordersSection.innerHTML='';
    orders.forEach(order=>{
        ordersSection.innerHTML+=`<li><h1>Order id: ${order.id}</h1>`;
        order.products.forEach(product=>{
            ordersSection.innerHTML+=`<li>Product Name: ${product.productName} Quantity: ${product.orderItem.quantity}</li>`;
        });
        ordersSection.innerHTML+='</li>';
    })

}