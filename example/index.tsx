import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import SimpleExample from "./SimpleExample";
import ReactEchartsExample from "./ReactEchartsExample";
import DashboardExample from "./DashboardExample";

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
    gap: "15px",
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
    <h1>React ECharts Library Examples</h1>
    <p>
      Select an example from the navigation above to see different ways to use
      the library.
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
            Simple Example
          </Link>
          <Link to="/multiple" style={styles.link}>
            Multiple Charts
          </Link>
          <Link to="/dashboard" style={styles.link}>
            Dashboard
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/simple" element={<SimpleExample />} />
          <Route path="/multiple" element={<ReactEchartsExample />} />
          <Route path="/dashboard" element={<DashboardExample />} />
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
