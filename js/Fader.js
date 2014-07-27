function Fader( numOf, w , h ){

  this.geometry = this.createGeo( numOf , w , h);
  this.material = this.createMat();

  this.mesh = new THREE.Mesh( this.geometry , this.material );


}

Fader.prototype.setAmount = function( value ){

  this.material.amount.value = value;

}


Fader.prototype.createGeo = function( numOfSegments , w , h ){

  var geo = new THREE.BufferGeometry();

  var positions = new Float32Array( numOfSegments * 2 * 3 * 3 );
  var uvs = new Float32Array( numOfSegments * 2 * 3 * 2 );

  var pos = new THREE.BufferAttribute( positions , 3 ); 
  var uv = new THREE.BufferAttribute( uvs , 2 ); 

  geo.addAttribute( 'position' , pos );
  geo.addAttribute( 'uv' , uv );


  for( var i = 0; i < numOfSegments; i++ ){

    var t = numOfSegments
    var p =   (i / t);
    var pU = (( i+1 ) /t);


    var y   = p * h;
    var yU  = pU * h;
    var x   = -.5 * w;
    var xU  = .5 * w;

    var posI = i * 6;

    var uvI  = i * 4;


    positions[ posI + 0  ] = x;
    positions[ posI + 1  ] = y;
    positions[ posI + 2  ] = 0;

    positions[ posI + 3  ] = xU;
    positions[ posI + 4  ] = y;
    positions[ posI + 5  ] = 0;
    
    positions[ posI + 6  ] = xU;
    positions[ posI + 7  ] = yU;
    positions[ posI + 8  ] = 0;

    positions[ posI + 9  ] = xU;
    positions[ posI + 10 ] = yU;
    positions[ posI + 11 ] = 0;

    positions[ posI + 12 ] = x;
    positions[ posI + 13 ] = yU;
    positions[ posI + 14 ] = 0;
    
    positions[ posI + 15 ] = x;
    positions[ posI + 16 ] = y;
    positions[ posI + 17 ] = 0;


    uvs[ uvI + 0  ] = 0;
    uvs[ uvI + 1  ] = p;

    uvs[ uvI + 2  ] = 1;
    uvs[ uvI + 3  ] = p;

    uvs[ uvI + 4  ] = 1;
    uvs[ uvI + 5  ] = pU;

    uvs[ uvI + 6  ] = 1;
    uvs[ uvI + 7  ] = pU;

    uvs[ uvI + 8  ] = 0;
    uvs[ uvI + 9  ] = pU;

    uvs[ uvI + 10 ] = 0;
    uvs[ uvI + 11 ] = p;

  }

  return geo;

}

Fader.prototype.createMat = function(){

  var vertShader = [

    "varying vec2 vUv;",
    "void main(){",
    "  vUv = uv;",
    "  gl_Position = projectionMatrix * modelViewMatrix * vec4( position  , 1. ); ",
    "}"

  ].join("\n");

  var fragShader = [
    "uniform float amount;",
    "varying vec2 vUv;",
    "void main(){",
    "  vec4 c = vec4( 0. , 0. , 0. , 1. );", // color
    "  vec4 w = vec4( 1. );", // white
    "  if( vUv.y < amount ){",
    "    c = w;",
    "  }",
    "  if( vUv.y < .02 ){",
    "    c = w;",
    "  }",
    "  if( vUv.y > .98 ){",
    "    c = w;",
    "  }",
    "  if( vUv.x < .1 ){",
    "    c = w;",
    "  }",
    "  if( vUv.x > .9 ){",
    "    c = w;",
    "  }",
    "  gl_FragColor = c;",
    "}"
  ].join("\n");


  var amount = { type:"f" , value:0 }
  var uniforms = {
    amount:amount
  }

  var attributes = {

    position: { type:"v3" , value: null },
    uv: { type:"v2" , value: null },

  }

  console.log( vertShader );
  var material = new THREE.ShaderMaterial({

    attributes: attributes,
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    
    transparent: true

  });

  material.amount = amount;

  return material;


}
