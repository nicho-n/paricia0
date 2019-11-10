			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			var radius = 6371;
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
				textlabels = [];
				controls.dragToLook = false;
				dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( -1, 0, 1 ).normalize();
				scene.add( dirLight );
				var materialNormalMap = new THREE.MeshPhongMaterial( {
					specular: 0x333333,
					shininess: 15,
					map: textureLoader.load( "textures/planets/earth_atmos_2048.jpg" ),
					specularMap: textureLoader.load( "textures/planets/earth_specular_2048.jpg" ),
					normalMap: textureLoader.load( "textures/planets/earth_normal_2048.jpg" ),
					normalScale: new THREE.Vector2( 0.85, 0.85 )
				} );
				// planet
				geometry = new THREE.SphereGeometry( radius, 100, 50 );
				meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
				meshPlanet.rotation.y = 0;
				meshPlanet.rotation.z = tilt;
				scene.add( meshPlanet );
				// clouds
				var materialClouds = new THREE.MeshLambertMaterial( {
					map: textureLoader.load( "textures/planets/earth_clouds_1024.png" ),
					transparent: true
				} );
				meshClouds = new THREE.Mesh( geometry, materialClouds );
				meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
				meshClouds.rotation.z = tilt;
				scene.add( meshClouds );
				// moon
				var materialMoon = new THREE.MeshPhongMaterial( {
					map: textureLoader.load( "textures/planets/moon_1024.jpg" )
				} );
				meshMoon = new THREE.Mesh( geometry, materialMoon );
				meshMoon.position.set( radius * 5, 0, 0 );
				meshMoon.scale.set( moonScale, moonScale, moonScale );
				scene.add( meshMoon );
				
				// moon
				meshMoon2 = new THREE.Mesh( geometry, materialMoon );
				meshMoon2.position.set( radius * 2, 0, 0 );
				meshMoon2.scale.set( moonScale, moonScale, moonScale );
				scene.add( meshMoon2 );

				var text = _createTextLabel();
      			text.setHTML("Label 1");
      			text.setParent(meshPlanet);
      			this.textlabels.push(text);
      			this.container.appendChild(text.element);
				// stars
				var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];
				for ( i = 0; i < 15000; i ++ ) {
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

				var text = this._createTextLabel();
				text.setHTML("Earth");
				text.setParent(meshMoon);
				this.textlabels.push(text);
				this.container.appendChild(text.element);
		  
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
				for(var i=0; i<this.textlabels.length; i++) {
					this.textlabels[i].updatePosition();
				}

				// rotate the planet and clouds
				var delta = clock.getDelta();
				meshPlanet.rotation.y += rotationSpeed * delta;
				meshClouds.rotation.y += 1.25 * rotationSpeed * delta;
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
			function _createTextLabel() {
				var div = document.createElement('div');
				div.className = 'text-label';
				div.style.position = 'absolute';
				div.style.width = 100;
				div.style.height = 100;
				div.innerHTML = "hi there!";
				div.style.top = -1000;
				div.style.left = -1000;
				var _this = this;
				return {
				  element: div,
				  parent: false,
				  position: new THREE.Vector3(0,0,0),
				  setHTML: function(html) {
					this.element.innerHTML = html;
				  },
				  setParent: function(threejsobj) {
					this.parent = threejsobj;
				  },
				  updatePosition: function() {
					if(parent) {
					  this.position.copy(this.parent.position);
					}
					
					var coords2d = this.get2DCoords(this.position, _this.camera);
					this.element.style.left = coords2d.x + 'px';
					this.element.style.top = coords2d.y + 'px';
				  },
				  get2DCoords: function(position, camera) {
					var vector = position.project(camera);
					vector.x = (vector.x + 1)/2 * window.innerWidth;
					vector.y = -(vector.y - 1)/2 * window.innerHeight;
					return vector;
				  }
				};
			  }