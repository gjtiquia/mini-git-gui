import { ThemeProvider } from "@/providers/ThemeProvider";
import { Root } from "@/routes/Root";

function App() {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Root />
    </ThemeProvider>
  )
}

export default App
