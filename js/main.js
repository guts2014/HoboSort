function draw(){
	var canvas = document.getElementById('canvas');
	if(canvas.getContext){
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);
	}
}

$(document).ready(function () {
	draw();
});