// Initialize WebGL renderer
const canvas = document.getElementById("mycanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor(0x000000);  // background color

// Create a new Three.js scene
const scene = new THREE.Scene();
// show global coordinate system
scene.add(new THREE.AxesHelper(8));

// Add a camera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 500);
camera.position.set(-3, 1, 12);
// // Add a mouse controller to move the camera

const ClockElements = new THREE.Group();
const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.zoomSpeed = 3.0;

// controls.rotateCamera ();


// Add light sources
scene.add(new THREE.AmbientLight(0xffffff));
const light = new THREE.PointLight();
light.position.set(10, 10, 10);
scene.add(light);


// all colors of the clock
const colors = {
  hands: 0x13004d,
  ClockFrame: 0xb2e2e7,
  ClockFace: 0xE5E5E5,
  Ticks: 0x000000,
  Blob: 0x5b0000,
  Background: 0x000000
};




//to draw the Frame of the Clock 
function drawClockFrame() {
  //size of Clock Frame
  const ClockFrameSize = {
    outerRadius: 4.75, // inner radius of the ring
    height: 1,
    innerRadius: 4.5
  };

  // Materials of Clock Frame 
  const materialClockFrame = new THREE.MeshStandardMaterial({
    color: colors.ClockFrame,
    metalness: 0.5,
    roughness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
  });

  const outerCircle = new THREE.Shape();
  outerCircle.moveTo(ClockFrameSize.outerRadius, 0);
  const innerCircle = new THREE.Shape();
  innerCircle.moveTo(ClockFrameSize.innerRadius, 0);
  const N = 800;

  const deltaPhi = 2 * Math.PI / N;
  for (let k = 1; k <= N; ++k) {
    outerCircle.lineTo(ClockFrameSize.outerRadius * Math.cos(k * deltaPhi),
      ClockFrameSize.outerRadius * Math.sin(k * deltaPhi));
    innerCircle.lineTo(ClockFrameSize.innerRadius * Math.cos(k * deltaPhi),
      ClockFrameSize.innerRadius * Math.sin(k * deltaPhi));
  }
  outerCircle.holes.push(innerCircle);

  const extrudeSettings = {
    bevelEnabled: false,
    depth: ClockFrameSize.height,
  };
  const extrudeGeo = new THREE.ExtrudeGeometry(outerCircle, extrudeSettings);
  const extrudeRing = new THREE.Mesh(extrudeGeo, materialClockFrame);
  ClockElements.add(extrudeRing);
}
drawClockFrame();



//to draw the Face of the Clock 
function drawClockFace() {
  const ClockFaceSize = {
    radiusTop: 4.51,
    height: 0.7,
    radiusBottom: 4.51,
    radialSegments: 100
  };
  const geometryClockFace = new THREE.CylinderBufferGeometry(
    ClockFaceSize.radiusTop, ClockFaceSize.radiusBottom, ClockFaceSize.height, ClockFaceSize.radialSegments);
  const materialClockFace = new THREE.MeshStandardMaterial({
    color: colors.ClockFace,
    metalness: 0.2,
    roughness: 0.5,
    flatShading: true,
    side: THREE.DoubleSide
  });

  const Cylinder = new THREE.Mesh(geometryClockFace, materialClockFace);
  Cylinder.rotation.x = Math.PI / 2
  Cylinder.position.z = 0.5;
  ClockElements.add(Cylinder);
}
drawClockFace();



function drawTicks(height, width, depth, colorTicks) {
  const TicksWidthSegments = 100;
  const geometrydrawTicks = new THREE.BoxBufferGeometry(width, height, depth, TicksWidthSegments);
  const materialdrawTicks = new THREE.MeshStandardMaterial({
    color: colorTicks,
    metalness: 0.5,
    roughness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
  });
  const tick = new THREE.Mesh(geometrydrawTicks, materialdrawTicks);
  return tick;
}

//to draw Bolb in center of the clock 
function drawBolb() {
  const BlobSize = {
    radius: 0.5,
    length: 2,
    capSegments: 50,
    radialSegments: 80
  };
  const geometryBlob = new THREE.CapsuleGeometry(BlobSize.radius, BlobSize.length, BlobSize.capSegments, BlobSize.radialSegments);
  const materialBlob = new THREE.MeshStandardMaterial({
    color: colors.Blob,
    metalness: 0.5,
    roughness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
  });
  const blob = new THREE.Mesh(geometryBlob, materialBlob);
  blob.rotation.x = Math.PI / 2
  blob.position.set(0, 0, 0.5);
  blob.scale.set(0.5, 0.32, 0.5);
  ClockElements.add(blob);

}
drawBolb();

const TicksDistanceFrame = {
  Small: 4.21,
  Big: 3.92
};

const BigTicksSize = {
  x: 1.05,
  y: 0.15,
  z: 0.8
};

const SmallTicksSize = {
  x: 0.5,
  y: 0.065,
  z: 0.8
};

//to draw the hours Ticks
function addBigTicks() {
  //draw Big Ticks 12 times
  for (let i = 0; i < 12; i++) {
    let BigTickscolor;
    if (i == 0) {
      //paints Big Ticks at 12 hour  with ClockFrame color and othres in black
      BigTickscolor = colors.ClockFrame;
    } else if (i != 0) {
      BigTickscolor = colors.Ticks;
    }
    let BigTicks = drawTicks(BigTicksSize.x, BigTicksSize.y, BigTicksSize.z, BigTickscolor);
    let BigTicksAngle = i / 12 * Math.PI * 2;
    BigTicks.rotation.z = -BigTicksAngle;
    BigTicks.position.set(Math.sin(BigTicksAngle) * TicksDistanceFrame.Big, Math.cos(BigTicksAngle) * TicksDistanceFrame.Big, 0.5);
    ClockElements.add(BigTicks);
  }
}

//to draw the minutes Ticks
function addSmallTicks() {
  for (let i = 0; i < 60; i++) {
    // to skip drawing on hours ticks place
    if (i % 5 != 0) {
      let SmallTicks = drawTicks(SmallTicksSize.x, SmallTicksSize.y, SmallTicksSize.z, colors.Ticks);

      let SmallTicksAngle = i / 60 * Math.PI * 2;
      SmallTicks.rotation.z = -SmallTicksAngle;

      SmallTicks.position.set(Math.sin(SmallTicksAngle) * TicksDistanceFrame.Small, Math.cos(SmallTicksAngle) * TicksDistanceFrame.Small, 0.5);
      ClockElements.add(SmallTicks);
    }
  }
}
addBigTicks();
addSmallTicks();






const handsMish = {
  handMaterial: new THREE.MeshStandardMaterial({
    color: colors.hands,
    metalness: 0.5,
    roughness: 0.1,
    flatShading: true,
    side: THREE.DoubleSide
  }),
  hourhandGeometry: new THREE.SphereGeometry(2, 32, 16),
  minuteshandGeometry: new THREE.SphereGeometry(3.9, 32, 16)
};


const secondsLinesSize = {
  x: 4,
  y: 0.05,
  z: 0.05
};

//clock 1
// draw  second Line of clock 1
const secondsLine = drawTicks(secondsLinesSize.x, secondsLinesSize.y, secondsLinesSize.z, colors.hands);
ClockElements.add(secondsLine);

// draw  hour hand of clock 1
const hourhand1 = new THREE.Mesh(handsMish.hourhandGeometry, handsMish.handMaterial);
hourhand1.scale.set(.04, .04, .4, 1);
ClockElements.add(hourhand1);

// draw  minutes hand of clock 1
const minuteshand1 = new THREE.Mesh(handsMish.minuteshandGeometry, handsMish.handMaterial);
minuteshand1.scale.set(.03, .02, .5, 1);
ClockElements.add(minuteshand1);


const DistanceHandsofAxis = {
  R: 1.9,
  zClock1: 0.9,
  zClock2: 0.1
};

//to move hands of clock 1
function moveClock1() {
  let data = new Date();
  // to move second Line of clock 1
  let hourAngle = (data.getHours() + data.getMinutes() / 60) / 12 * Math.PI * 2;
  hourhand1.rotation.x = Math.PI / 2;
  hourhand1.rotation.y = -(hourAngle);
  hourhand1.position.set(Math.sin(hourAngle), Math.cos(hourAngle), DistanceHandsofAxis.zClock1);

  // to move minutes hand of clock 1
  let minutesAngle = data.getMinutes() / 60 * Math.PI * 2;
  minuteshand1.rotation.x = Math.PI / 2;
  minuteshand1.rotation.y = -minutesAngle;
  minuteshand1.position.set(Math.sin(minutesAngle) * DistanceHandsofAxis.R, Math.cos(minutesAngle) * DistanceHandsofAxis.R, DistanceHandsofAxis.zClock1);

  // to move hour hand of clock 1
  let secondsAngle = data.getSeconds() / 60 * Math.PI * 2;
  secondsLine.rotation.z = -secondsAngle;
  secondsLine.position.set(Math.sin(secondsAngle) * DistanceHandsofAxis.R, Math.cos(secondsAngle) * DistanceHandsofAxis.R, DistanceHandsofAxis.zClock1);
}

//clock 2
// draw  second Line of clock 2
const secondsLine2 =drawTicks(secondsLinesSize.x, secondsLinesSize.y, secondsLinesSize.z, colors.hands);
ClockElements.add(secondsLine2);

// draw  hour hand of clock 2
const hourhand2 = new THREE.Mesh(handsMish.hourhandGeometry, handsMish.handMaterial);
hourhand2.scale.set(.04, .04, .5, 1);
ClockElements.add(hourhand2);

// draw  minutes hand of clock 2
const minuteshand2 = new THREE.Mesh(handsMish.minuteshandGeometry, handsMish.handMaterial);
minuteshand2.scale.set(.03, .02, .5, 1);
ClockElements.add(minuteshand2);

//to move hands of clock 2 with favourite Place Time=2 hours
function moveClock2(favouritePlaceTime) {
  let data = new Date();
  // to move hour hand of clock 2
  let hourAngle2 = -(data.getHours() + favouritePlaceTime + data.getMinutes() / 60) / 12 * Math.PI * 2;
  hourhand2.rotation.x = Math.PI / 2;
  hourhand2.rotation.y = -(hourAngle2);
  hourhand2.position.set(Math.sin(hourAngle2), Math.cos(hourAngle2), DistanceHandsofAxis.zClock2);

  // to move minutes hand of clock 2
  let minutesAngle2 = -data.getMinutes() / 60 * Math.PI * 2;
  minuteshand2.rotation.x = Math.PI / 2;
  minuteshand2.rotation.y = -minutesAngle2;
  minuteshand2.position.set(Math.sin(minutesAngle2) * DistanceHandsofAxis.R, Math.cos(minutesAngle2) * DistanceHandsofAxis.R, DistanceHandsofAxis.zClock2);

  // to move second Line of clock 2
  let secondsAngle2 = -data.getSeconds() / 60 * Math.PI * 2;
  secondsLine2.rotation.z = -secondsAngle2;
  secondsLine2.position.set(Math.sin(secondsAngle2) *DistanceHandsofAxis.R, Math.cos(secondsAngle2) * DistanceHandsofAxis.R, DistanceHandsofAxis.zClock2);
}


//to rotate with Euler function
function rotateClock() {
  const a = 2 * Math.PI;
  //x:  red, y: green,   z: blue
  const eu = new THREE.Euler(0, a, 0, "XYZ");
  const m = new THREE.Matrix4();
  m.makeRotationFromEuler(eu);
  ClockElements.rotation.copy(eu);
  scene.add(ClockElements);
}
rotateClock();



// Render the scene
function render() {
  requestAnimationFrame(render);

  moveClock1();
  moveClock2(2);
  controls.update();
  renderer.render(scene, camera);
}
render();
