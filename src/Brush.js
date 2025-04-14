class Brush {
    constructor() {
      this.type = 'brush';
      this.position = [0.0, 0.0, 0.0];
      this.previousPosition = null;
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.alpha = 0.7;
      this.spacing = 0.03; // distance between intermediate points
    }
  
    render() {
      var rgba = this.color;
      rgba[3] = this.alpha;
      
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      
      // if first point of a stroke or single click
      if (!this.previousPosition) {
        this.renderBrushDot(this.position);
        return;
      }
      
      // fill gap between prev and current pos
      this.renderBrushStroke(this.previousPosition, this.position);
    }
    
    renderBrushDot(position) {
      let d = this.size/200.0;
      let segments = 10;
      let angleStep = 360/segments;
      
      for(let angle = 0; angle < 360; angle += angleStep) {
        let centerPt = [position[0], position[1]];
        let angle1 = angle;
        let angle2 = angle + angleStep;
        let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
        let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
        let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
        let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];
  
        drawTriangle([centerPt[0], centerPt[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
      }
    }
    
    renderBrushStroke(from, to) {
      let dx = to[0] - from[0];
      let dy = to[1] - from[1];
      let distance = Math.sqrt(dx*dx + dy*dy);
      
      // how many points to draw
      let steps = Math.max(1, Math.floor(distance / this.spacing));
      
      // create a cont stroke
      for (let i = 0; i <= steps; i++) {
        let t = i / steps;
        let x = from[0] + dx * t;
        let y = from[1] + dy * t;
        this.renderBrushDot([x, y]);
      }
    }
  }