/* exported getInspirations, initDesign, renderDesign, mutateDesign */


function getInspirations() {
    return [
      {
        name: "Rumia 1",
        assetUrl: "img/rumia1.jpg",
        credit: "Rumia Image 1",
        shapeType: "ellipse"
      },
      {
        name: "Rumia 2",
        assetUrl: "img/rumia2.JPG",
        credit: "Rumia Image 2",
        shapeType: "rect"
      },
      {
        name: "Rumia 3",
        assetUrl: "img/rumia3.JPG",
        credit: "Rumia Image 3",
        shapeType: "ellipse"
      },
      {
        name: "Rumia 4",
        assetUrl: "img/rumia4.JPG",
        credit: "Rumia Image 4",
        shapeType: "rect"
      }
    ];
  }
  
  function initDesign(inspiration) {
    let scaleFactor = 4.1;
    resizeCanvas(inspiration.image.width / scaleFactor, inspiration.image.height / scaleFactor);
  
    let design = {
      backgroundColor: 255,
      shapeType: inspiration.shapeType,
      shapes: Array(1000).fill().map(() => {
        let x = random(width);
        let y = random(height);
        let colors = inspiration.image.get(x * scaleFactor, y * scaleFactor);
        return {
          x: x,
          y: y,
          w: random(width / 10),
          h: random(height / 10),
          fill: color(colors[0], colors[1], colors[2])
        };
      })
    };
    return design;
  }
  
  function renderDesign(design, inspiration) {

    background(design.backgroundColor);
    noStroke();
    for (let shape of design.shapes) {
      fill(shape.fill);
      if (design.shapeType === "rect") {
        rect(shape.x, shape.y, shape.w, shape.h);
      } else if (design.shapeType === "ellipse") {
        ellipse(shape.x, shape.y, shape.w, shape.h);
      }
    }
  }
  function mutateDesign(design, inspiration, rate) {
    design.backgroundColor = constrain(randomGaussian(design.backgroundColor, (rate * (255 )) / 20), 0, 255); 
    let scaleFactor = 4.1;
    for (let shape of design.shapes) {
      shape.x = constrain(randomGaussian(shape.x, (rate * (width)) / 20), 0, width);
      shape.y =constrain(randomGaussian(shape.y, (rate * (height )) / 20), 0, height);
      shape.w =constrain(randomGaussian(shape.w, (rate * (width / 10 )) / 20), 0, width / 10);
      shape.h =constrain(randomGaussian(shape.h, (rate * (height / 10)) / 20), 0, height / 10);
      let colors = inspiration.image.get(shape.x * scaleFactor, shape.y * scaleFactor);
      shape.fill = color(colors[0], colors[1], colors[2]);
    }


  }
  