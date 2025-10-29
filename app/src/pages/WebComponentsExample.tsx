export default function WebComponentsExample() {
  return (
    <div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
      <iframe
        src="/examples/webcomponents-example.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Web Components Example"
      />
    </div>
  );
}
