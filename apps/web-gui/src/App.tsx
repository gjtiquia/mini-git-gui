import { OuterProvider } from "@/providers/OuterProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Root } from "@/routes/Root";

function App() {
  return (
    <OuterProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Root />
      </ThemeProvider>
    </OuterProvider>
  )
}

export default App
