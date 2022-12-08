// 請代入自己的網址路徑
const api_path = "likefanzi";
const token = "VH5Fs78wJVTzhStDYVoZRxX31EK2";
//預設載入
function init(){
  getProductList();
  getCartList();
}

//DOM選取
const productList=document.querySelector(".productWrap");

//資料初始化
let productData=[];
// 取得產品列表
function getProductList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
    then(function (response) {
     productData=response.data.products
     renderProductList()
    })
    .catch(function(error){
      console.log(error.response.data)
    })
}
getProductList() 
function renderProductList(){
  let str="";
  productData.forEach(function(item){
    str+=`<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
</li>`
  })
  productList.innerHTML=str;
}


//DOM選取
const cartList=document.querySelector(".shoppingCart-tableList");
const totalPrice=document.querySelector(".totalPrice");
//資料初始化
let cartListData=[];
// 取得購物車列表
function getCartList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
  .then(function (response) {
      cartListData=response.data.carts;
      renderCartList();
    })
}

getCartList();

function renderCartList(){
  let str="";
  let total=0;
  cartListData.forEach(function(item){
    str+=`<tr>
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>NT$${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>NT${item.quantity*item.product.price}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}">
            clear
        </a>
    </td>
  </tr>`
  total+=item.quantity*item.product.price;
  });
  cartList.innerHTML=str;
  totalPrice.textContent=`NT$${total}`;
}

//清除購物車
const discardAllBtn=document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click",function(e){
   deleteAllCartList();
})

// 清除購物車內全部產品
function deleteAllCartList() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
    then(function (response) {
      alert("全部購物車刪除成功");
      cartList.innerHTML="";
      totalPrice.textContent="NT$0";
    })
    .catch(function(response){
      alert("購物車已經清空");
    })
}


// 加入購物車
productList.addEventListener("click",function(e){
  const addCartClass=e.target.getAttribute("class");
  if(addCartClass=="addCardBtn"){
    e.preventDefault();
    const productId=e.target.getAttribute("data-id");
    addCartItem(productId);
  }
})

function addCartItem(id) {
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
    data: {
      "productId": id,
      "quantity": 1
    }
  }).
    then(function (response) {
      alert("選擇的商品已加入購物車");
      getCartList();
    })
}


// 刪除購物車內特定產品
cartList.addEventListener("click",function(e){
  if(e.target.getAttribute("class")=="material-icons"){
    e.preventDefault();
    deleteCartItem(e.target.getAttribute("data-id"));
  } 
})
function deleteCartItem(cartId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`).
    then(function (response) {
      alert("您選擇的商品已刪除");
      getCartList();
    })
}

// 送出購買訂單
const orderBtn=document.querySelector(".orderInfo-btn");
orderBtn.addEventListener("click",function(e){
  e.preventDefault();
  if(cartListData.length==0){
    alert("購物車內無商品");
    return;
  }
  const customerName=document.querySelector("#customerName").value;
  const customerPhone=document.querySelector("#customerPhone").value;
  const customerEmail=document.querySelector("#customerEmail").value;
  const customerAddress=document.querySelector("#customerAddress").value;
  const tradeWay=document.querySelector("#tradeWay").value;

  if(customerName==""||customerPhone==""||customerEmail==""||customerAddress==""||tradeWay==""){
    alert("請輸入訂單資訊");
    return;
  }
  axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
    {
      "data": {
        "user": {
          "name":customerName ,
          "tel": customerPhone,
          "email": customerEmail,
          "address": customerAddress,
          "payment": tradeWay
        }
      }
    }
  ).then(function (response) {
    alert("訂單建立成功");
    getCartList();
    document.querySelector("#customerName").value="";
    document.querySelector("#customerPhone").value="";
    document.querySelector("#customerEmail").value="";
    document.querySelector("#customerAddress").value="";
    document.querySelector("#tradeWay").value="ATM";
    })
    .catch(function(error){
      console.log(error.response.data);
    })
})








// 取得訂單列表
function getOrderList() {
  axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 修改訂單狀態

function editOrderList(orderId) {
  axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      "data": {
        "id": orderId,
        "paid": true
      }
    },
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除全部訂單
function deleteAllOrder() {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
  axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
    {
      headers: {
        'Authorization': token
      }
    })
    .then(function (response) {
      console.log(response.data);
    })
}







