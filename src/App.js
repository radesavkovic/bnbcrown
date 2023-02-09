import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header/Header";
// import Footer from "./Components/Footer/Footer";
import Home from "./View/Home/Home";

import styles from "./App.module.scss";
import "antd/dist/antd.css";

const App = () => {
  return (
    <div className={styles.App}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
