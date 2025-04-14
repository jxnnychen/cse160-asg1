function drawMyCustomDesign() {
    drawTriangleWithColor([-0.5, 0.6], [0.5, 0.6], [-0.6, 0.2], [0.71, 0.45, 0.2, 1.0]);
    drawTriangleWithColor([0.5, 0.6], [0.6, 0.2], [-0.6, 0.2], [0.71, 0.45, 0.2, 1.0]);

    // ears
    // left ear
    drawTriangleWithColor([-0.6, 0.75], [-0.5, 0.6], [-0.7, 0.65], [0.1, 0.1, 0.1, 1.0]);
    drawTriangleWithColor([-0.65, 0.55], [-0.5, 0.6], [-0.7, 0.65], [0.1, 0.1, 0.1, 1.0]);
    // right ear
    drawTriangleWithColor([0.6, 0.75], [0.5, 0.6], [0.7, 0.65], [0.1, 0.1, 0.1, 1.0]);
    drawTriangleWithColor([0.65, 0.55], [0.5, 0.6], [0.7, 0.65], [0.1, 0.1, 0.1, 1.0]);

    // eyes
    drawTriangleWithColor([-0.2, 0.45], [-0.15, 0.45], [-0.2, 0.4], [0, 0, 0, 1]);
    drawTriangleWithColor([-0.15, 0.45], [-0.15, 0.4], [-0.2, 0.4], [0, 0, 0, 1]);
    drawTriangleWithColor([-0.25, 0.45], [-0.15, 0.40], [-0.2, 0.45], [0, 0, 0, 1]);

    drawTriangleWithColor([0.2, 0.45], [0.15, 0.45], [0.2, 0.4], [0, 0, 0, 1]);
    drawTriangleWithColor([0.15, 0.45], [0.15, 0.4], [0.2, 0.4], [0, 0, 0, 1]);
    drawTriangleWithColor([0.25, 0.45], [0.15, 0.40], [0.2, 0.45], [0, 0, 0, 1]);

    // body
    drawTriangleWithColor([-0.6, 0.2], [0.6, 0.2], [-0.5, -0.6], [0.65, 0.4, 0.2, 1.0]);
    drawTriangleWithColor([0.6, 0.2], [0.5, -0.6], [-0.5, -0.6], [0.65, 0.4, 0.2, 1.0]);

    // feet
    drawTriangleWithColor([-0.4, -0.8], [-0.25, -0.8], [-0.4, -0.60], [0.1, 0.1, 0.1, 1.0]);
    drawTriangleWithColor([-0.25, -0.60], [-0.25, -0.8], [-0.4, -0.60], [0.1, 0.1, 0.1, 1.0]);

    drawTriangleWithColor([0.4, -0.8], [0.25, -0.8], [0.4, -0.60], [0.1, 0.1, 0.1, 1.0]);
    drawTriangleWithColor([0.25, -0.60], [0.25, -0.8], [0.4, -0.60], [0.1, 0.1, 0.1, 1.0]);

    // snout
    drawTriangleWithColor([-0.15, 0.3], [0.15, 0.3], [0, 0.15], [0.3, 0.2, 0.1, 1.0]); // Top snout
    drawTriangleWithColor([-0.15, 0.1], [0.15, 0.1], [0, 0.15], [0.2, 0.15, 0.05, 1.0]); // Bottom snout

    // belly
    drawTriangleWithColor([-0.25, -0.6], [0, -0.2], [0.25, -0.6], [0.55, 0.3, 0.15, 1.0]);
}

function drawTriangleWithColor(v1, v2, v3, color) {
    // set color
    gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
    
    // draw the triangle
    drawTriangle([v1[0], v1[1], v2[0], v2[1], v3[0], v3[1]]);
}