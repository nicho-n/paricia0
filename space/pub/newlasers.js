var raycaster = new THREE.Raycaster(); 
var mouse = new THREE.Vector2();
var beamLength = 100;
var laserVelocity = -2;
var laserRadius = 2;
var lasers = [];
var maxLaserDist = -6000; // distance before laser disappears
var laserGeom = new THREE.CylinderGeometry(laserRadius,laserRadius,beamLength, 4);
laserGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, beamLength/2, 0));
laserGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
var laserMat = new THREE.MeshPhongMaterial({
	ambient : 0,
        emissive : 0xff0000,
        color : 0xff0000,
        specular : 0x101010,
	shininess: 20
});
//var laser = new THREE.Mesh(laserGeom, laserMat);



class Laser{

	contructor(origin, direction){
		this.origin = origin;
		this.direction = direction;
	}

	go(){
		var laser = new THREE.Mesh(laserGeom, laserMat);
		raycaster.setFromCamera(mouse, camera);
		laser.direction = raycaster.ray.direction;
		laser.lookAt(raycaster.ray.direction);
		laser.time = 0;
		laser.position.copy(playerInfo.position);
		laser.position.z -= 200;
		lasers.push(laser);
		scene.add(laser);

	}

	kill(){
		lasers.shift();
	}


}

function onMouseMove(event) {
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1.15;
}


        window.addEventListener('mousemove', onMouseMove, false);

