import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveCustomDesign,
  resetDesignState,
} from "../../redux/slices/customDesignSlice";
import { toast } from "sonner";
import {
  Shirt,
  RotateCcw,
  Loader2,
  CheckCircle,
  Download,
  Upload,
  Truck,
} from "lucide-react";

const TShirtCustomizer = () => {
  const [color, setColor] = useState("#ffffff");
  const [view, setView] = useState("front");
  const [designs, setDesigns] = useState({
    front: [],
    back: [],
  });
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [draggedDesign, setDraggedDesign] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [activeTab, setActiveTab] = useState("design");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector(
    (state) => state.customDesign
  );

  const canvasRef = useRef(null);

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!user) {
      navigate("/login?redirect=customize-t-shirts");
    }
  }, [user, navigate]);

  const availableColors = [
    // Basic neutrals
    { hex: "#FFFFFF", name: "Pure White" },
    { hex: "#F5F5F5", name: "Soft White" },
    { hex: "#000000", name: "Jet Black" },
    { hex: "#1A1A1A", name: "Charcoal" },
    { hex: "#424242", name: "Dark Gray" },
    { hex: "#9E9E9E", name: "Medium Gray" },
    { hex: "#E0E0E0", name: "Light Gray" },

    // Blues
    { hex: "#0D47A1", name: "Navy Blue" },
    { hex: "#1976D2", name: "Classic Blue" },
    { hex: "#03A9F4", name: "Sky Blue" },

    // Reds/Pinks
    { hex: "#B71C1C", name: "Deep Red" },
    { hex: "#FF5252", name: "Coral Red" },
    { hex: "#E91E63", name: "Hot Pink" },

    // Greens
    { hex: "#1B5E20", name: "Forest Green" },
    { hex: "#388E3C", name: "Kelly Green" },

    // Yellows/Oranges
    { hex: "#F57F17", name: "Golden Yellow" },
    { hex: "#FFD600", name: "Lemon Yellow" },

    // Purples
    { hex: "#4A148C", name: "Royal Purple" },
    { hex: "#7B1FA2", name: "Violet" },

    // Earth tones
    { hex: "#8D6E63", name: "Taupe" },
    { hex: "#D7CCC8", name: "Sand" },

    // Special colors
    { hex: "#FFB300", name: "Amber" },
    { hex: "#8BC34A", name: "Fresh Green" },
    { hex: "#FF7043", name: "Coral Orange" },
    { hex: "#B39DDB", name: "Lavender Purple" },
    { hex: "#263238", name: "Graphite" },
    { hex: "#006064", name: "Deep Teal" },
    { hex: "#607D8B", name: "Slate Blue" },
  ];

  useEffect(() => {
    drawTShirt();
  }, [color, view, designs, showGrid, selectedDesignId]);

  const drawTShirt = () => {
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
  };

  // Helper function to draw grid
  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Center markers
    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
  };

  // Helper function to add fabric texture effect
  const addFabricTexture = (
    ctx,
    baseColor,
    centerX,
    centerY,
    width,
    height
  ) => {
    // Create subtle texture by drawing semi-transparent lines
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = isDarkColor(baseColor) ? "#ffffff" : "#000000";
    ctx.lineWidth = 0.5;

    // Horizontal fabric lines
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

    // Add some vertical creases
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
  const addShade = (color, percent) => {
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

    const RR =
      R.toString(16).length === 1 ? "0" + R.toString(16) : R.toString(16);
    const GG =
      G.toString(16).length === 1 ? "0" + G.toString(16) : G.toString(16);
    const BB =
      B.toString(16).length === 1 ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
  };

  // Helper function to check if a color is dark
  const isDarkColor = (hexColor) => {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // Calculate brightness using the formula (0.299*R + 0.587*G + 0.114*B)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // If brightness is less than 0.5, consider it dark
    return brightness < 0.5;
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    // Clear selection when switching views
    setSelectedDesignId(null);
  };

  const handleDesignUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const designImage = event.target.result;
        const newDesign = {
          id: Date.now().toString(),
          image: designImage,
          name: file.name,
          position: { x: 265, y: 220 }, // Adjusted center position
          scale: 1,
          rotation: 0,
          opacity: 1,
        };

        setDesigns((prev) => ({
          ...prev,
          [view]: [...prev[view], newDesign],
        }));

        // Select the newly added design
        setSelectedDesignId(newDesign.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a design
    const clickedDesign = designs[view].find((design) => {
      const img = new Image();
      img.src = design.image;
      const halfWidth = (img.width * design.scale) / 2;
      const halfHeight = (img.height * design.scale) / 2;

      // Simple bounding box check (for demo purposes)
      return (
        x >= design.position.x - halfWidth &&
        x <= design.position.x + halfWidth &&
        y >= design.position.y - halfHeight &&
        y <= design.position.y + halfHeight
      );
    });

    if (clickedDesign) {
      setSelectedDesignId(clickedDesign.id);
      setDraggedDesign(clickedDesign.id);
    } else {
      setSelectedDesignId(null);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (draggedDesign) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDesigns((prev) => ({
        ...prev,
        [view]: prev[view].map((design) =>
          design.id === draggedDesign
            ? { ...design, position: { x, y } }
            : design
        ),
      }));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedDesign(null);
  };

  const handleScaleChange = (e) => {
    if (!selectedDesignId) return;

    const newScale = parseFloat(e.target.value);
    setDesigns((prev) => ({
      ...prev,
      [view]: prev[view].map((design) =>
        design.id === selectedDesignId ? { ...design, scale: newScale } : design
      ),
    }));
  };

  const handleRotationChange = (e) => {
    if (!selectedDesignId) return;

    const newRotation = parseInt(e.target.value);
    setDesigns((prev) => ({
      ...prev,
      [view]: prev[view].map((design) =>
        design.id === selectedDesignId
          ? { ...design, rotation: newRotation }
          : design
      ),
    }));
  };

  const handleOpacityChange = (e) => {
    if (!selectedDesignId) return;

    const newOpacity = parseFloat(e.target.value);
    setDesigns((prev) => ({
      ...prev,
      [view]: prev[view].map((design) =>
        design.id === selectedDesignId
          ? { ...design, opacity: newOpacity }
          : design
      ),
    }));
  };

  const removeSelectedDesign = () => {
    if (!selectedDesignId) return;

    setDesigns((prev) => ({
      ...prev,
      [view]: prev[view].filter((design) => design.id !== selectedDesignId),
    }));
    setSelectedDesignId(null);
  };

  const resetSelectedDesign = () => {
    if (!selectedDesignId) return;

    setDesigns((prev) => ({
      ...prev,
      [view]: prev[view].map((design) =>
        design.id === selectedDesignId
          ? {
              ...design,
              position: { x: 265, y: 220 }, // Adjusted center position
              scale: 1,
              rotation: 0,
              opacity: 1,
            }
          : design
      ),
    }));
  };

  // Submit design function
  const submitDesign = async () => {
    // Validate shipping information
    if (
      !shippingAddress.name ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country ||
      !shippingAddress.phone
    ) {
      toast.error("Please complete shipping information before submitting", {
        style: {
          background: "#fef2f2",
          color: "#b91c1c",
          border: "1px solid #fca5a5",
          borderRadius: "8px",
          padding: "16px",
        },
        icon: "⚠️",
      });
      setActiveTab("shipping");
      return;
    }

    const canvas = canvasRef.current;

    // Temporarily disable grid and selection frame
    const previousShowGrid = showGrid;
    const previousSelectedDesignId = selectedDesignId;
    setShowGrid(false);
    setSelectedDesignId(null);

    // Wait for the canvas to update
    setTimeout(async () => {
      // Save current view
      const currentView = view;

      // Get front image
      setView("front");
      const frontImageData = await new Promise((resolve) => {
        setTimeout(() => resolve(canvas.toDataURL("image/png")), 100);
      });

      // Get back image
      setView("back");
      const backImageData = await new Promise((resolve) => {
        setTimeout(() => resolve(canvas.toDataURL("image/png")), 100);
      });

      try {
        await dispatch(
          saveCustomDesign({
            color,
            designs,
            frontImageData,
            backImageData,
            shippingAddress,
            quantity,
            price: 2000, // Default price from the model
          })
        ).unwrap();

        // Show success message
        toast.success(
          "Your custom design order has been placed successfully!",
          {
            style: {
              background: "#ecfdf5",
              color: "#065f46",
              border: "1px solid #6ee7b7",
              borderRadius: "8px",
              padding: "16px",
            },
          }
        );
      } catch (err) {
        console.error("Failed to save design:", err);
        toast.error("Failed to place design order. Please try again!", {
          style: {
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fca5a5",
            borderRadius: "8px",
            padding: "16px",
          },
          icon: "⚠️",
        });
      } finally {
        // Restore original view, grid and selection frame
        setView(currentView);
        setShowGrid(previousShowGrid);
        setSelectedDesignId(previousSelectedDesignId);
      }
    }, 100);
  };

  // Add useEffect to handle success/error messages
  useEffect(() => {
    if (success) {
      // Reset success state after showing message
      dispatch(resetDesignState());
    }
  }, [success, dispatch]);

  const downloadDesign = () => {
    const canvas = canvasRef.current;

    // Temporarily disable grid and selection frame
    const previousShowGrid = showGrid;
    const previousSelectedDesignId = selectedDesignId;
    setShowGrid(false);
    setSelectedDesignId(null);

    // Wait for the canvas to update before downloading
    setTimeout(() => {
      const link = document.createElement("a");
      const fileName =
        view === "front"
          ? "custom-tshirt-front-design.png"
          : "custom-tshirt-back-design.png";
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();

      // Restore grid and selection frame
      setShowGrid(previousShowGrid);
      setSelectedDesignId(previousSelectedDesignId);
    }, 100);
  };

  const getColorName = (hex) => {
    const color = availableColors.find((c) => c.hex === hex);
    return color ? color.name : hex;
  };

  const getSelectedDesign = () => {
    if (!selectedDesignId) return null;
    return designs[view].find((design) => design.id === selectedDesignId);
  };

  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const canvasVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Custom T-Shirt Designer
            </h1>
            <button
              onClick={() => navigate("/my-custom-designs")}
              className="fixed top-30 right-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              My Designs
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            Create your unique style with multiple designs on each side
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - Options */}
          <motion.div
            className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-3 font-medium text-sm transition-all ${
                  activeTab === "design"
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("design")}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Design
                </div>
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm transition-all ${
                  activeTab === "settings"
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Settings
                </div>
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm transition-all ${
                  activeTab === "shipping"
                    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("shipping")}
              >
                <div className="flex items-center gap-2">
                  <Truck
                    className="h-6 w-6"
                    strokeWidth={2.5}
                    color={activeTab === "shipping" ? "#2563eb" : "#6b7280"}
                  />
                  <span className="font-semibold">Shipping</span>
                </div>
              </button>
            </div>

            {activeTab === "design" ? (
              <>
                {/* View selection */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm0 2h12v7h-2.586l-1.707-1.707a1 1 0 00-1.414 0L9.586 12H4V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Select View
                  </h3>
                  <div className="flex space-x-3">
                    <button
                      className={`flex-1 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                        view === "front"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleViewChange("front")}
                    >
                      <Shirt className="h-5 w-5" />
                      Front
                    </button>
                    <button
                      className={`flex-1 py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                        view === "back"
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleViewChange("back")}
                    >
                      <RotateCcw className="h-5 w-5" />
                      Back
                    </button>
                  </div>
                </div>

                {/* Design upload */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-gray-500" />
                    Upload Your Design
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {view === "front" ? "Front design" : "Back design"}
                  </p>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold text-blue-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, SVG (Max. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDesignUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Thumbnails for uploaded designs */}
                  <div className="mt-6 space-y-3">
                    {designs[view].length > 0 && (
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Your Designs:
                      </h4>
                    )}
                    {designs[view].map((design) => (
                      <div
                        key={design.id}
                        className={`flex items-center p-3 rounded-xl transition-all ${
                          design.id === selectedDesignId
                            ? "border-2 border-blue-500 bg-blue-50"
                            : "border border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedDesignId(design.id)}
                      >
                        <div className="relative">
                          <img
                            src={design.image}
                            alt={design.name}
                            className="w-14 h-14 object-contain bg-white border border-gray-200 rounded-lg p-1"
                          />
                          {design.id === selectedDesignId && (
                            <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-white"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {design.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {view === "front" ? "Front design" : "Back design"}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (design.id === selectedDesignId) {
                              setSelectedDesignId(null);
                            }
                            setDesigns((prev) => ({
                              ...prev,
                              [view]: prev[view].filter(
                                (d) => d.id !== design.id
                              ),
                            }));
                          }}
                          className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Remove design"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : activeTab === "settings" ? (
              <>
                {/* Color selection */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    T-Shirt Color
                  </h3>
                  <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
                    {availableColors.map((c) => (
                      <div key={c.hex} className="flex flex-col items-center">
                        <button
                          className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 ${
                            color === c.hex
                              ? "border-blue-500 scale-110 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          onClick={() => handleColorChange(c.hex)}
                          aria-label={`Color ${c.name}`}
                        />
                        <span className="text-xs mt-1 text-center text-gray-600 truncate w-full">
                          {c.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDesignId ? (
                  <>
                    {/* Design size */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                          />
                        </svg>
                        Design Size
                      </h3>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={getSelectedDesign()?.scale || 1}
                        onChange={handleScaleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Small</span>
                        <span className="font-medium text-blue-600">
                          {(getSelectedDesign()?.scale || 1).toFixed(1)}x
                        </span>
                        <span>Large</span>
                      </div>
                    </div>

                    {/* Design rotation */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Design Rotation
                      </h3>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={getSelectedDesign()?.rotation || 0}
                        onChange={handleRotationChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0°</span>
                        <span className="font-medium text-blue-600">
                          {getSelectedDesign()?.rotation || 0}°
                        </span>
                        <span>360°</span>
                      </div>
                    </div>

                    {/* Design opacity */}
                    <div className="mb-8">
                      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                        Design Opacity
                      </h3>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={getSelectedDesign()?.opacity || 1}
                        onChange={handleOpacityChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0%</span>
                        <span className="font-medium text-blue-600">
                          {Math.round(
                            (getSelectedDesign()?.opacity || 1) * 100
                          )}
                          %
                        </span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Reset button */}
                    <button
                      onClick={resetSelectedDesign}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 mb-6 flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Reset Selected Design
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-300 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                    <p>Select a design to adjust its settings</p>
                  </div>
                )}

                {/* Grid toggle */}
                <div className="flex items-center justify-between mb-8 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                    <div>
                      <h3 className="font-semibold">Show Grid</h3>
                      <p className="text-sm text-gray-500">
                        Helpful for alignment
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showGrid}
                      onChange={() => setShowGrid(!showGrid)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Quantity selector */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Quantity
                  </h3>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-16 text-center py-2 border-x border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            ) : (
              activeTab === "shipping" && (
                <div className="shipping-form space-y-5">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-gray-500" />
                    Shipping Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.name}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          address: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              )
            )}

            {/* Submit buttons */}
            <div className="space-y-3 mt-8">
              <button
                onClick={submitDesign}
                disabled={loading}
                className={`w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 flex items-center justify-center shadow-md transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Submit Design
                  </>
                )}
              </button>
              <button
                onClick={downloadDesign}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center shadow-md transition-all"
              >
                <Download className="h-5 w-5 mr-2" />
                Download {view === "front" ? "Front" : "Back"} Design
              </button>
            </div>
          </motion.div>

          {/* Center - Canvas preview */}
          <motion.div
            className="lg:col-span-2"
            variants={canvasVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col items-center">
              <div className="relative mb-4">
                <canvas
                  ref={canvasRef}
                  width={530} // Increased canvas width
                  height={450} // Increased canvas height
                  className="border border-gray-300 bg-gray-50 shadow-sm"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                <p className="text-sm text-gray-500 mt-2 text-center italic">
                  {draggedDesign
                    ? "Release to place design"
                    : "Click to select, drag to position designs"}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm text-gray-600 mr-2">View:</span>
                  <span className="font-semibold">
                    {view === "front" ? "Front" : "Back"}
                  </span>
                </div>
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm text-gray-600 mr-2">Color:</span>
                  <div
                    className="w-4 h-4 rounded-full inline-block mr-1"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="font-semibold">{getColorName(color)}</span>
                </div>
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <span className="text-sm text-gray-600 mr-2">Designs:</span>
                  <span className="font-semibold">{designs[view].length}</span>
                </div>
                {selectedDesignId && (
                  <div className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                    <span className="text-sm text-blue-600 mr-2">
                      Selected:
                    </span>
                    <span className="font-semibold text-blue-700">
                      {designs[view].find((d) => d.id === selectedDesignId)
                        ?.name || "Design"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Price information */}
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Base price per item:</span>
                <span>Rs.{(2000).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>Rs.{(2000 * quantity).toFixed(2)}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg mt-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">Design Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Click to select a design, then drag to position it
                    precisely.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Adjust size, rotation and opacity in the settings tab.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Toggle between front and back views to customize each side.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Add multiple designs to each side for complex creations.
                  </span>
                </li>
              </ul>
              <h3 className="font-semibold text-blue-800 mb-2 mt-2">
                Order Tips
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Complete shipping information before submitting designs.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Add your quantity in settings section.</span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Only cash on delivery service.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TShirtCustomizer;
