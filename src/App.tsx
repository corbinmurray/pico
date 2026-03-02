import { Editor } from "@/pages/Editor";
import { Viewer } from "@/pages/Viewer";
import {
  AppLayout,
  Footer,
  Header,
  Toaster,
} from "@corbinmurray/ui-components";
import { AnimatePresence, motion } from "motion/react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";

export function App() {
  const appName = "pico";
  const header = <Header appName={appName} />;
  const layoutFooter = <Footer appName={appName} />;

  return (
    <HashRouter>
      <AppLayout header={header} footer={layoutFooter}>
        <AnimatedRoutes />
      </AppLayout>
      <Toaster />
    </HashRouter>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <Editor />
            </motion.div>
          }
        />
        <Route
          path="/view/:content"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="py-10"
            >
              <Viewer />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
