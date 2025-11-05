export default function StandaloneExample() {
  return (
    <div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
      <iframe
        src="/examples/standalone-example.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Standalone Bundle Example"
      />
    </div>
  );
}
