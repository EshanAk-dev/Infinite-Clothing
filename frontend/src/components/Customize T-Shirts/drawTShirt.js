export function drawTShirt({
  canvasRef,
  color,
  view,
  designs,
  showGrid,
  selectedDesignId,
  addShade,
  isDarkColor,
  addFabricTexture,
  drawGrid,
}) {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Define T-shirt base color and shading colors
  const baseColor = color;
  const shadowColor = addShade(baseColor, -20);
  const highlightColor = addShade(baseColor, 20);

  // Shadow settings
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 8;

  if (view === "front") {
    // Draw front of t-shirt base shape
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(130, 110); // Left sleeve
    ctx.lineTo(160, 160); // Left armpit
    ctx.lineTo(160, 370); // Left bottom
    ctx.lineTo(370, 370); // Right bottom
    ctx.lineTo(370, 160); // Right armpit
    ctx.lineTo(400, 110); // Right sleeve
    ctx.lineTo(330, 70); // Right shoulder

    // Crew neck curve - front
    ctx.quadraticCurveTo(265, 90, 200, 70);

    ctx.closePath();
    ctx.fill();

    // Remove shadow for details
    ctx.shadowColor = "transparent";

    // Draw crew neck ribbing
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left neck start
    ctx.quadraticCurveTo(265, 90, 330, 70); // Outer neck curve
    ctx.quadraticCurveTo(265, 105, 200, 75); // Inner neck curve
    ctx.closePath();
    ctx.fillStyle = shadowColor;
    ctx.fill();

    // Add sleeve seams
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(160, 160); // Left armpit
    ctx.moveTo(330, 70); // Right shoulder
    ctx.lineTo(370, 160); // Right armpit
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add fabric shading with gradient
    const gradientBody = ctx.createLinearGradient(265, 100, 265, 370);
    gradientBody.addColorStop(0, baseColor);
    gradientBody.addColorStop(0.4, highlightColor);
    gradientBody.addColorStop(0.7, baseColor);
    gradientBody.addColorStop(1, shadowColor);

    ctx.fillStyle = gradientBody;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(160, 160); // Left armpit
    ctx.lineTo(160, 370); // Left bottom
    ctx.lineTo(370, 370); // Right bottom
    ctx.lineTo(370, 160); // Right armpit
    ctx.lineTo(330, 70); // Right shoulder
    ctx.quadraticCurveTo(265, 90, 200, 70); // Crew neck
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Add crew neck ribbing detail
    ctx.beginPath();
    ctx.moveTo(205, 74); // Left neck inner
    ctx.quadraticCurveTo(265, 95, 325, 74); // Inner neck curve
    ctx.strokeStyle = isDarkColor(baseColor)
      ? addShade(baseColor, 10)
      : shadowColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add wrinkles/fabric texture
    addFabricTexture(ctx, color, 265, 200, 150, 100);
  } else {
    // Draw back of t-shirt - crew neck
    ctx.fillStyle = baseColor;
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(130, 110); // Left sleeve
    ctx.lineTo(160, 160); // Left armpit
    ctx.lineTo(160, 370); // Left bottom
    ctx.lineTo(370, 370); // Right bottom
    ctx.lineTo(370, 160); // Right armpit
    ctx.lineTo(400, 110); // Right sleeve
    ctx.lineTo(330, 70); // Right shoulder

    // Crew neck curve - back (higher than front)
    ctx.quadraticCurveTo(265, 80, 200, 70);

    ctx.closePath();
    ctx.fill();

    // Remove shadow for details
    ctx.shadowColor = "transparent";

    // Draw crew neck ribbing - back
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left neck start
    ctx.quadraticCurveTo(265, 80, 330, 70); // Outer neck curve
    ctx.quadraticCurveTo(265, 90, 200, 75); // Inner neck curve
    ctx.closePath();
    ctx.fillStyle = shadowColor;
    ctx.fill();

    // Add sleeve seams
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(160, 160); // Left armpit
    ctx.moveTo(330, 70); // Right shoulder
    ctx.lineTo(370, 160); // Right armpit
    ctx.strokeStyle = shadowColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Add tag/label at back
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(255, 85, 20, 15);

    // Add fabric shading with gradient
    const gradientBody = ctx.createLinearGradient(265, 100, 265, 370);
    gradientBody.addColorStop(0, baseColor);
    gradientBody.addColorStop(0.3, highlightColor);
    gradientBody.addColorStop(0.6, baseColor);
    gradientBody.addColorStop(1, shadowColor);

    ctx.fillStyle = gradientBody;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(160, 160); // Left armpit
    ctx.lineTo(160, 370); // Left bottom
    ctx.lineTo(370, 370); // Right bottom
    ctx.lineTo(370, 160); // Right armpit
    ctx.lineTo(330, 70); // Right shoulder
    ctx.quadraticCurveTo(265, 80, 200, 70); // Crew neck
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Add crew neck ribbing detail - back
    ctx.beginPath();
    ctx.moveTo(205, 74); // Left neck inner
    ctx.quadraticCurveTo(265, 85, 325, 74); // Inner neck curve
    ctx.strokeStyle = isDarkColor(baseColor)
      ? addShade(baseColor, 10)
      : shadowColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add wrinkles/fabric texture
    addFabricTexture(ctx, color, 265, 200, 150, 100);
  }

  // Add sleeve ends
  ctx.beginPath();
  ctx.moveTo(130, 110); // Left sleeve end
  ctx.lineTo(160, 160); // Left armpit
  ctx.moveTo(400, 110); // Right sleeve end
  ctx.lineTo(370, 160); // Right armpit
  ctx.strokeStyle = shadowColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Add bottom hem
  ctx.beginPath();
  ctx.moveTo(160, 360);
  ctx.lineTo(370, 360);
  ctx.strokeStyle = shadowColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Border for the entire t-shirt to define shape better
  ctx.beginPath();
  if (view === "front") {
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(130, 110); // Left sleeve
    ctx.lineTo(160, 160); // Left armpit
    ctx.lineTo(160, 370); // Left bottom
    ctx.lineTo(370, 370); // Right bottom
    ctx.lineTo(370, 160); // Right armpit
    ctx.lineTo(400, 110); // Right sleeve
    ctx.lineTo(330, 70); // Right shoulder
    ctx.quadraticCurveTo(265, 90, 200, 70); // Crew neck
  } else {
    ctx.moveTo(200, 70); // Left shoulder
    ctx.lineTo(130, 110); // Left sleeve
    ctx.lineTo(160, 160); // Left armpit
    ctx.lineTo(160, 370); // Left bottom
    ctx.lineTo(370, 370); // Right bottom
    ctx.lineTo(370, 160); // Right armpit
    ctx.lineTo(400, 110); // Right sleeve
    ctx.lineTo(330, 70); // Right shoulder
    ctx.quadraticCurveTo(265, 80, 200, 70); // Crew neck
  }
  ctx.closePath();
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw grid if enabled
  if (showGrid) {
    drawGrid(ctx, canvas.width, canvas.height);
  }

  // Draw all designs for the current view
  designs[view].forEach((design) => {
    const img = new Image();
    img.src = design.image;
    img.onload = () => {
      ctx.save();
      ctx.globalAlpha = design.opacity;
      ctx.translate(design.position.x, design.position.y);
      ctx.rotate((design.rotation * Math.PI) / 180);

      // Draw selection border if this design is selected
      if (design.id === selectedDesignId) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          -(img.width * design.scale) / 2 - 2,
          -(img.height * design.scale) / 2 - 2,
          img.width * design.scale + 4,
          img.height * design.scale + 4
        );
      }

      ctx.drawImage(
        img,
        -(img.width * design.scale) / 2,
        -(img.height * design.scale) / 2,
        img.width * design.scale,
        img.height * design.scale
      );
      ctx.restore();
    };
  });
}

// Helper function to draw grid
export const drawGrid = (ctx, width, height) => {
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
};

// Helper function to add fabric texture effect
export const addFabricTexture = (
  ctx,
  baseColor,
  centerX,
  centerY,
  width,
  height
) => {
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = isDarkColor(baseColor) ? "#ffffff" : "#000000";
  ctx.lineWidth = 0.5;
  for (let y = centerY - height / 2; y < centerY + height / 2; y += 7) {
    ctx.beginPath();
    ctx.moveTo(centerX - width / 2, y);
    ctx.bezierCurveTo(
      centerX - width / 4,
      y + Math.random() * 3 - 1.5,
      centerX + width / 4,
      y + Math.random() * 3 - 1.5,
      centerX + width / 2,
      y
    );
    ctx.stroke();
  }
  for (let i = 0; i < 5; i++) {
    const x = centerX - width / 3 + Math.random() * ((width * 2) / 3);
    const topY = centerY - height / 2;
    const bottomY = centerY + height / 2;
    ctx.beginPath();
    ctx.moveTo(x, topY + height / 5);
    ctx.bezierCurveTo(
      x - 10,
      topY + height / 3,
      x + 10,
      topY + (height * 2) / 3,
      x,
      bottomY
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
};

// Helper function to darken or lighten a color
export const addShade = (color, percent) => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);
  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;
  R = R > 0 ? R : 0;
  G = G > 0 ? G : 0;
  B = B > 0 ? B : 0;
  const RR = R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);
  return "#" + RR + GG + BB;
};

// Helper function to check if a color is dark
export const isDarkColor = (hexColor) => {
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return brightness < 0.5;
};