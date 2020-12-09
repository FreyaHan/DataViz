let wall;
let star;
let cloud2;
let cloud1;
let cloudM;
let text;
let dataGra;
let video;
let poseNet;
let poses = [];
let faceX, faceY, faceS;
let ease = 0.3;
let starNum = 8; //67
let sky = [];
let moonX;

function preload() {
  wall = loadImage('wall.png');
  star = loadImage('star.png');
  cloud1 = loadImage('cloud1.png');
  cloud2 = loadImage('cloud2.png');
  cloudM = loadImage('cloudM.png');
  text = loadImage('touchscreen.png');
}

function setup() {
  createCanvas(1439, 702);

  //set up camera
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  //set up poseNet
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', poseDetected);
  faceX = width / 2;
  faceY = height / 2;

  // create graphics
  dataGra = createGraphics(windowWidth, windowHeight);
  
    overAllTexture = createGraphics(windowWidth, windowHeight);
  overAllTexture.loadPixels();
  for (let i = 0; i < width + 250; i++) {
    for (let o = 0; o < height + 250; o++) {
      overAllTexture.set(i, o, color(150, noise(i / 3, o / 3, i * o / 50) * random([0, 50, 100])));
    }
  }
  overAllTexture.updatePixels();

}

function draw() {
  // background(0);
  	
  dataGra.push();

  // data context
  // draw sky
  dataGra.push();
  let stColor = color('#0D1339');
  let edColor = color(8, 67, 161);
  dataGra.noStroke();
  randomSeed(1);
  for (let i = 0; i <= width + 250; i += 10) {
    for (let o = 0; o <= height; o += 10) {
      dataGra.fill(lerpColor(stColor, edColor, (i / 2 + o / 2) / height));
      dataGra.ellipse(i + random(-5, 5), o + random(-5, 5), 30, 30);
    }
  }
  dataGra.pop();

  dataGra.push();
  dataGra.drawingContext.shadowColor = color(0, 0, 0, 150);
	dataGra.drawingContext.shadowBlur = width / 25;
  // dataGra.drawingContext.shadowOffsetY = -5;
  
  // draw moon
  let moonX = map ( faceX, 0, width/2, 450,350);
  moon(moonX,200,dataGra);
  // draw cloud besides moon
  let cloudMX = map (faceX,0,width/2, 400,300)
  dataGra.image(cloudM,cloudMX,220,108,52);
  
  // draw interaction hint
  dataGra.push();
  let textA = map (faceX, 50, width/2,255,0);
  dataGra.tint(255,textA);
  dataGra.image(text,190,180,189,86);
dataGra.pop();
  
  //draw stars
  randomSeed(2);
 for ( let i= 0; i< starNum; i++){
  dataGra.image(star,random(width/2-250,width/2+250), random(150,280), random(8,13),random(8,13));
}
    // draw right side clouds
  let cloud2Y = map (faceX,width/2,width, 70,110);
  dataGra.image(cloud2, width-400,cloud2Y, 300,240);
  
   let cloud1Y = map (faceX,width/2,width, -100,40);
  dataGra.image(cloud1, width-600,cloud1Y, 330,264);
  dataGra.pop();

    //draw waves
  dataGra.push();
  dataGra.drawingContext.shadowColor = color(0, 0, 0, 50);
	dataGra.drawingContext.shadowBlur = width / 25;
  dataGra.drawingContext.shadowOffsetY = -5;

  let stColor1 = color(3, 58, 144);
  let edColor1 = color(193, 223, 244);
  for (let o = 0; o < 10; o++) {
    dataGra.noStroke();
    let midColor = lerpColor(stColor1, edColor1, o / 10);

    dataGra.push();
    dataGra.translate(0, o * height / 15 + 340);
    dataGra.fill(midColor);
    dataGra.beginShape();
    dataGra.vertex(0, 350);
    for (let i = -100; i < width + 250; i += 2) {
      let xx = i;
      let yy = sin(i / (30 + noise(o + frameCount / 150) * 100) + o + cos(o + frameCount / 150)) * 20;
      dataGra.vertex(xx, yy);
    }
    dataGra.vertex(width, 400);
    dataGra.endShape(CLOSE);
    dataGra.pop();
  }
  
  dataGra.pop();

 
dataGra.push();
   dataGra.drawingContext.shadowColor = color(0, 0, 0, 80);
	dataGra.drawingContext.shadowBlur =  10;
  dataGra.drawingContext.shadowOffsetY = -5;
  dataGra.drawingContext.shadowOffsetY = -5;
  //draw boat-male
  randomSeed(35); //35
  for (let k = 0; k < 27; k++) {
    let bx = random(50, width - 50) + noise(k + frameCount / 100) * 40;
    let by = random(350, height - 120) + noise(k + frameCount / 100) * 50;
    boat(bx, by, dataGra);
  }

  //draw boat female
  randomSeed(12); //8
  for (let k = 0; k < 1; k++) {
    let bxf = random(250, width - 150) + noise(k + frameCount / 100) * 40;
    let byf = random(500, height - 120) + noise(k + frameCount / 100) * 50;
    boatf(bxf, byf, dataGra);
  }
  dataGra.pop();
  
   // draw texture
  dataGra.push();
  dataGra.blendMode(MULTIPLY);
  dataGra.image(overAllTexture, 0, 0, width , height);
  dataGra.pop();


  // detect face position
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    faceX += (pose.nose.x - faceX) * ease;
    faceY += (pose.nose.y - faceY) * ease;
    faceS = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y);
  }
  
  print ('facex'+faceX);

  //composite mask
  let dataGraXpos = map(faceX, width / 2 - 200, width / 2 + 200, 100, -100);

  
  image(dataGra, dataGraXpos, 0, width, height);
  // tint(255,128);
  image(wall, 0, 0, width, height);

 

}


function boat(x, y, p) {
  p.push();
  p.translate(x, y);
  p.scale(0.5 * pow(y / 700, 2));
  // p.rotate(PI / 10);
  p.push();
  p.noStroke();
  p.fill(247, 247, 249);
  p.quad(-75, -66, 34, -26, 0, 0, -33, 0);
  p.triangle(24, -103, 66, -47, 34, -26);
  p.triangle(34, -26, 137, -93, 99, 0);
  p.fill(165, 165, 165);
  p.triangle(56, -61, 137, -93, 66, -47);
  p.triangle(-75, -66, 2, -57, -6, -41);
  p.fill(199, 200, 202);
  p.triangle(24, -103, 34, -26, -6, -41);
  p.triangle(34, -26, 99, 0, 0, 0);
  p.pop();
  p.pop();
}

function boatf(x, y, p) {
  p.push();
  p.translate(x, y);
  p.scale(0.3 * pow(y / 700, 2));
  p.push();
  p.noStroke();
  p.fill(249, 199, 79);
  p.quad(-75, -66, 34, -26, 0, 0, -33, 0);
  p.triangle(24, -103, 66, -47, 34, -26);
  p.triangle(34, -26, 137, -93, 99, 0);
  p.fill(243, 114, 44);
  p.triangle(56, -61, 137, -93, 66, -47);
  p.triangle(-75, -66, 2, -57, -6, -41);
  p.fill(248, 150, 30);
  p.triangle(24, -103, 34, -26, -6, -41);
  p.triangle(34, -26, 99, 0, 0, 0);
  p.pop();
  p.pop();
}

function moon(x,y,p) {
  p.push();
  p.noStroke();
  p.fill(255, 230, 109, 250);
  let moonR = 120;
  p.ellipse(x,y, moonR, moonR);
  // p.fill(8, 67, 161);
  // p.ellipse(moonX * 1.02, moonY * 0.9, moonR * 0.9, moonR * 0.9);
  // p.blendMode(SCREEN);
  p.pop();
}

//ml5 pose detection
function poseDetected(results) {
  poses = results;
}
