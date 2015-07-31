/*Created 2015-07-31  by Rajbir Karan Singh*/
function init(e){
    $('<div class="modal-backdrop custom_backdrop"><img src="http://kodekloud.s3.amazonaws.com/sites/554a79236e6f64713f000000/69e8cd982124dc73de1f5a67a627ee75/loading.gif" class="" alt=""></div>').appendTo(document.body);
}
function show_content(){
    $('.yield').fadeIn();
    $(".modal-backdrop").remove();
}