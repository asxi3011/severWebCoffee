function renderList(listItem,name,id){
    return `
    <div class="d-flex gap-3 align-items-center mt-3 line-item-render">
   <input name="${name}" type="text" class="form-control" value="${listItem}"  disabled>
   <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${id}" name="select_Category[]">
   </div>
   <div class="btn btn-danger my-2" data-bs-toggle="modal" data-bs-target="#ModalDelete" data-idItemCategory="${id}">Xoá</div>
   <button type="button" class="btn btn-warning btn-edit-Item" value="${id}">Sửa</button>
   </div> `
  }
  function renderLine(index,name){
    return `<div class="mb-3 number-element-${index}">
      <label  class="form-label">Tên category con</label>
      <div class="d-flex gap-3 align-items-center">
      <input name="${name}" type="text" class="form-control input-child-category" required>
      <div  class="btn-remove-Categroy-line-${index} btn btn-danger rounded-circle fs-normal">X</div>
      </div >
    </div>`
  }
  function renderOptionSelect(data) {
    if(data != ""){
      if(Array.isArray(data)){
        var arrayHTML=[];
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
         background-color: #f14b4b;
     }
 </style>
  <div class="mb-3 d-flex align-items-center bg-danger img_empty">
        <div class="m-auto fw-bold fs-4 content_empty">
            Hiện tại chưa có dữ liệu
        </div>
 </div>
 `
  }
  function renderLineWithIcon(index,name,icon){
    return `        <div class="mb-3 number-element-${index}">
    <div class="d-flex gap-3 align-items-end">
            <div class="w-50">
            <label  class="form-label">Icon category</label>
                <input name="${icon}" type="text" class="form-control" required>
            </div>
          
            <div class="w-50">
            <label  class="form-label">Tên category</label>
            <input name="${name}" type="text" class="form-control" required>
            </div>
            <div  class="btn-remove-Categroy-line-${index} btn btn-danger rounded-circle fs-normal">X</div>
    </div>
</div>`
  }
  function renderItemSpecifications(index,nameTitle,nameDetail) {
    return `    
    <div class="d-flex gap-3 my-3 align-items-end  number-element-${index}">
            <div class="w-50">
            <label  class="form-label">Tiêu đề</label>
                <input name="${nameTitle}" type="text" class="form-control" required>
            </div>
          
            <div class="w-50">
            <label  class="form-label">Chi tiết</label>
            <input name="${nameDetail}" type="text" class="form-control" required>
            </div>
            <div  class="btn-remove-specification-line-${index} btn btn-danger rounded-circle fs-normal">X</div>
    </div>
`
  }
  function renderMoreColor(index) {
      return `<div class="color-file-${index} mb-3 d-flex align-items-center gap-3">  
      <div>
        <input name="name_color" type="text" placeholder="Màu" required>
      </div>
      <div>
         <input name="price_color" type="text" placeholder="Giá" required>
      </div>
      <div class="d-flex align-items-center gap-2">
        <span>Hình đính kèm: </span> 
        <span> <input class=" col-form-label" type="file" name="listImageDetails" required></span>
        <div  class="btn-remove-color-${index} btn btn-danger rounded-circle fs-normal">X</div>
      </div>
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