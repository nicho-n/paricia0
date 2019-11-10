var canvas = document.getElementById("minimap");
if (canvas.getContext) {
	var ctx = canvas.getContext("2d");
	ctx.strokeStyle = "white";
	ctx.lineWidth = 0.3;
	var r = 10;
	var x_center = canvas.width/2;
	var y_center = canvas.height/2;
	ctx.beginPath();
  	
        angle = (2/3)*(2*Math.PI);
	ctx.moveTo((r * Math.cos(angle) + x_center), (r * Math.sin(angle) + y_center));


	var angle = (1/3)*(2*Math.PI);
	var x = r*Math.cos(angle) + x_center;
	var y = r*Math.sin(angle) + y_center;

        //ctx.lineTo(x, y);

	angle = 0;
        x = r*Math.cos(angle) + x_center;
        y = r*Math.sin(angle) + y_center;


	//ctx.moveTo((radius * cos(0) + x_center), (radius * sin(0) + y_center));
	ctx.lineTo(x, y);
	//ctx.lineTo(((radius * cos((2./3)*(2*MATH.PI)) + x_center), (r*sin((2./3)*(2*MATH.PI)) + y_center));
	ctx.closePath();
	ctx.stroke();
}


