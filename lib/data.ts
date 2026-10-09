export const tracksData = [
  {
    slug: "ai-data",
    title: "AI & Data",
    description: "Explore practical AI concepts and experiments. From prompt engineering to model evaluation, build real AI-powered applications.",
    coursesCount: 8,
    duration: "2h 40m",
    icon: "BookOpen",
    color: "#0078d4",
    featured: true,
    gradient: "linear-gradient(135deg, #0078d4 0%, #00c7e8 100%)",
  },
  {
    slug: "software-development",
    title: "Software Development",
    description: "Build interfaces, products, and useful tools. Modern web development, TypeScript, React, and production-ready practices.",
    coursesCount: 12,
    duration: "6h 10m",
    icon: "Code2",
    color: "#00b7d3",
    gradient: "linear-gradient(135deg, #00b7d3 0%, #0078d4 100%)",
  },
  {
    slug: "cloud",
    title: "Cloud",
    description: "Understand modern infrastructure and cloud systems. Azure fundamentals, containerization, and scalable architectures.",
    coursesCount: 6,
    duration: "3h 25m",
    icon: "Cloud",
    color: "#5c2d91",
    gradient: "linear-gradient(135deg, #5c2d91 0%, #0078d4 100%)",
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity",
    description: "Learn foundations of secure digital systems. Threat modeling, secure development, and defensive security practices.",
    coursesCount: 7,
    duration: "4h 05m",
    icon: "ShieldCheck",
    color: "#ffb900",
    gradient: "linear-gradient(135deg, #ffb900 0%, #ff8c00 100%)",
  },
];

export const coursesData = [
  {
    slug: "applied-ai-foundations",
    title: "Applied AI Foundations",
    track: "AI & Data",
    trackSlug: "ai-data",
    description: "A practical introduction to modern AI. Learn the mental models, experiment with tools, and understand what good AI-assisted work looks like.",
    lessonsCount: 8,
    duration: "2h 40m",
    level: "Beginner",
    thumbnail: null,
    featured: true,
    color: "#0078d4",
  },
  {
    slug: "modern-web-builder",
    title: "Modern Web Builder",
    track: "Software Development",
    trackSlug: "software-development",
    description: "Build production-ready web applications with modern tooling, TypeScript, and best practices.",
    lessonsCount: 10,
    duration: "3h 15m",
    level: "Intermediate",
    thumbnail: null,
    color: "#00b7d3",
  },
  {
    slug: "cloud-concepts-clearly",
    title: "Cloud Concepts, Clearly",
    track: "Cloud",
    trackSlug: "cloud",
    description: "Demystify cloud infrastructure. Learn core concepts, services, and deployment patterns.",
    lessonsCount: 7,
    duration: "2h 05m",
    level: "Beginner",
    thumbnail: null,
    color: "#5c2d91",
  },
  {
    slug: "cybersecurity-essentials",
    title: "Cybersecurity Essentials",
    track: "Cybersecurity",
    trackSlug: "cybersecurity",
    description: "Fundamentals of digital security, threat modeling, and secure development practices.",
    lessonsCount: 9,
    duration: "3h 20m",
    level: "Beginner",
    thumbnail: null,
    color: "#ffb900",
  },
  {
    slug: "python-for-projects",
    title: "Python for Projects",
    track: "Software Development",
    trackSlug: "software-development",
    description: "Learn Python through building real projects. From scripts to data tools to web backends.",
    lessonsCount: 12,
    duration: "4h 10m",
    level: "Beginner",
    thumbnail: null,
    color: "#00b7d3",
  },
  {
    slug: "computer-vision-basics",
    title: "Computer Vision Basics",
    track: "AI & Data",
    trackSlug: "ai-data",
    description: "Introduction to computer vision concepts, OpenCV, and practical image processing.",
    lessonsCount: 8,
    duration: "2h 55m",
    level: "Intermediate",
    thumbnail: null,
    color: "#0078d4",
  },
];

export const lessonsData = [
  { slug: "introduction", title: "Welcome & the AI Landscape", duration: "08:40", type: "video" },
  { slug: "thinking-in-models", title: "Thinking in Models", duration: "18:20", type: "video" },
  { slug: "prompting-as-design", title: "Prompting as a Design Skill", duration: "22:10", type: "video" },
  { slug: "structured-output", title: "Working with Structured Output", duration: "19:45", type: "video" },
  { slug: "small-ai-experiment", title: "A Small AI Experiment", duration: "24:30", type: "video" },
  { slug: "evaluating-builds", title: "Evaluating What You Build", duration: "16:50", type: "video" },
  { slug: "responsible-use", title: "Responsible Use", duration: "14:20", type: "video" },
  { slug: "next-steps", title: "Next Steps", duration: "12:10", type: "video" },
];

export const eventsData = [
  {
    slug: "build-night",
    title: "Build Night: From Idea to Prototype",
    description: "Bring an idea, meet other builders, and leave with a clearer next step. This hands-on session guides you from concept to working prototype in one evening.",
    date: "2026-10-18",
    time: "18:00",
    location: "MNU Campus, Building A",
    category: "Workshop",
    featured: true,
    demo: true,
    color: "#0078d4",
  },
  {
    slug: "ai-builders-meetup",
    title: "AI Builders Meetup",
    description: "Connect with fellow AI enthusiasts. Share projects, discuss trends, and find collaborators.",
    date: "2026-11-02",
    time: "17:30",
    location: "MNU Campus, Innovation Hub",
    category: "Meetup",
    demo: true,
    color: "#00c7e8",
  },
  {
    slug: "git-open-source-night",
    title: "Git & Open Source Night",
    description: "Learn Git workflows, contribute to open source, and understand collaboration tools.",
    date: "2026-11-16",
    time: "18:00",
    location: "MNU Campus, Building B",
    category: "Workshop",
    demo: true,
    color: "#5c2d91",
  },
];

export const projectsData = [
  {
    slug: "visionlab",
    title: "VisionLab",
    description: "Computer vision experiments for students. A collection of practical CV demos including object detection, image segmentation, and real-time processing.",
    longDescription: "VisionLab is a student-led project exploring computer vision through hands-on experiments. The project includes interactive demos for object detection using YOLO, image segmentation with SAM, and real-time video processing pipelines. Built as a learning resource for MCC members to understand modern CV techniques.",
    technologies: ["Python", "OpenCV", "PyTorch", "YOLOv8"],
    category: "AI & Computer Vision",
    featured: true,
    demo: true,
    thumbnail: null,
    githubUrl: "#",
    demoUrl: "#",
    color: "#0078d4",
  },
  {
    slug: "campusos",
    title: "CampusOS",
    description: "A student-focused digital community concept. CampusOS reimagines how students discover events, find study partners, and access campus resources.",
    longDescription: "CampusOS is a prototype for a unified student platform. It combines event discovery, study group matching, resource sharing, and campus navigation into a single cohesive experience. The project explores modern React patterns, real-time features, and inclusive design.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    category: "Full Stack Web",
    demo: true,
    thumbnail: null,
    githubUrl: "#",
    demoUrl: "#",
    color: "#00b7d3",
  },
  {
    slug: "medtech-monitor",
    title: "MedTech Monitor",
    description: "A prototype for visualizing biomedical signals. Real-time ECG and EEG data visualization with anomaly detection.",
    longDescription: "MedTech Monitor explores biomedical signal processing and visualization. The project implements real-time ECG/EEG rendering, noise filtering, and basic anomaly detection algorithms. Built for a university hackathon focused on health tech.",
    technologies: ["Python", "NumPy", "SciPy", "Plotly", "FastAPI"],
    category: "Health Tech & Data Viz",
    demo: true,
    thumbnail: null,
    githubUrl: "#",
    demoUrl: "#",
    color: "#5c2d91",
  },
];

export const opportunitiesData = [
  {
    slug: "campus-ai-challenge",
    title: "Campus AI Challenge",
    type: "Hackathon",
    date: "2026-10-24",
    description: "Build an AI-powered solution for campus life. Prizes include mentorship, cloud credits, and showcase opportunities.",
    deadline: "2026-10-20",
    link: "#",
    demo: true,
    color: "#0078d4",
  },
  {
    slug: "student-cloud-sprint",
    title: "Student Cloud Sprint",
    type: "Competition",
    date: "2026-11-02",
    description: "Deploy and scale a cloud-native application. Learn AWS/Azure/GCP through a guided challenge.",
    deadline: "2026-10-28",
    link: "#",
    demo: true,
    color: "#00b7d3",
  },
  {
    slug: "open-source-starter-week",
    title: "Open Source Starter Week",
    type: "Community",
    date: "2026-11-16",
    description: "A week-long program to make your first open source contributions. Guided by maintainers.",
    deadline: "2026-11-10",
    link: "#",
    demo: true,
    color: "#5c2d91",
  },
];

export const resourcesData = [
  {
    title: "Microsoft Learn",
    category: "Learning",
    description: "Use Microsoft Learn as a reference for technical concepts and guided training paths.",
    link: "https://learn.microsoft.com",
    external: true,
    icon: "BookOpen",
  },
  {
    title: "GitHub",
    category: "Development",
    description: "Explore repositories, documentation, and open-source workflows on the world's largest code host.",
    link: "https://github.com",
    external: true,
    icon: "Code2",
  },
  {
    title: "Fluent 2 Design System",
    category: "Design",
    description: "Reference Microsoft's design language and interface patterns for building coherent experiences.",
    link: "https://fluent2.microsoft.design",
    external: true,
    icon: "Layers",
  },
  {
    title: "MCC Learning Resources",
    category: "MCC MNU",
    description: "A future home for approved MCC materials, curated links, and community-contributed guides.",
    link: "/resources/mcc",
    external: false,
    icon: "Globe",
  },
];

export function formatDate(dateString: string): { day: string; month: string; year: string; full: string } {
  const date = new Date(dateString);
  return {
    day: date.getDate().toString().padStart(2, "0"),
    month: date.toLocaleString("en-US", { month: "short" }),
    year: date.getFullYear().toString(),
    full: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
  };
}

export function getTrackBySlug(slug: string) {
  return tracksData.find((t) => t.slug === slug);
}

export function getCourseBySlug(slug: string) {
  return coursesData.find((c) => c.slug === slug);
}

export function getEventBySlug(slug: string) {
  return eventsData.find((e) => e.slug === slug);
}

export function getProjectBySlug(slug: string) {
  return projectsData.find((p) => p.slug === slug);
}

export function getOpportunityBySlug(slug: string) {
  return opportunitiesData.find((o) => o.slug === slug);
}

export function getCoursesByTrack(trackSlug: string) {
  return coursesData.filter((c) => c.trackSlug === trackSlug);
}

export function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const index = lessonsData.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;
  return { ...lessonsData[index], index, total: lessonsData.length };
}

export function getAdjacentLessons(courseSlug: string, lessonSlug: string) {
  const index = lessonsData.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? lessonsData[index - 1] : null,
    next: index < lessonsData.length - 1 ? lessonsData[index + 1] : null,
  };
}