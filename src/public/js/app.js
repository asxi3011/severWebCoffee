function renderList(number,listItem,id){
   return `
    <tr class="row-table-product ">
      <td class="">${number}</td>
      <td class="">${listItem}</td>
      <td class="">
         <input class="form-check-input" type="checkbox" value="${id}" name="select_Category[]">
      </td>
      <td>
        <div  class="d-flex justify-content-evenly align-items-center">
        <div class="btn btn-dark-custom my-2" data-bs-toggle="modal" data-bs-target="#ModalDelete" data-idItemCategory="${id}">Xoá</div>
        <button type="button" class="btn btn-blue-custom btn-edit-Item" value="${id}">Sửa</button>
        </div>
        </td>
    </tr>
    `
  }
  function renderOptionSelect(data) {
    if(data != ""){
      if(Array.isArray(data)){
        var arrayHTML=[];
        arrayHTML.push(`<option value="">-Item Category-</option>`)
        data.forEach(element=> {
          arrayHTML.push(`<option value="${element.id}">${element.name}</option>`)
        })
        return arrayHTML;
      }
    }
    else{
      return ``;
    }
  }
  function empty(){
     return `<style>
     .img_empty{
        background-image: url("https://cdn.dribbble.com/users/150039/screenshots/15043316/media/d66c51a81f504f0b605cdc0fb37a0da5.png?compress=1&resize=1600x1200");
         height: 200px;
         width: 100%;
         border-radius: 8px;
         background-size: contain;
     }
     .content_empty{
         border-radius: 8px;
         padding: 8px 20px;
         background-color: #fb8f19;
         color:white;
     }
 </style>
  <div class="mb-3 d-flex align-items-center bg-danger img_empty">
        <div class="m-auto fw-bold fs-5 content_empty">
            Trống
        </div>
 </div>
 `
  }
  function renderCategroy(name,image){
    return `       
    <div class="d-flex gap-3 align-items-end mb-3">

            <div class="w-50">
            <label  class="form-label text-dark">Tên category</label>
            <input name="${name}[]" type="text" class="form-control" required>
            </div>
            <div class="w-50">
            <label  class="form-label">Hình category</label>
                <input name="${image}" type="file" accept="image/*" class="form-control" required>
            </div>
            <div  class="btn-remove-Categroy btn btn-danger rounded-circle fs-normal">X</div>
</div>`
  }
  function renderSize(nameTitle,nameDetail) {
    return `    
    <div class="d-flex gap-3 my-3 align-items-end">
            <div class="w-50">
            <label  class="form-label">Size</label>
                <input name="${nameTitle}" type="text" class="form-control" required>
            </div>
          
            <div class="w-50">
            <label  class="form-label">Cộng thêm</label>
            <input name="${nameDetail}" type="text" class="form-control" required>
            </div>
            <div  class="btn-remove-size btn btn-danger rounded-circle fs-normal">X</div>
    </div>
`
  }
  function renderTableListProduct(number,nameProduct,img,price,status,id) {
    return `
    <tr class="row-table-product ">
      <td class="text-center">${number}</td>
      <td class="text-center">${nameProduct}</td>
      <td class="image-table-product text-center"><img src="/uploads/${img}" alt=""></td>
      <td class="text-center">${price}</td>
      <td class="text-center">${status}</td>
      <td>
        <div  class="d-flex justify-content-evenly align-items-center">
            <div class="btn btn-dark-custom my-2" data-bs-toggle="modal" data-bs-target="#ModalDelete" data-idItemCategory="${id}">Xoá</div>
            <button type="button" class="btn editor-edit btn-blue-custom btn-edit-Item" value="${id}">Sửa</button>
        </div>
      </td>
    </tr>
    `
  }
  function renderTableProduct(HTMLrowTable) {
    return `
    <table id="table_product" class="ui celled table table-text-form-100">
    <thead>
        <tr>
        <th class="text-center">STT</th>
        <th class="text-center">Tên sản phẩm</th>
        <th class="text-center">Hình đại diện</th>
        <th class="text-center">Giá Tiêu Chuẩn</th>
        <th class="text-center">Trạng thái</th>   
        <th class="text-center">Chức năng</th>
        </tr>
    </thead>
    ${HTMLrowTable}
    </table>
    `
    
  }
  function renderListProduct(nameProduct,sizeProduct,quanity,note,Price,index){
    return`
    <div class="col-12">
    <div class="line-product d-flex align-items-center gap-2 my-2">
        <div class="btn btn-edit-product-cart" index="${index}">
            <i class="fas fa-pen color-primary"></i>
        </div>
        <div class="flex-grow-1">
            <div class="fw-bold">
            ${quanity} x ${nameProduct}
            </div>
            <div>
                Size : ${sizeProduct}
            </div>
            <div>
                  ${note}
            </div>
            <div class="btn-delte-product-cart d-inline-block" index="${index}">
              Xóa
            </div>
        </div>
        <div>
            ${formatter.format(parseInt(Price))}
        </div>
    </div>
    </div>`;
  }

  function renderModalProduct(name,description,price,quanity,size,img,note,id){
    var a = "";
    size.forEach(function(element){
      a = a+`<div class="d-flex align-items-center gap-3">
      <input class="form-check-input rad-primary" type="radio" name="sizePrice" id="${element.name}" value="${element.value}">
      <div>
          <label class="d-block" for="${element.name}">${element.name}</label>
          <label class="d-block price-size-show" for="${element.name}">${element.value}</label>
          <label class="price-size" hidden>${element.value}</label>
      </div>
      </div>
      `
    })   
    return `<div class="text-center fw-bold fs-6 my-3">
          Sản phẩm
      </div>
      <div class="d-flex gap-3 align-items-center">
          <img class="img-cart-modal" src="/uploads/${img}" alt="">
          <div class="d-flex flex-grow-1 flex-column gap-3">
              <div id="name_product" class="fw-bold">${name}</div>
              <div>
                ${description}
              </div>
              <div class="d-flex justify-content-between align-items-center">
                  <div id="details-price-product" class="">${price}</div>
                  <div class="quanity-product">
                                      <button id="btn_down" type="button" class="btn btn-circle-primary btn-circle-disable mx-2"><i class="fas fa-minus text-white"></i></button>
                                      <span class="mx-2" name="test" id="lbl_quanity">${quanity}</span>
                                      <button type="button" id="btn_up" class="mx-2 btn btn-circle-primary"><i class="fas fa-plus text-white"></i></button>
                  </div> 
              </div>
          </div>
      </div>
      <div class="input-group my-3">
                                      <div class="input-group-prepend">
                                      <div class="input-group-text"><i class="fas fa-sticky-note fs-4 text-secondary"></i></div>
                                      </div>
                                      <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Ghi chú cho món tại đây" value="${note}">
          </div>
          <div class="mt-4 bd-size">
                                  <div class="bg-border ">Chọn size (BẮT BUỘC)</div>
                                  <div class=""> 
                                      <div class="d-flex justify-content-evenly p-2">`+
                                     
                                      a                                   
                                    +`
                                      </div>
                                  </div>
          </div>
      <div class="text-center my-3">
          <button type="submit" class="btn btn-color-primary w-100 mt-4" id="btn_addToCart">
                                  <span id="price_Total" hidden>${price}</span>
                                  <span id="price_Total_show">${price}</span> - Thêm vào giỏ hàng
                              </button>
                              <input id="id_product" name="id_product" type="hidden" value="${id}">
      </div>`
  }

  function toggleDisabledWithLength(conditionsLength,btnDisable){
     if(conditionsLength<=0){
        btnDisable.attr('disabled','disabled')
     }
     else{
        btnDisable.removeAttr('disabled','disabled')
     }
  }
 
  function checkboxValidation(ChkAll,checkboxName,ChkItem,btnDisabled   ){
   // event check box all
      
      ChkAll.change(function(){
      var isChecked = $(this).prop('checked');
      ChkItem.prop('checked',isChecked);
      var lengthChkChecked = $(`input[name="${checkboxName}"]:checked`).length;
      toggleDisabledWithLength(lengthChkChecked,btnDisabled);
      })
      // event Child check box
      ChkItem.change(function(){
      var lengthChkChecked = $(`input[name="${checkboxName}"]:checked`).length;
      var isCheckAll = ChkItem.length === lengthChkChecked;
      ChkAll.prop('checked',isCheckAll);
      toggleDisabledWithLength(lengthChkChecked,btnDisabled);
      })
           
}
function countQuanity(){
  var listProduct = JSON.parse(sessionStorage.arrayCart);
  return listProduct.reduce(function(total,product){
      return total+product.quanityProduct;
  },0)
}
function showCountCart(){
  if(parseInt(sessionStorage.countQuanity)>0){
    $("#soLuong_Cart").text(parseInt(sessionStorage.countQuanity));
    $(".quantities-cart").removeClass("d-none");
  }
  else{
    $(".quantities-cart").addClass("d-none");
  } 
}
   
var formatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'VND',

});
