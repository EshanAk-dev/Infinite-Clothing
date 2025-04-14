import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveCustomDesign,
  resetDesignState,
} from "../../redux/slices/customDesignSlice";
import { toast } from "sonner";

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
    { hex: "#ffffff", name: "White" },
    { hex: "#000000", name: "Black" },
    { hex: "#ff0000", name: "Red" },
    { hex: "#0000ff", name: "Blue" },
    { hex: "#ffff00", name: "Yellow" },
    { hex: "#00ff00", name: "Green" },
    { hex: "#ff00ff", name: "Magenta" },
    { hex: "#00ffff", name: "Cyan" },
    { hex: "#808080", name: "Gray" },
    { hex: "#ffa500", name: "Orange" },
    { hex: "#964B00", name: "Brown" },
    { hex: "#800080", name: "Purple" },
  ];

  useEffect(() => {
    drawTShirt();
  }, [color, view, designs, showGrid, selectedDesignId]);

  const drawTShirt = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw T-shirt shape
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = color;
    ctx.beginPath();

    if (view === "front") {
      // Draw front of t-shirt
      ctx.moveTo(200, 70); // Left shoulder
      ctx.lineTo(130, 110); // Left sleeve
      ctx.lineTo(160, 160); // Left armpit
      ctx.lineTo(160, 370); // Left bottom
      ctx.lineTo(370, 370); // Right bottom
      ctx.lineTo(370, 160); // Right armpit
      ctx.lineTo(400, 110); // Right sleeve
      ctx.lineTo(330, 70); // Right shoulder
      ctx.lineTo(290, 100); // Right neck
      ctx.lineTo(240, 100); // Left neck
    } else {
      // Draw back of t-shirt
      ctx.moveTo(200, 70); // Left shoulder
      ctx.lineTo(130, 110); // Left sleeve
      ctx.lineTo(160, 160); // Left armpit
      ctx.lineTo(160, 370); // Left bottom
      ctx.lineTo(370, 370); // Right bottom
      ctx.lineTo(370, 160); // Right armpit
      ctx.lineTo(400, 110); // Right sleeve
      ctx.lineTo(330, 70); // Right shoulder
      ctx.lineTo(265, 80); // Neck
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowColor = "transparent";

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Center markers
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
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
        toast.success("Your custom design has been saved successfully!", {
          style: {
            background: "#ecfdf5",
            color: "#065f46",
            border: "1px solid #6ee7b7",
            borderRadius: "8px",
            padding: "16px",
          },
        });
      } catch (err) {
        console.error("Failed to save design:", err);
        toast.error("Failed to save design. Please try again!", {
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
            className="bg-white p-4 md:p-6 rounded-lg shadow-md"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "design"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("design")}
              >
                Design
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "settings"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("settings")}
              >
                Settings
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "shipping"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping
              </button>
            </div>

            {activeTab === "design" ? (
              <>
                {/* View selection */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Select View</h3>
                  <div className="flex space-x-2">
                    <button
                      className={`flex-1 py-2 rounded-md ${
                        view === "front"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleViewChange("front")}
                    >
                      Front
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-md ${
                        view === "back"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleViewChange("back")}
                    >
                      Back
                    </button>
                  </div>
                </div>

                {/* Design upload */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Upload Your Design</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {view === "front" ? "Front design" : "Back design"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDesignUpload}
                    className="w-full text-sm text-gray-500 
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
                  />

                  {/* Thumbnails for uploaded designs */}
                  <div className="mt-4 space-y-2">
                    {designs[view].map((design) => (
                      <div
                        key={design.id}
                        className={`flex items-center p-2 rounded-md border ${
                          design.id === selectedDesignId
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                        onClick={() => setSelectedDesignId(design.id)}
                      >
                        <img
                          src={design.image}
                          alt={design.name}
                          className="w-12 h-12 object-contain bg-white border border-gray-300 rounded-md"
                        />
                        <div className="ml-3 flex-1">
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
                          className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-full"
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
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">T-Shirt Color</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableColors.map((c) => (
                      <div key={c.hex} className="flex flex-col items-center">
                        <button
                          className={`w-8 h-8 rounded-full border-2 ${
                            color === c.hex
                              ? "border-blue-500"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          onClick={() => handleColorChange(c.hex)}
                          aria-label={`Color ${c.name}`}
                        />
                        <span className="text-xs mt-1 text-gray-600">
                          {c.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDesignId ? (
                  <>
                    {/* Design size */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Design Size</h3>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={getSelectedDesign()?.scale || 1}
                        onChange={handleScaleChange}
                        className="w-full mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Small</span>
                        <span>
                          {(getSelectedDesign()?.scale || 1).toFixed(1)}x
                        </span>
                        <span>Large</span>
                      </div>
                    </div>

                    {/* Design rotation */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Design Rotation</h3>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="1"
                        value={getSelectedDesign()?.rotation || 0}
                        onChange={handleRotationChange}
                        className="w-full mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0°</span>
                        <span>{getSelectedDesign()?.rotation || 0}°</span>
                        <span>360°</span>
                      </div>
                    </div>

                    {/* Design opacity */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Design Opacity</h3>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={getSelectedDesign()?.opacity || 1}
                        onChange={handleOpacityChange}
                        className="w-full mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0%</span>
                        <span>
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
                      className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mb-4"
                    >
                      Reset Selected Design
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Select a design to adjust its settings
                  </div>
                )}

                {/* Grid toggle */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold">Show Grid</h3>
                    <p className="text-sm text-gray-500">
                      Helpful for alignment
                    </p>
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
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Quantity</h3>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-l-md hover:bg-gray-300"
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
                      className="w-16 text-center py-1 border-t border-b border-gray-300"
                    />
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            ) : (
              activeTab === "shipping" && (
                <div className="shipping-form space-y-4">
                  <h3 className="font-semibold mb-2">Shipping Information</h3>

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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )
            )}

            {/* Submit buttons */}
            <div className="space-y-3 mt-6">
              <button
                onClick={submitDesign}
                disabled={loading}
                className={`w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Submit Design
                  </>
                )}
              </button>
              <button
                onClick={downloadDesign}
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Preview
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
                <span>Rs.{((2000 * quantity)).toFixed(2)}</span>
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
                    Click to select a design, then drag to position it precisely
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
                    Adjust size, rotation and opacity in the settings tab
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
                    Toggle between front and back views to customize each side
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
                    Add multiple designs to each side for complex creations
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
                    Complete shipping information before submitting designs.
                  </span>
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
