import { useState } from "react";
import { AssistantDrawer, CommandDock, Header } from "./components/Chrome";
import { ExploreScreen, GraphScreen, HomeScreen, ProjectsScreen } from "./components/Screens";
import { OntologyProvider } from "./ontology";
import { useAxialStore } from "./store";
import "./styles.css";

function CurrentScreen() {
  const activeTab = useAxialStore((state) => state.activeTab);
  if (activeTab === "Explore") return <ExploreScreen />;
  if (activeTab === "Graph") return <GraphScreen />;
  if (activeTab === "Projects") return <ProjectsScreen />;
  return <HomeScreen />;
}

export default function App() {
  const { theme, activeTab } = useAxialStore();
  const [assistant, setAssistant] = useState<{ query: string; isUrl: boolean } | null>(null);
  return (
    <OntologyProvider>
      <div className="app" data-theme={theme}>
        <Header />
        <div className="app-content"><CurrentScreen /></div>
        <CommandDock context={activeTab} onSubmit={(query, isUrl) => setAssistant({ query, isUrl })} />
        {assistant ? <AssistantDrawer query={assistant.query} isUrl={assistant.isUrl} onClose={() => setAssistant(null)} /> : null}
      </div>
    </OntologyProvider>
  );
}
