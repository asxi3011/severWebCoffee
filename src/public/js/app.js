function renderList(listItem,name){
    return `
    <div class="d-flex gap-3 align-items-center mt-3">
   <input name="${name}" type="text" class="form-control" value=${listItem} disabled>
   <div class="btn btn-danger">Xoá</div>
   <div class="btn btn-warning">Sửa</div>
   </div> `
  }
  function renderLine(index,name){
    return `<div class="mb-3 number-element-${index}">
      <label  class="form-label">Tên category con</label>
      <div class="d-flex gap-3 align-items-center">
      <input name="${name}" type="text" class="form-control" required>
      <div  class="btn-remove-Categroy-line-${index} btn btn-danger rounded-circle fs-normal">X</div>
      </div >
    </div>`
  }
  function renderLineWithIcon(index,name,icon){
    return `<div class="mb-3 number-element-${index}">
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
  function toggleDisabledWithLength(conditionsLength,btnDisable){
     if(conditionsLength<=0){
        btnDisable.attr('disabled','disabled')
     }
     else{
        btnDisable.removeAttr('disabled','disabled')
     }
  }
  function checkboxValidation(ChkAll,checkboxName,ChkItem,btnDisabled){
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