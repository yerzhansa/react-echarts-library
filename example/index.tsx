import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import SimpleExample from "./SimpleExample";
import ReactEchartsExample from "./ReactEchartsExample";
import DashboardExample from "./DashboardExample";
import LoadingStateExample from "./LoadingStateExample";
import SVGRendererExample from "./SVGRendererExample";
import RefAccessExample from "./RefAccessExample";
import DynamicUpdateExample from "./DynamicUpdateExample";

const styles = {
  container: {
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
  },
  nav: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "10px",
    marginBottom: "20px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
  link: {
    textDecoration: "none",
    color: "#3398DB",
    padding: "8px 16px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    fontWeight: 500,
  },
  activeLink: {
    backgroundColor: "#e0e0e0",
  },
  homeContainer: {
    textAlign: "center" as const,
  },
};

const Home = () => (
  <div style={styles.homeContainer}>
    <h1>React ECharts Library v1.1.0</h1>
    <p>
      A modern React wrapper for Apache ECharts with TypeScript support, hooks,
      and full React 18/19 compatibility.
    </p>

    <div style={{ marginTop: "30px" }}>
      <h2>Installation</h2>
      <pre
        style={{
          display: "inline-block",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "5px",
          textAlign: "left",
        }}
      >
        npm install react-echarts-library echarts
      </pre>
    </div>

    <div style={{ marginTop: "30px", textAlign: "left", maxWidth: 600, margin: "30px auto" }}>
      <h2>New in v1.1.0</h2>
      <ul style={{ lineHeight: 1.8 }}>
        <li>
          <strong>Loading State</strong> - <code>showLoading</code> and{" "}
          <code>loadingOption</code> props
        </li>
        <li>
          <strong>Renderer Selection</strong> - Choose between Canvas and SVG
          with <code>opts</code>
        </li>
        <li>
          <strong>Ref Access</strong> - <code>getEchartsInstance()</code> via
          useRef
        </li>
        <li>
          <strong>Update Control</strong> - <code>notMerge</code>,{" "}
          <code>lazyUpdate</code>, <code>shouldSetOption</code>
        </li>
        <li>
          <strong>Container Resize</strong> - ResizeObserver for better
          responsiveness
        </li>
        <li>
          <strong>HTML Attributes</strong> - Pass <code>data-testid</code>,{" "}
          <code>aria-*</code>, etc.
        </li>
      </ul>
    </div>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          <Link to="/simple" style={styles.link}>
            Simple
          </Link>
          <Link to="/multiple" style={styles.link}>
            Charts
          </Link>
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
          <Link to="/loading" style={styles.link}>
            Loading
          </Link>
          <Link to="/renderer" style={styles.link}>
            SVG/Canvas
          </Link>
          <Link to="/ref" style={styles.link}>
            Ref Access
          </Link>
          <Link to="/dynamic" style={styles.link}>
            Dynamic
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simple" element={<SimpleExample />} />
          <Route path="/multiple" element={<ReactEchartsExample />} />
          <Route path="/dashboard" element={<DashboardExample />} />
          <Route path="/loading" element={<LoadingStateExample />} />
          <Route path="/renderer" element={<SVGRendererExample />} />
          <Route path="/ref" element={<RefAccessExample />} />
          <Route path="/dynamic" element={<DynamicUpdateExample />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
