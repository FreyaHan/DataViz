//mask reference https://www.openprocessing.org/sketch/907457

let maskGra;
let dataGra;
let mixGra;
let fanshapeMargin = 150;
let maskM = 100;
let starNum = 67;
let sky = [];
let moonX;
let video;
let poseNet;
let poses = [];
let faceX, faceY, faceS;
let ease=0.3;
let wall; 

function preload() {
  wall = loadImage('wall.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //set up camera
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  //set up poseNet
  poseNet = ml5.poseNet(video);
  poseNet.on('pose', poseDetected);
  faceX = width/2;
  faceY = height/2;
  
  // fill(221,226,229);
  // noStroke();
  // rect(0,0,width,height);

  // load wall image

  image(wall,0,0,width, height);



  

  //create graphics
  maskGra = createGraphics(windowWidth, windowHeight);
  dataGra = createGraphics(windowWidth, windowHeight);
  mixGra = createImage(windowWidth, windowHeight);
  overAllTexture = createGraphics(windowWidth, windowHeight);
  overAllTexture.loadPixels();
  // noStroke()
  for (let i = 0; i < width + 250; i++) {
    for (let o = 0; o < height + 250; o++) {
      overAllTexture.set(i, o, color(100, noise(i / 3, o / 3, i * o / 50) * random([0, 50, 100])));
    }
  }
  overAllTexture.updatePixels();


  //fanshaped mask setup
  maskGra.push();
  maskGra.scale(1);
  maskGra.beginShape();
  maskGra.vertex(maskM, fanshapeMargin);
  maskGra.bezierVertex(maskM, fanshapeMargin, width / 2, 0, width - maskM, fanshapeMargin);
  maskGra.vertex(width - fanshapeMargin - maskM, height - maskM);
  maskGra.bezierVertex(width - fanshapeMargin - maskM, height - maskM, width / 2, height - fanshapeMargin - maskM, fanshapeMargin + maskM, height - maskM);
  maskGra.vertex(maskM, fanshapeMargin);
  maskGra.endShape(CLOSE);
  maskGra.pop();
  maskGra.noFill();

  //generate stars
  for (let i = 0; i < starNum; i++) {
    sky[i] = new Star();
  }
}

function draw() {
  // background(255);


  dataGra.push();
  dataGra.scale(0.9);

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

  //draw moon
  moon(dataGra);

  //draw stars
  for (let i = 0; i < starNum; i++) {
    sky[i].shine(dataGra);
  }

  //draw waves
  let stColor1 = color(3, 58, 144);
  let edColor1 = color(193, 223, 244);
  for (let o = 0; o < 12; o++) {
    dataGra.noStroke();
    let midColor = lerpColor(stColor1, edColor1, o / 12);

    dataGra.push();
    dataGra.translate(0, o * height / 15 + 350);
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

  //draw boat-male
  randomSeed(102); //41 101
  for (let k = 0; k < 109; k++) {
    let bx = random(250, width - 150) + noise(k + frameCount / 100) * 40;
    let by = random(350, height - 120) + noise(k + frameCount / 100) * 50;
    boat(bx, by, dataGra);
  }

  //draw boat female
  randomSeed(12); //8
  for (let k = 0; k < 4; k++) {
    let bxf = random(250, width - 150) + noise(k + frameCount / 100) * 40;
    let byf = random(500, height - 120) + noise(k + frameCount / 100) * 50;
    boatf(bxf, byf, dataGra);
  }


  // draw texture
  dataGra.push();
  dataGra.blendMode(MULTIPLY);
  dataGra.image(overAllTexture, 0, 0, width + 250, height + 250);
  dataGra.pop();


  //bottom text
  dataGra.push();
  dataGra.textSize(16);
  dataGra.fill(255);
  dataGra.text('According to the Commonwealth Census of 1911,  there were 21,856 Chinese males and 879 Chinese females in Australia.', width / 4, height - 40);
  dataGra.text('The Census report also recorded that 801 Chinese males living with wives in Australia while a further 6,714 were recorded to have wives in China.', width / 5, height - 15);
  dataGra.pop();
  //put pg on the screen
  //image(dataGra, 0, 0, width, height);
  //image(maskGra, 0, 0, width, height);
  dataGra.pop();

  //left text white boat
  dataGra.push();
  boatEx(35, 150, dataGra);
  dataGra.textSize(12);
  dataGra.fill(255);
  // dataGra.text('1', 18, 150);
  dataGra.text('equals to', 65, 150);
  dataGra.text('200 Chinese males', 20, 170);
  dataGra.pop();

  //right text yellow boat
  dataGra.push();
  boatfEx(width - 80, 150, dataGra);
  dataGra.textSize(12);
  dataGra.fill(255);
  // dataGra.text('1', width - 220, 480);
  dataGra.text('equals to', width - 55, 150);
  dataGra.text('200 Chinese females', width - 120, 170);
  dataGra.pop();

  //top text star 
  dataGra.push();
  dataGra.fill(255);
  dataGra.ellipseMode(CENTER);
  dataGra.ellipse(width / 2 - 100, 50, 10);
  dataGra.textSize(12);
  dataGra.fill(255);
  dataGra.text('1', width / 2 - 115, 55);
  dataGra.text('equals to 200 Chinese wives remian in China.', width / 2 - 87, 53);
  //dataGra.text('200 Chinese females', width-230, 500);
  dataGra.pop();

   // detect face position
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    faceX += (pose.nose.x-faceX)*ease;
    faceY += (pose.nose.y- faceY)*ease;
    faceS = dist(pose.leftEar.x, pose.leftEar.y, pose.rightEar.x, pose.rightEar.y);
  }

  //composite mask
  let mixGraXpos = map(faceX, width/5, width/5*4, 120, -120);
  let mixGraYpos = map(faceY, height/5, height/5*4, -100,83);

  mixGra.copy(dataGra, 0, 0, width, height, mixGraXpos, mixGraYpos , width, height);
  mixGra.mask(maskGra);
  image(mixGra, 0, 0);
  //image(maskGra, 0, 0, width, height);


  // print(mouseX+'and'+mouseY)
}

class Star {
  constructor() {
    this.pg = createGraphics(windowWidth, windowHeight);
    this.x = random(200, width - 300);
    this.y = random(120, 300);
    this.c = 255;
    this.a = -1;
    this.dir = 0.0;
    this.sz = 0.0;
  }

  shine(pg) {
    if (this.a < 0) {
      this.sz = random(3, 5);
      this.dir = random(5, 10);
      this.a = 0;
    }
    pg.noStroke();
    pg.fill(this.c, this.a);
    pg.ellipse(this.x, this.y, this.sz, this.sz);
    this.a = this.a + this.dir;
    if (this.a > 255) {
      this.a = 255;
      this.dir = random(-5, -10);
    }
    if (this.a < 50) {
      this.a = 50;
      this.dir = random(5, 10);
    }
  }
}

function boat(x, y, p) {
  p.push();
  p.translate(x, y);
  p.scale(0.3 * pow(y / 700, 2));
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

function boatEx(x, y, p) {
  p.push();
  p.translate(x, y);
  p.scale(0.18);
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

function boatfEx(x, y, p) {
  p.push();
  p.translate(x, y);
  p.scale(0.18);
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

function moon(p) {
 p.push();
  p.noStroke();
  p.fill(255, 230, 109, 250);
  let moonX = width - 180;
  let moonY = 200;
  let moonR = 120;
  p.ellipse(moonX, moonY, moonR, moonR);
  p.fill(8, 67, 161);
  p.ellipse(moonX * 1.02, moonY * 0.9, moonR * 0.9, moonR * 0.9);
  p.blendMode(SCREEN);
  p.pop();
}

//ml5 pose detection
function poseDetected(results) {
  poses = results;
}