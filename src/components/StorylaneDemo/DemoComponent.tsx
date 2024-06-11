import React from "react";

interface DemoProps {
    url: string;
    title: string;
  }

export default function DemoComponent({ url, title }: DemoProps) {
  return (
    <div>
      <script src="https://js.storylane.io/js/v1/storylane.js"></script>
      <div
        className="sl-embed"
        style={{
            textAlign: "center",
            padding: "1em",
            position: "relative",
            width: "100%",
            height: 0,
            paddingBottom: "56.25%",
        }}
      >
        <iframe
          className="sl-demo"
          src={url}
          name="sl-embed"
          allow="fullscreen"
          width="1280"
          height="800"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          title={title || "Storylane Demo"}
        ></iframe>
      </div>
    </div>
  );
}
