import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Tab = "Home" | "Explore" | "Graph" | "Projects";

export type Project = {
  id: string;
  name: string;
  description: string;
  savedEntities: string[];
  notes: string[];
  updatedAt: string;
};

type AxialStore = {
  theme: "dark" | "light";
  activeTab: Tab;
  selectedEntityId: string;
  selectedNarrativeId: string;
  entityQuery: string;
  projects: Project[];
  setTheme: (theme: "dark" | "light") => void;
  setActiveTab: (tab: Tab) => void;
  openEntity: (id: string) => void;
  openNarrative: (id: string) => void;
  setEntityQuery: (query: string) => void;
  createProject: (name: string) => void;
  saveEntity: (projectId: string, entityId: string) => void;
  addNote: (projectId: string, note: string) => void;
};

export const useAxialStore = create<AxialStore>()(
  persist(
    (set) => ({
      theme: "dark",
      activeTab: "Home",
      selectedEntityId: "RUS0001",
      selectedNarrativeId: "ru-peace-victim-blame",
      entityQuery: "",
      projects: [
        {
          id: "russia-sanctions-review",
          name: "Russia sanctions review",
          description: "Entity-level review of the Russia regime and declared relationships.",
          savedEntities: ["RUS0001", "RUS0007", "RUS0010"],
          notes: ["Verify each relationship against its source record before publication."],
          updatedAt: "Today",
        },
        {
          id: "iran-nuclear-entities",
          name: "Iran nuclear entities",
          description: "Track designated organizations, people, and vessels in the nuclear regime.",
          savedEntities: ["IRN0001", "IRN0002"],
          notes: ["Separate designation facts from analytical inference."],
          updatedAt: "Yesterday",
        },
      ],
      setTheme: (theme) => set({ theme }),
      setActiveTab: (activeTab) => set({ activeTab }),
      openEntity: (selectedEntityId) => set({ selectedEntityId, activeTab: "Graph" }),
      openNarrative: (selectedNarrativeId) => set({ selectedNarrativeId, activeTab: "Explore" }),
      setEntityQuery: (entityQuery) => set({ entityQuery }),
      createProject: (name) =>
        set((state) => ({
          projects: [
            {
              id: `${Date.now()}`,
              name,
              description: "Research case",
              savedEntities: [],
              notes: [],
              updatedAt: "Just now",
            },
            ...state.projects,
          ],
        })),
      saveEntity: (projectId, entityId) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId && !project.savedEntities.includes(entityId)
              ? { ...project, savedEntities: [...project.savedEntities, entityId], updatedAt: "Just now" }
              : project,
          ),
        })),
      addNote: (projectId, note) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId
              ? { ...project, notes: [...project.notes, note], updatedAt: "Just now" }
              : project,
          ),
        })),
    }),
    { name: "axial-workspace-v3" },
  ),
);
