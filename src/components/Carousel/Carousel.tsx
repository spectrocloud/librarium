import React from "react";
import { Carousel } from "antd";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "300px", // Adjust as needed
  color: "#f8fafc", // Softer white for better readability
  display: "flex", // Center content with flexbox
  justifyContent: "center", // Horizontally center the text
  alignItems: "center", // Vertically center the text
  textAlign: "left",
  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.85))", // Modern gradient background
  fontSize: "clamp(1rem, 1vw, 1.5rem)", // Responsive font size
  padding: "20px", // Increased padding for better spacing
  boxSizing: "border-box", // Ensure padding doesn’t affect dimensions
  borderRadius: "16px", // Rounded corners for a polished look
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
  transition: "all 0.3s ease-in-out", // Smooth hover transitions
  fontWeight: 400,
};

const carouselContainerStyle: React.CSSProperties = {
  position: "relative", // Needed for the title placement
  overflow: "hidden", // Ensures elements outside are clipped
  borderRadius: "16px", // Rounded corners for a cohesive design
  border: "2px solid rgba(255, 255, 255, 0)", // Subtle border
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Depth shadow for the container
  background: "#1e293b", // Fallback solid color
  transition: "all 0.3s ease-in-out", // Smooth hover effect for scaling
};

const titleStyle: React.CSSProperties = {
  position: "absolute", // Keep title at a fixed position
  top: "10px", // Adjust vertical spacing
  left: "50%",
  transform: "translateX(-50%)", // Center horizontally
  color: "#f8fafc", // Softer white
  fontSize: "clamp(1rem, 1.2vw, 1.8rem)", // Reduced size with responsiveness
  fontWeight: "500", // Medium weight for subtle emphasis
  textAlign: "center", // Center text alignment
  zIndex: 20, // Ensure it’s above the content
  backgroundColor: "rgba(30, 41, 59, 0.85)", // Add background for better visibility
  padding: "5px 10px", // Add padding for breathing room
  borderRadius: "6px", // Subtle rounding for the background
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.15)", // Lighter shadow to reduce heaviness
};

const MyCarousel: React.FC = () => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div style={carouselContainerStyle}>
      {/* Title positioned at the top */}
      <div style={titleStyle}>🧑‍🚀 Back at Spacetastic HQ</div>

      <Carousel afterChange={onChange}>
        <div>
          <p style={contentStyle}>
            The Spacetastic team decide to look for an external solution that can help them scale and manage their
            Kubernetes services. Partnering with a team of Kubernetes experts allows them to focus on expanding their
            astronomy education platform, instead of spending countless hours migrating and rehosting their services.
            They identify the following list of benefits that their new platform should provide.
          </p>
        </div>
        <div>
          <p style={contentStyle}>
            • Simplified Kubernetes cluster deployment processes across cloud providers.
            <br />
            <br />
            • Cluster maintenance and security patching across environments.
            <br />
            <br />
            • Monitoring and observability of Kubernetes workloads.
            <br />
          </p>
        </div>
        <div>
          <p style={contentStyle}>
            "I have so many ideas for new features for our backlog." says Anya, Lead Astrophysicist.
            <br />
            <br />
            "Our community of space explorers want to keep learning, so we shouldn't slow down our implementation cycle.
            We need to keep expanding our astronomy education product." says Kai, Platform Engineer.
            <br />
            <br />
            "I've done some research on Kubernetes orchestration solutions. It seems that Palette has all the
            capabilities we need to help us grow." says Wren, Founding Engineer.
            <br />
          </p>
        </div>
        <div>
          <p style={contentStyle}>
            "I agree with both of you, but I want to review the developer experience in detail before we agree to
            implement a new solution in production." says Wren, Founding Engineer.
            <br />
            <br />
            "Let's reach out to Spectro Cloud to create an account. Then, we can make an informed decision after we
            complete their Getting Started tutorials." says Wren, Founding Engineer.
            <br />
          </p>
        </div>
        <div>
          <p style={contentStyle}>
            <img
              src="/getting-started/getting-started_setup_getting-started-discovery.webp"
              alt="The Spacetastic team reading Palette Getting Started"
              style={{ maxWidth: "60%", height: "auto", borderRadius: "16px" }} // Ensure the image also has rounded corners
            />
          </p>
        </div>
      </Carousel>
    </div>
  );
};

export default MyCarousel;
