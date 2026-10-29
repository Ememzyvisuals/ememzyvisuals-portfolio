// All site copy lives here. Rule: no em dashes, plain sentences.

export const profile = {
  name: "Emmanuel Ariyo",
  handle: "Ememzyvisuals",
  title: "Machine Learning Engineer",
  headline: "I build speech AI for African languages, the products around it, and games people actually play.",
  roles: ["ML Engineer", "Creative Developer", "Game Maker", "Founder of Axiveri"],
  location: "Nigeria",
  available: "Open to remote roles, research collaborations and freelance work.",
  email: "ememzyvisuals@gmail.com",
  photo: "/images/emmanuel.jpg",
  cv: "/emmanuel-ariyo-cv.pdf",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://ememzyvisuals.vercel.app",
  short:
    "Self-taught engineer from Nigeria. I train and ship speech and language models for Yoruba, Hausa, Igbo, Nigerian Pidgin and Nigerian English, and I build the web apps, tools and games that put them in people's hands.",
};

export const story = [
  "I never went to university for computer science and I never attended a bootcamp. I started with HTML, CSS and JavaScript from free tutorials, documentation and a lot of trial and error. My first real project, not a tutorial clone, gave me a feedback loop, and that loop became my education.",
  "The same curiosity pulled me into AI, and then into one gap in particular: language models and speech systems serve African languages badly. So I started building for that gap. Under Axiveri I train and publish open models: Africlaude for language, NaijaVox for speech recognition, WazobiaVoice for speech and voice cloning, and AfriVision for images.",
  "Today I work as a Machine Learning Engineer at PlotWeaver, building multilingual speech AI for Yoruba, Hausa, Igbo, Nigerian Pidgin and Nigerian English. Outside work I still ship products, automation tools and browser games.",
];

export const principles = [
  { title: "Ship before it is perfect", body: "Real users teach more in one week than months of planning." },
  { title: "Build for real constraints", body: "Slow networks and cheap phones make the product better for everyone." },
  { title: "Understand the tools", body: "I don't ship code I can't explain or fix." },
  { title: "AI as leverage", body: "It removes the repetitive work. It does not replace the thinking." },
];

export const pillars = [
  {
    key: "speech",
    title: "Speech and language AI",
    body: "Text to speech, voice cloning, speech recognition and translation for Nigerian languages. From dataset to training to a streaming API.",
    tags: ["TTS", "ASR", "Voice cloning", "Machine translation", "LoRA", "Whisper"],
  },
  {
    key: "products",
    title: "Products and automation",
    body: "Full-stack web apps, offline-first PWAs, bots and CLI agents. Built for slow networks and real users.",
    tags: ["Next.js", "TypeScript", "Supabase", "PWA", "Bots", "Agents"],
  },
  {
    key: "games",
    title: "Games",
    body: "Browser games set in Nigeria. I model, rig and animate the characters in Blender and build the games in three.js.",
    tags: ["three.js", "Blender", "Game design", "WebGL"],
  },
];

export const experience = [
  {
    role: "Machine Learning Engineer",
    company: "PlotWeaver",
    period: "Aug 2026 to present",
    mode: "Remote",
    summary:
      "Multilingual speech AI for African languages, built for production inference, real-time use and scalable APIs.",
    points: [
      "Built multilingual TTS for Nigerian English, Yoruba, Hausa, Igbo and Nigerian Pidgin.",
      "Added voice cloning that works across all five languages.",
      "Engineered streaming APIs so the speech models plug into voice agents and real-time apps.",
      "Fine-tuned small and large Whisper models for Nigerian speech, with noise augmentation for real-world audio.",
      "Built machine translation between English and Yoruba, Hausa, Igbo and Nigerian Pidgin.",
      "Worked across the whole pipeline: training, evaluation, inference speed, APIs and deployment.",
    ],
  },
  {
    role: "AI Engineer",
    company: "Renncora",
    period: "Contract",
    mode: "Remote",
    summary: "Renncora is a growing social media platform.",
    points: [
      "Built and deployed real-time speech-to-speech AI for Nigerian Pidgin. You speak Pidgin and get a natural Pidgin voice reply.",
      "Tuned the voice output to sound human in conversation.",
    ],
  },
  {
    role: "Founder",
    company: "Axiveri",
    period: "Ongoing",
    mode: "Open source",
    summary:
      "An open ecosystem of African language, speech and image models that other developers can build on.",
    points: [
      "Train and publish open models on Hugging Face under the Axiveri organisation.",
      "Publish datasets and benchmarks so others can measure and improve on the work.",
    ],
  },
];

export type Model = {
  slug: string;
  name: string;
  kind: string;
  line: string;
  details: string[];
  specs: string[];
  link: string;
  linkLabel: string;
  extraLinks?: { label: string; href: string }[];
  tone: string; // accent used on the 3D card
};

export const models: Model[] = [
  {
    slug: "naijavox",
    name: "NaijaVox",
    kind: "Speech recognition",
    line: "Whisper large-v3 fine-tuned with LoRA to transcribe Nigerian speech, including the way people really switch languages mid-sentence.",
    details: [
      "Covers Yoruba, Hausa, Igbo, Nigerian Pidgin and Nigerian-accented English.",
      "Version 2.0 adds SpecAugment and realistic noise augmentation. Pidgin reaches roughly 85% accuracy with strong code-switching.",
      "Two public versions: NaijaVox V1 and NaijaVox 2.0.",
    ],
    specs: ["ASR", "Whisper large-v3", "LoRA", "5 languages"],
    link: "https://huggingface.co/Axiveri/NaijaVox-2.0",
    linkLabel: "NaijaVox 2.0",
    extraLinks: [{ label: "NaijaVox V1", href: "https://huggingface.co/Axiveri/Naijavox-V1" }],
    tone: "#7dd3fc",
  },
  {
    slug: "wazobiavoice",
    name: "WazobiaVoice",
    kind: "Text to speech and voice cloning",
    line: "One model, five Nigerian languages. Reads text aloud in a natural voice and can clone a new voice from a short sample.",
    details: [
      "About 2B parameters, zero-shot voice cloning.",
      "Yoruba, Hausa, Igbo, Nigerian Pidgin and Nigerian English.",
      "Inference code is open on GitHub.",
    ],
    specs: ["~2B params", "Voice cloning", "5 languages"],
    link: "https://huggingface.co/Axiveri/WazobiaVoice",
    linkLabel: "Model on Hugging Face",
    extraLinks: [{ label: "Inference code", href: "https://github.com/Ememzyvisuals/wazobiavoice-TTS" }],
    tone: "#86efac",
  },
  {
    slug: "africlaude",
    name: "Africlaude",
    kind: "Language model",
    line: "A 7B language model for African developers. It knows Pidgin, USSD flows, Paystack and Flutterwave patterns and CBN compliance.",
    details: [
      "Built on Qwen2.5-Coder-7B-Instruct with progressive QLoRA fine-tuning.",
      "Measured on AfriclaudeBench, our own evaluation set.",
      "Version 2 is in development.",
    ],
    specs: ["7B params", "QLoRA", "Fintech", "Pidgin"],
    link: "https://huggingface.co/Axiveri/Africlaude-7B",
    linkLabel: "Model on Hugging Face",
    tone: "#fca5a5",
  },
  {
    slug: "afrivision",
    name: "AfriVision",
    kind: "Image generation",
    line: "A FLUX LoRA trained on about 15,000 captioned images so generated pictures show African people, places and life correctly.",
    details: ["FLUX base model with a LoRA fine-tune.", "Trained on roughly 15,000 captioned images."],
    specs: ["FLUX", "LoRA", "15k images"],
    link: "https://huggingface.co/Axiveri/AfriVision-Base",
    linkLabel: "Model on Hugging Face",
    tone: "#fcd34d",
  },
];

export const research = {
  name: "TruthGuard",
  line: "A 120-question benchmark that checks whether a language model knows when it is wrong.",
  body: "Every question needs an answer and a confidence score. TruthGuard measures calibration error, how often the model is confidently wrong, and whether its confidence predicts correctness at all. Models were most overconfident on the trick and trap questions, sometimes by 20 to 30 points.",
  tiers: ["Easy", "Tricky", "Hard / Trap"],
  metrics: ["Calibration error", "Overconfidence rate", "Confidence vs accuracy"],
  links: [
    { label: "Notebook", href: "https://www.kaggle.com/code/ememzyvisuals/truthguard-benchmark-metacognition-evaluation" },
    { label: "Dataset", href: "https://www.kaggle.com/datasets/ememzyvisuals/truthguard-benchmark-metacognition" },
  ],
  license: "CC BY-SA 4.0",
  blog: "/blogs/truthguard",
};

export type Game = {
  slug: string;
  name: string;
  genre: string;
  line: string;
  body: string;
  facts: string[];
  play: string;
  links: { label: string; href: string }[];
  image?: string;
  tone: string;
};

export const games: Game[] = [
  {
    slug: "buka-hustle",
    name: "Bùkà Hustle",
    genre: "3D business sim",
    line: "Start with a roadside bùkà in Lagos and grow it into a full restaurant.",
    body: "Cook jollof, serve customers, buy water, wash pots, hire staff and survive NEPA cuts and empty gas bottles. Free, no forced ads and no energy timers. Plays on phone, tablet and laptop.",
    facts: ["Characters modelled, rigged and animated by me in Blender", "Voices by PlotWeaver", "Browser, no download"],
    play: "https://bukahustle.vercel.app/",
    links: [{ label: "Trailer on X", href: "https://x.com/ememzyvisuals/status/2114054279443136786" }],
    image: "/images/games/buka-hustle.webp",
    tone: "#f59e0b",
  },
  {
    slug: "last-bus",
    name: "LAST BUS",
    genre: "First-person horror",
    line: "11:41 PM, Yaba, rainy season. The last danfo to Ikorodu.",
    body: "Eight strangers and one empty seat nobody will sit in. The road keeps repeating and your phone clock is stuck at 11:42. Find the clues, make your choices and reach one of several endings. Best with headphones in a dark room. 18+.",
    facts: ["Built with three.js", "Voices by PlotWeaver", "Multiple endings and leaderboards"],
    play: "https://lastbus.vercel.app/",
    links: [
      { label: "itch.io", href: "https://ememzyvisuals.itch.io/last-bus" },
      { label: "GamePix", href: "https://www.gamepix.com/play/last-bus" },
      { label: "Trailer on X", href: "https://x.com/ememzyvisuals/status/2109012585903182282" },
    ],
    tone: "#ef4444",
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: "web" | "mobile" | "automation";
  group: string;
  line: string;
  problem: string;
  features: string[];
  stack: string[];
  live?: string;
  repo?: string;
  extra?: { label: string; href: string }[];
  web?: string;
  mobile?: string[];
  logo?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "claudgpt",
    name: "ClaudGPT",
    kind: "web",
    group: "AI products",
    line: "A team of 9 AI agents that plans, writes, debugs and reviews full-stack apps from a plain description.",
    problem: "Most AI coding tools give one-shot suggestions you still have to wire together. ClaudGPT runs the whole build and hands back a finished, exportable project.",
    features: [
      "Planner, architect, coder, debugger and reviewer agents in one pipeline",
      "Live preview in the browser and full project export",
      "Groq key rotation with automatic failover",
      "Real-time streaming with Server-Sent Events",
    ],
    stack: ["Next.js 14", "TypeScript", "Groq", "Supabase", "Docker", "SSE"],
    live: "https://claudgpt.vercel.app",
    repo: "https://github.com/Ememzyvisuals/ClaudGPT",
    web: "/images/projects/claudgpt-web.png",
    featured: true,
  },
  {
    slug: "aethlife",
    name: "AethLife",
    kind: "web",
    group: "AI products",
    line: "A personal life OS that links workouts, spending, habits and energy, then uses AI to show how they affect each other.",
    problem: "Trackers live in separate apps and never connect the dots. AethLife puts four areas of life in one place and finds the patterns between them.",
    features: [
      "Four trackers in one app with AI insights across them",
      "15+ table Postgres schema with row level security",
      "Works offline as a PWA with IndexedDB sync",
      "Push notifications with Firebase Cloud Messaging",
    ],
    stack: ["Next.js 15", "TypeScript", "Supabase", "Groq Vision", "LLaMA 70B", "PWA"],
    live: "https://aethlife.vercel.app",
    repo: "https://github.com/Ememzyvisuals/aethlife",
    web: "/images/projects/aethlife-web.png",
    featured: true,
  },
  {
    slug: "flonextv",
    name: "FlonexTV",
    kind: "web",
    group: "Platforms",
    line: "Movies, series and an academy in one app. Learners take courses and exams, submit tasks and earn certificates.",
    problem: "People wanted entertainment and structured, verifiable learning in the same place.",
    features: [
      "Streaming catalogue powered by TMDB",
      "Academy with courses, lessons, exams and certificates",
      "AI review of practical tasks and instructor verification",
      "Mobile-first design",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "TMDB API"],
    live: "https://flonextv.vercel.app",
    repo: "https://github.com/Ememzyvisuals/flonextv",
    web: "/images/projects/flonextv-web.png",
    mobile: ["/images/projects/flonextv-mobile1.png", "/images/projects/flonextv-mobile2.png"],
    featured: true,
  },
  {
    slug: "naijaprep",
    name: "NaijaPrep",
    kind: "web",
    group: "Education",
    line: "Exam prep for JAMB, WAEC and NECO that keeps working with no internet at all.",
    problem: "Many students study where the network is unreliable. NaijaPrep downloads once and then works fully offline.",
    features: [
      "Practice questions, mock exams, notes and flashcards",
      "AI tutor, daily challenge and streaks",
      "Exam countdowns",
      "Installable PWA on any device",
    ],
    stack: ["React", "TypeScript", "Vite", "Service Workers", "IndexedDB", "PWA"],
    live: "https://naijaprep.netlify.app",
    repo: "https://github.com/Ememzyvisuals/naijaprep",
    web: "/images/projects/naijaprep-web.png",
    mobile: ["/images/projects/naijaprep-mobile.png"],
    featured: true,
  },
  {
    slug: "studenthub-ng",
    name: "StudentHub NG",
    kind: "web",
    group: "Education",
    line: "An online study platform for Nigerian students with mock exams, analytics and streaks.",
    problem: "Students needed more than question banks. They needed to see their progress and stay consistent.",
    features: ["Practice exams, mock tests and flashcards", "Accuracy and progress dashboard", "Streak tracking", "Dark and light mode"],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    live: "https://studenthub-ng.vercel.app",
    repo: "https://github.com/Ememzyvisuals/studenthub-ng",
    web: "/images/projects/studenthub-web.png",
  },
  {
    slug: "storejet",
    name: "StoreJet",
    kind: "web",
    group: "Commerce",
    line: "Small Nigerian vendors get a clean online store in about a minute, with orders going straight to WhatsApp.",
    problem: "Most vendors have no budget for a developer and no time to learn an e-commerce platform.",
    features: ["Store setup in under a minute", "Product catalogue with categories", "Orders sent directly to WhatsApp"],
    stack: ["React", "Tailwind CSS", "Firebase", "Docker"],
    live: "https://storejet-ng.netlify.app",
    web: "/images/projects/storejet-web.png",
  },
  {
    slug: "nairanest",
    name: "NairaNest",
    kind: "web",
    group: "Fintech",
    line: "A realistic digital banking simulation: accounts, transfers, bill payments and live transaction history.",
    problem: "A demo of what a modern Nigerian banking app can feel like, designed around how Nigerians handle money.",
    features: ["Account management and balances", "Transfer and bill payment flows", "Real-time activity log"],
    stack: ["React", "TypeScript", "Firebase", "Tailwind CSS", "Docker"],
    live: "https://nairanest.netlify.app",
    web: "/images/projects/nairanest-web.png",
  },
  {
    slug: "ar-toluwani-store",
    name: "A.R. Toluwani Store",
    kind: "web",
    group: "Commerce",
    line: "An e-commerce store for home appliances, kitchen utensils and household goods, with promotions and local delivery.",
    problem: "A real shop needed to sell online with categories, promos and delivery options.",
    features: ["Full catalogue by category", "Promotions and discounts", "Cart, checkout and local delivery"],
    stack: ["React", "Next.js", "Tailwind CSS"],
    live: "https://ar-toluwani-store.netlify.app",
    repo: "https://github.com/Ememzyvisuals/AR-TOLUWANI-STORE",
    web: "/images/projects/artoluwani-web.png",
  },
  {
    slug: "ekklesia",
    name: "Ekklesia",
    kind: "mobile",
    group: "Mobile",
    line: "An offline-first Bible app in five languages, with audio, sermons, live radio, an AI assistant and Bible games.",
    problem: "Church members wanted the Bible, sermons and devotionals in their own language, even with no data.",
    features: [
      "Full Bible in five languages, downloaded once for offline reading",
      "Audio playback with verse highlighting",
      "Live radio and a sermon library",
      "AI assistant for prayer and devotionals, plus offline quiz and word search",
    ],
    stack: ["Android", "Offline-first", "Groq", "5 languages"],
    repo: "https://github.com/Ememzyvisuals/Ekklesia-App/",
    mobile: ["/images/projects/felicia-home.png", "/images/projects/felicia-bible.png", "/images/projects/felicia-ai.png"],
    featured: true,
  },
  {
    slug: "lumeo-ai",
    name: "Lumeo AI",
    kind: "automation",
    group: "Automation",
    line: "An AI assistant inside Telegram: image generation, downloads, voice notes, PDFs, group tools, mini games and Stars payments.",
    problem: "People wanted one assistant inside the chat app they already use.",
    features: ["Conversational AI with tools", "Sandboxed execution with Docker", "Mini App with games", "Telegram Stars payments"],
    stack: ["Python", "Groq", "python-telegram-bot", "Docker"],
    live: "https://t.me/lumeoai_bot",
    repo: "https://github.com/Ememzyvisuals/LUMEO-A.I",
    mobile: ["/images/automation/lumeo-intro.png", "/images/automation/lumeo-chat1.png", "/images/automation/lumeo-chat2.png"],
  },
  {
    slug: "microdragon",
    name: "Microdragon",
    kind: "automation",
    group: "Automation",
    line: "A local-first AI agent for the terminal. Give it a task in plain language and it plans and runs it.",
    problem: "I wanted an agent that runs on my own machine with local models, and falls back to cloud models when needed.",
    features: ["Code generation and desktop automation", "Local models with Ollama, cloud providers optional", "Published on npm"],
    stack: ["Rust", "Python", "Node.js", "Ollama", "Playwright"],
    repo: "https://github.com/Ememzyvisuals/microdragon",
    extra: [{ label: "npm", href: "https://npmjs.com/package/@ememzyvisuals/microdragon" }],
    logo: "/images/automation/microdragon-logo.png",
  },
];

export const stack = [
  { group: "AI and ML", items: ["Python", "PyTorch", "Transformers", "Hugging Face", "Whisper", "LoRA / QLoRA", "Unsloth", "CUDA", "Gradio", "Groq", "Ollama", "Pandas", "NumPy"] },
  { group: "Frontend", items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "three.js", "React Three Fiber", "Vite", "PWA"] },
  { group: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Supabase", "Firebase", "Prisma", "Docker", "REST", "SSE"] },
  { group: "Tools", items: ["Git", "GitHub", "Blender", "Figma", "Playwright", "Vercel", "AWS EC2", "Rust"] },
];

export type Certificate = {
  slug: string;
  course: string;
  issuer: "Kaggle" | "IBM SkillsBuild" | "DeepLearning.AI";
  taught: string;
  skills: string[];
  verify: string;
  image: string;
};

export const certificates: Certificate[] = [
  {
    slug: "intro-ml",
    course: "Intro to Machine Learning",
    issuer: "Kaggle",
    taught: "This course taught me the full loop of a first model: load the data, fit a tree, check it on data it has not seen, and know when it is overfitting.",
    skills: ["Decision trees", "Random forests", "Model validation", "Overfitting and underfitting"],
    verify: "https://www.kaggle.com/learn/certification/ememzyvisuals/intro-to-machine-learning",
    image: "/certificates/intro-ml.webp",
  },
  {
    slug: "intermediate-ml",
    course: "Intermediate Machine Learning",
    issuer: "Kaggle",
    taught: "This course taught me to handle messy real data properly and to stop my own pipeline from leaking the answer into training.",
    skills: ["Missing values", "Categorical encoding", "Pipelines", "Cross-validation", "XGBoost", "Data leakage"],
    verify: "https://www.kaggle.com/learn/certification/ememzyvisuals/intermediate-machine-learning",
    image: "/certificates/intermediate-ml.webp",
  },
  {
    slug: "feature-engineering",
    course: "Feature Engineering",
    issuer: "Kaggle",
    taught: "This course taught me to find which features matter and to build new ones that make a model's job easier.",
    skills: ["Mutual information", "Creating features", "K-means features", "PCA", "Target encoding"],
    verify: "https://www.kaggle.com/learn/certification/ememzyvisuals/feature-engineering",
    image: "/certificates/feature-engineering.webp",
  },
  {
    slug: "ml-explainability",
    course: "Machine Learning Explainability",
    issuer: "Kaggle",
    taught: "This course taught me to look inside a model and see why it made a decision before I trust it.",
    skills: ["Permutation importance", "Partial dependence plots", "SHAP values"],
    verify: "https://www.kaggle.com/learn/certification/ememzyvisuals/machine-learning-explainability",
    image: "/certificates/ml-explainability.webp",
  },
  {
    slug: "intro-dl",
    course: "Intro to Deep Learning",
    issuer: "Kaggle",
    taught: "This course taught me how neural networks learn and how to keep them from memorising the training data.",
    skills: ["Neural networks with Keras", "Stochastic gradient descent", "Dropout", "Batch normalization", "Binary classification"],
    verify: "https://www.kaggle.com/learn/certification/adeshinappl/intro-to-deep-learning",
    image: "/certificates/intro-dl.webp",
  },
  {
    slug: "computer-vision",
    course: "Computer Vision",
    issuer: "Kaggle",
    taught: "This course taught me how convolutional networks see images, and how to reuse a pretrained model instead of starting from zero.",
    skills: ["Convolution and ReLU", "Max pooling", "Custom convnets", "Data augmentation", "Transfer learning"],
    verify: "https://www.kaggle.com/learn/certification/ememzyvisuals/computer-vision",
    image: "/certificates/computer-vision.webp",
  },
  {
    slug: "ibm-ai-fundamentals",
    course: "AI Fundamentals: Foundations for Understanding AI",
    issuer: "IBM SkillsBuild",
    taught: "This course gave me a clear map of the whole field, from machine learning to language and vision, and how to use AI responsibly.",
    skills: ["Core AI concepts", "Machine learning basics", "NLP", "Computer vision", "AI ethics"],
    verify: "https://www.credly.com/badges/60b14c96-b18c-47c8-9386-9843f292fb6e/public_url",
    image: "/certificates/ibm-ai-fundamentals.webp",
  },
];

export const socials = [
  { key: "github", label: "GitHub", href: "https://github.com/Ememzyvisuals" },
  { key: "x", label: "X", href: "https://x.com/ememzyvisuals" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/ememzyvisuals" },
  { key: "huggingface", label: "Hugging Face", href: "https://huggingface.co/Axiveri" },
  { key: "kaggle", label: "Kaggle", href: "https://www.kaggle.com/ememzyvisuals" },
  { key: "itch", label: "itch.io", href: "https://ememzyvisuals.itch.io" },
  { key: "instagram", label: "Instagram", href: "https://instagram.com/ememzyvisuals" },
  { key: "whatsapp", label: "WhatsApp", href: "https://wa.me/qr/QUUU65XM56E7J1" },
] as const;

export const moreLinks = [
  { label: "Personal Hugging Face", href: "https://huggingface.co/ememzyvisuals" },
  { label: "Facebook", href: "https://facebook.com/Ememzyvisuals" },
  { label: "npm", href: "https://npmjs.com/package/@ememzyvisuals/microdragon" },
];

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Models", href: "/models" },
  { label: "Games", href: "/games" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];
