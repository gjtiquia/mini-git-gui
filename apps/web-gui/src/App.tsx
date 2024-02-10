import { OuterProvider } from "./providers/OuterProvider";
import { Root } from "./routes/Root";

function App() {
  return (
    <OuterProvider>
      <Root />
    </OuterProvider>
  )
}

export default App
