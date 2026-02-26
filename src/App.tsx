import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { Editor } from "@/pages/Editor";
import { Viewer } from "@/pages/Viewer";
import { AnimatePresence, motion } from "motion/react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";

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
            >
              <Viewer />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <HashRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
      <Toaster />
    </HashRouter>
  );
}

export default App;
