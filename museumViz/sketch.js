let mapimg;
let museums;

let clon = 0;
let clat = 0;
let zoom = 1;
let ww = 1024;
let hh = 512;

let cx, xy;
let lon, lat;

let r = 1; // halo size

let grow = true; //halo grow
let Ranking;

function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/' +
    clon + ',' + clat + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiZnJleWFoYW4iLCJhIjoiY2tleHNnbWsxMDI0bzJzcGdpamx0bjEwbCJ9.9CB688WgLXm5KCq8SQ0rEQ');

  //csv format
  museums = loadTable('tripadvisor_museum_world.csv', 'header')

}

function setup() {
  createCanvas(1024, 512);
  Ranking = new ranking();
  let gui = new dat.GUI();
  gui.add(Ranking, 'TopMuseum', 10, 800);
}

function draw() {
  // print(museums.rows[0].arr[11]);
  //print(museums);
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(mapimg, 0, 0);
  frameRate(10);

  drawdots();
  drawHalo();
  // print(mouseY);

  //paris popover
  if (mouseX > 500 && mouseX < 530 && mouseY > 85 && mouseY < 109) {
    fill(255);
    noStroke();
    rect(530 - width / 2, 98 - height / 2, 140, 56)
    textSize(12);
    fill(50, 200);
    text('Top 1 巴黎卢浮宫', 540 - width / 2, 120 - height / 2);
    text('Top 3 巴黎奥赛博物馆', 540 - width / 2, 140 - height / 2);
  }

  //usa popover
  if (mouseX > 292 && mouseX < 315 && mouseY > 118 && mouseY < 140) {
    fill(255);
    noStroke();
    rect(310 - width / 2, 130 - height / 2, 160, 32)
    textSize(12);
    fill(50, 200);
    text('Top 2 纽约9/11国家纪念馆', 320 - width / 2, 150 - height / 2);
  }

}

function drawdots() {
  for (let i = 0; i < Ranking.TopMuseum; i++) {

    lat = museums.rows[i].arr[5];
    lon = museums.rows[i].arr[4];

    cx = mercX(clon);
    cy = mercY(clat);

    let x = mercX(lon);
    let y = mercY(lat);

    fill(231, 29, 54, 80);
    noStroke();
    ellipse(x - cy, y - cy, 5);


  }
}

function drawHalo() {
  for (let i = 0; i < 3; i++) {
    let lathalo = museums.rows[i].arr[5];
    let lonhalo = museums.rows[i].arr[4];
    let halo = museums.rows[i].arr[11] * 0.0001;

    let cx = mercX(clon);
    let cy = mercY(clat);

    let xhalo = mercX(lonhalo);
    let yhalo = mercY(lathalo);


    fill(231, 29, 54, 30);
    noStroke();

    if (r > 30) {
      grow = !grow
    }
    if (r == 0) {
      grow = true
    }

    if (grow) {
      r = r + 1;
      ellipse(xhalo - cx, yhalo - cy, r);
    } else {
      r = r - 1;
      ellipse(xhalo - cx, yhalo - cy, r);
    }
  }


}

function mercX(lon) {
  lon = radians(lon);
  let a = (256 / PI) * pow(2, zoom);
  let b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  let a = (256 / PI) * pow(2, zoom);
  let b = tan(PI / 4 + lat / 2);
  let c = PI - log(b);
  return a * c;
}

function ranking() {
  this.TopMuseum = 100;
}