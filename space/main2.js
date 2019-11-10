			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
                        var radius = 6371;
                        var spheres = [];
                        var clouds = [];
			var tilt = 0.41;
			var rotationSpeed = 0.02;
			var cloudsScale = 1.005;
			var moonScale = 0.23;
			var MARGIN = 0;
			var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
			var SCREEN_WIDTH  = window.innerWidth;
			var container, stats, pos;
			var camera, controls, scene, renderer;
			var geometry, meshPlanet, meshClouds, meshMoon, meshMoon2;
			var dirLight, pointLight, ambientLight;
			var composer;
			var textureLoader = new THREE.TextureLoader();
			var d, dPlanet, dMoon, dMoonVec = new THREE.Vector3();
			var clock = new THREE.Clock();
			init();
			animate();
			function init() {
			         function drawMoon(geometry, moonScale, radius, x, y, z){
					var materialMoon = new THREE.MeshLambertMaterial( {
						map: textureLoader.load( "textures/planets/moon_1024.jpg" )
					} );
					meshMoon = new THREE.Mesh( geometry, materialMoon );
					meshMoon.position.set(x, y, z );
					meshMoon.scale.set( moonScale, moonScale, moonScale );
				        scene.add( meshMoon );
				        spheres.push(meshMoon);
				}

			        function drawPlanet(radius, widthSegments, heightSegments, materialNormalMap, scene, texture, x, y, z){
					geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
					meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
					meshPlanet.rotation.y = 0;
				        meshPlanet.rotation.z = tilt;
				        meshPlanet.position.set(x, y, z);
					scene.add( meshPlanet );
                                        spheres.push(meshPlanet);    
					var materialClouds = new THREE.MeshLambertMaterial( {
						map: textureLoader.load( texture ),
						transparent: true
					} );
					meshClouds = new THREE.Mesh( geometry, materialClouds );
					meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
				        meshClouds.rotation.z = tilt;
				        meshClouds.position.set(x, y, z);
				        scene.add( meshClouds );
				        clouds.push( meshClouds);
		                }
 

				container = document.createElement( 'div' );
				pos = document.getElementById("pos");
				document.body.appendChild( container );
				camera = new THREE.PerspectiveCamera( 25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
				camera.position.z = radius * 5;
				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );
				controls = new THREE.FlyControls( camera );
				controls.movementSpeed = 1000;
				controls.domElement = container;
				controls.rollSpeed = Math.PI / 24;
				controls.autoForward = false;
				controls.dragToLook = false;
 				dirLight = new THREE.DirectionalLight( 0xffffff );
          			dirLight.position.set( -1, 0, 1 ).normalize();
			        scene.add(dirLight);
				
				
				var materialNormalMap = new THREE.MeshPhongMaterial( {
					specular: 0x333333,
					shininess: 15,
					map: textureLoader.load( "textures/planets/earth_atmos_2048.jpg" ),
					specularMap: textureLoader.load( "textures/planets/earth_specular_2048.jpg" ),
				        normalMap: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ), 
					normalScale: new THREE.Vector2( 0.85, 0.85 )
				} );
			        var materialSunMap = new THREE.MeshPhongMaterial( {
					specular: 0x333333,
					shininess: 15,
					map: textureLoader.load( "textures/planets/suntexture.jpg" ),
					specularMap: textureLoader.load( "textures/planets/suntexture.jpg" ),
				        normalMap: textureLoader.load( "textures/planets/suntexture.jpg" ), 
					normalScale: new THREE.Vector2( 0.85, 0.85 )
				} );
			        drawPlanet(radius, 100, 50, materialNormalMap, scene, "textures/planets/earth_clouds_1024.png", 0, 0, 0);
			        drawMoon(geometry, moonScale, radius, 150000, 5000, 5000);
			        //drawMoon(geometry, moonScale, radius, -644354, 127530, 41859);
			        drawPlanet(radius*50, 100, 50, materialSunMap, scene, "textures/planets/suntexture.jpg", -32737, 7737, -44147);

				// stars
				var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
				for ( i = 0; i < 1500; i ++ ) {
					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );
					starsGeometry[ 0 ].vertices.push( vertex );
				}
				for ( i = 0; i < 15000; i ++ ) {
					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );
					starsGeometry[ 1 ].vertices.push( vertex );
				}
				var stars;
				var starsMaterials = [
					new THREE.PointsMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
					new THREE.PointsMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
				        new THREE.PointsMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
				];
				for ( i = 10; i < 30; i ++ ) {
					stars = new THREE.Points( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
					stars.rotation.x = Math.random() * 6;
					stars.rotation.y = Math.random() * 6;
					stars.rotation.z = Math.random() * 6;
					stars.scale.setScalar( i * 10 );
					stars.matrixAutoUpdate = false;
					stars.updateMatrix();
					scene.add( stars );
				}
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				container.appendChild( renderer.domElement );
				stats = new Stats();
				container.appendChild( stats.dom );
				window.addEventListener( 'resize', onWindowResize, false );
				// postprocessing
				var renderModel = new THREE.RenderPass( scene, camera );
				var effectFilm = new THREE.FilmPass( 0.35, 0.75, 2048, false );
				effectFilm.renderToScreen = true;
				composer = new THREE.EffectComposer( renderer );
				composer.addPass( renderModel );
				composer.addPass( effectFilm );
			}
			
			function onWindowResize( event ) {
				SCREEN_HEIGHT = window.innerHeight;
				SCREEN_WIDTH  = window.innerWidth;
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();
				composer.reset();
			}
			function animate() {
				requestAnimationFrame( animate );
				render();
				stats.update();
			}
			function render() {
				// rotate the planet and clouds
			    var delta = clock.getDelta();
			    var i;

			    for (i = 0; i < spheres.length; i++){
				spheres[i].rotation.y += rotationSpeed * delta;
		            }

			    for (i = 0; i < clouds.length; i++){
				clouds[i].rotation.y += 1.25 * rotationSpeed * delta;
			    }
				// slow down as we approach the surface
				dPlanet = camera.position.length();
				dMoonVec.subVectors( camera.position, meshMoon.position );
				dMoon = dMoonVec.length();
				if ( dMoon < dPlanet ) {
					d = ( dMoon - radius * moonScale * 1.01 );
				} else {
					d = ( dPlanet - radius * 1.01 );
				}
				controls.movementSpeed = 0.33 * d;
				controls.update( delta );
				composer.render( delta );
				pos.innerHTML = camera.position.x + "," + camera.position.y + "," + camera.position.z;
			}
