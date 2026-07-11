export const documents = [
  {
    id: 1,
    title: "API Documentation",
    updated: "10 mins ago",
    collaborators: [
      { id: 1, name: "Sankalp", avatar: "S" },
      { id: 2, name: "Aryan", avatar: "A" },
      { id: 3, name: "Rahul", avatar: "R" },
    ],
  },
  {
    id: 2,
    title: "Database Schema",
    updated: "30 mins ago",
    collaborators: [
      { id: 1, name: "Sankalp", avatar: "S" },
      { id: 4, name: "Priya", avatar: "P" },
    ],
  },
  {
    id: 3,
    title: "Sprint Planning",
    updated: "2 hours ago",
    collaborators: [
      { id: 2, name: "Aryan", avatar: "A" },
      { id: 3, name: "Rahul", avatar: "R" },
    ],
  },
  {
    id: 4,
    title: "Meeting Notes",
    updated: "Yesterday",
    collaborators: [
      { id: 1, name: "Sankalp", avatar: "S" },
    ],
  },
];

export const workspace = {
  id: 1,
  name: "QuillSync Team",
  description: "Collaborative knowledge base, design specs, roadmap, and database models.",
};

export const members = [
  { id: 1, name: "Sankalp", email: "sankalp@quillsync.com", role: "Owner" },
  { id: 2, name: "Aryan", email: "aryan@quillsync.com", role: "Editor" },
  { id: 3, name: "Rahul", email: "rahul@quillsync.com", role: "Editor" },
  { id: 4, name: "Priya", email: "priya@quillsync.com", role: "Viewer" },
];

export const activities = [
  {
    id: 1,
    message: "Sankalp updated the Database Schema documentation",
    time: "10 mins ago",
  },
  {
    id: 2,
    message: "Aryan joined the workspace",
    time: "1 hour ago",
  },
  {
    id: 3,
    message: "Rahul created Sprint Planning document",
    time: "2 hours ago",
  },
  {
    id: 4,
    message: "Priya commented on Database Schema",
    time: "Yesterday",
  },
];