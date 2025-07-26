const { v4: uuid } = require("uuid");
const WebSocket = require("ws");
const { startGeminiChat } = require("../gemini/chat.js");
const ChatHist = require("../model/ChatHist.js");
const querystring = require("querystring");
const spellchecker = require("spellchecker");

function correctSpelling(text) {
  return text
    .split(/\b/)
    .map((word) =>
      spellchecker.isMisspelled(word)
        ? spellchecker.getCorrectionsForMisspelling(word)[0] || word
        : word
    )
    .join("");
}

const mentalHealthKeywords = [
  
  "abuse",
  "acceptance",
  "addiction",
  "adolescent therapy",
  "adult therapy",
  "advocacy",
  "agoraphobia",
  "alcoholism",
  "alternative therapy",
  "anger management",
  "animal-assisted therapy",
  "anorexia",
  "anxiety",
  "art therapy",
  "assertiveness training",
  "attachment issues",
  "attention deficit disorder",
  "autism",
  "behavioral therapy",
  "bereavement",
  "bipolar disorder",
  "body image",
  "borderline personality disorder",
  "bulimia",
  "burnout",
  "career counseling",
  "caring for caregivers",
  "caring for children",
  "caring for elders",
  "child therapy",
  "clinical depression",
  "cognitive behavioral therapy",
  "communication skills",
  "compassion fatigue",
  "compulsive behavior",
  "conflict resolution",
  "consciousness",
  "coping mechanisms",
  "counseling",
  "creativity",
  "crisis intervention",
  "depression",
  "developmental disorders",
  "dialectical behavior therapy",
  "divorce counseling",
  "domestic violence",
  "drug abuse",
  "eating disorders",
  "educational psychology",
  "elder care",
  "emotional abuse",
  "emotional health",
  "emotional intelligence",
  "emotional regulation",
  "empathy",
  "energy psychology",
  "existential therapy",
  "family therapy",
  "fear",
  "financial stress",
  "forgiveness",
  "grief",
  "group therapy",
  "guided imagery",
  "happiness",
  "health psychology",
  "holistic health",
  "humanistic therapy",
  "hypnotherapy",
  "identity issues",
  "imposter syndrome",
  "infidelity",
  "insomnia",
  "interpersonal therapy",
  "intimacy issues",
  "job stress",
  "life coaching",
  "loneliness",
  "loss",
  "love",
  "marriage counseling",
  "medication management",
  "meditation",
  "mental health",
  "mental illness",
  "midlife crisis",
  "mindfulness",
  "mood disorders",
  "motivation",
  "narcissistic personality disorder",
  "neurofeedback",
  "neuropsychology",
  "obsessive-compulsive disorder",
  "occupational therapy",
  "panic attacks",
  "paranoia",
  "parenting",
  "peer pressure",
  "perfectionism",
  "personality disorders",
  "phobias",
  "physical abuse",
  "play therapy",
  "postpartum depression",
  "post-traumatic stress disorder",
  "psychodynamic therapy",
  "psychological abuse",
  "psychological well-being",
  "psychotherapy",
  "ptsd",
  "racism",
  "relationship issues",
  "relaxation techniques",
  "resilience",
  "retirement",
  "schizophrenia",
  "self-acceptance",
  "self-care",
  "self-compassion",
  "self-confidence",
  "self-esteem",
  "self-harm",
  "self-help",
  "separation anxiety",
  "sexual abuse",
  "sexual health",
  "sexuality",
  "sleep disorders",
  "social anxiety",
  "social skills",
  "spirituality",
  "stress",
  "stress management",
  "substance abuse",
  "suicidal thoughts",
  "support groups",
  "teen therapy",
  "teletherapy",
  "therapy",
  "trauma",
  "trust issues",
  "values",
  "well-being",
  "work-life balance",
  "worry",
  "yoga",
  "zoloft",
  // Additional Keywords
  "acceptance and commitment therapy",
  "adaptability",
  "addictive behavior",
  "affect regulation",
  "affection",
  "aftercare",
  "aggression",
  "aides",
  "altruism",
  "ambivalence",
  "anger",
  "animal therapy",
  "anorexia nervosa",
  "anticipatory anxiety",
  "anti-depressants",
  "antipsychotic medication",
  "anxiety disorders",
  "anxiolytics",
  "apathy",
  "applied behavior analysis",
  "attachment disorder",
  "attention",
  "autogenic training",
  "autonomy",
  "aversion therapy",
  "avoidance behavior",
  "balanced diet",
  "behavior modification",
  "behavior therapy",
  "bereavement support",
  "bibliotherapy",
  "binge eating",
  "biofeedback therapy",
  "body dysmorphic disorder",
  "body psychotherapy",
  "boundary setting",
  "bulimia nervosa",
  "care coordination",
  "caring professions",
  "case management",
  "catharsis",
  "centring techniques",
  "childhood trauma",
  "clinical psychology",
  "cognitive development",
  "cognitive therapy",
  "collaborative care",
  "compulsions",
  "concentration",
  "confidence building",
  "conflict management",
  "consent",
  "contextual therapy",
  "cooperation",
  "cooperative games",
  "core beliefs",
  "creativity in therapy",
  "crisis care",
  "crisis counseling",
  "crisis management",
  "cultural competence",
  "cyberbullying",
  "day treatment",
  "deep breathing",
  "delusions",
  "dementia",
  "denial",
  "dependency",
  "detoxification",
  "developmental psychology",
  "diagnosis",
  "dialectical therapy",
  "diet and mental health",
  "dissociation",
  "distress tolerance",
  "domestic abuse",
  "dual diagnosis",
  "early intervention",
  "ecotherapy",
  "emotional expression",
  "emotional health maintenance",
  "emotional trauma",
  "empathic listening",
  "empowerment",
  "end-of-life care",
  "engagement",
  "environmental stressors",
  "epigenetics and mental health",
  "ethics in therapy",
  "eustress",
  "executive function",
  "existential crises",
  "expressive therapy",
  "exposure therapy",
  "faith-based counseling",
  "family dynamics",
  "family of origin issues",
  "family systems",
  "fear of failure",
  "feeling overwhelmed",
  "feminist therapy",
  "focus",
  "forgiveness therapy",
  "frustration",
  "gambling addiction",
  "gender dysphoria",
  "gender identity",
  "generalized anxiety disorder",
  "genogram",
  "grief counseling",
  "guided visualization",
  "habit formation",
  "happiness research",
  "health anxiety",
  "healthy boundaries",
  "histrionic personality disorder",
  "hope",
  "human development",
  "humanistic psychology",
  "hyperactivity",
  "hypochondria",
  "identity formation",
  "incarceration",
  "inclusion",
  "individual therapy",
  "industrial-organizational psychology",
  "infant mental health",
  "informed consent",
  "insecurity",
  "intellectual disabilities",
  "internet addiction",
  "intervention",
  "introversion",
  "intuitive eating",
  "isolation",
  "jealousy",
  "journaling",
  "juvenile therapy",
  "labelling",
  "laughter therapy",
  "learned helplessness",
  "learning disabilities",
  "life purpose",
  "logotherapy",
  "loss of interest",
  "loss of motivation",
  "loving-kindness meditation",
  "maladaptive behavior",
  "manic episodes",
  "maternal mental health",
  "mental flexibility",
  "mental health literacy",
  "mental status exam",
  "metacognition",
  "mindfulness-based therapy",
  "mindset",
  "misophonia",
  "mitigating circumstances",
  "mood stabilizers",
  "moral injury",
  "music and mood",
  "narrative psychology",
  "nature and mental health",
  "negative reinforcement",
  "neuroplasticity",
  "non-verbal learning disorder",
  "obsessions",
  "occupational stress",
  "operant conditioning",
  "oppositional defiant disorder",
  "outpatient care",
  "overcoming barriers",
  "overwhelmed",
  "panic disorder",
  "paranoid personality disorder",
  "patient advocacy",
  "peer counseling",
  "perfectionist tendencies",
  "personal growth",
  "personal space",
  "phobia treatment",
  "physical fitness",
  "placebo effect",
  "positive affirmations",
  "positive reinforcement",
  "postnatal depression",
  "postpartum anxiety",
  "posttraumatic growth",
  "powerlessness",
  "practical support",
  "prevention programs",
  "proactive coping",
  "problem-solving",
  "psychiatric disorders",
  "psychoanalysis therapy",
  "psychoeducational groups",
  "psychological assessments",
  "psychological safety",
  "psychopharmacology",
  "psychosocial rehabilitation",
  "psychosomatic symptoms",
  "quality of life",
  "racial trauma",
  "rapid eye movement therapy",
  "reactivity",
  "rebuilding trust",
  "recovery journey",
  "reframing",
  "rehabilitation",
  "relationship counseling",
  "relaxation response",
  "relocation stress",
  "remission",
  "repression",
  "residential treatment",
  "resourcefulness",
  "restorative justice",
  "rumination",
  "safety planning",
  "school psychology",
  "seasonal affective disorder",
  "secondary trauma",
  "self-awareness",
  "self-blame",
  "self-concept",
  "self-development",
  "self-discipline",
  "self-education",
  "self-expression",
  "self-help techniques",
  "self-hypnosis",
  "self-medication",
  "self-regulation",
  "self-talk",
  "separation",
  "service learning",
  "sexual orientation",
  "sexual trauma",
  "shared decision making",
  "shame",
  "short-term therapy",
  "shyness",
  "silent treatment",
  "social development",
  "social learning theory",
  "social phobia",
  "social work",
  "somatic therapy",
  "sophrology",
  "spiritual development",
  "stability",
  "stalking",
  "stigma reduction",
  "stress inoculation training",
  "stress-relief activities",
  "stressors",
  "structured play",
  "subclinical symptoms",
  "suicidality",
  "supportive counseling",
  "suppression",
  "symptom management",
  "systemic issues",
  "telehealth services",
  "terminal illness support",
  "test anxiety",
  "therapeutic alliance",
  "therapeutic boarding schools",
  "therapeutic communities",
  "therapeutic journaling",
  "therapeutic relationship",
  "therapeutic touch",
  "therapy animals",
  "therapy resistance",
  "thought disorders",
  "tolerance",
  "toxic positivity",
  "transference",
  "transitional counseling",
  "transitional phases",
  "trauma bonding",
  "trauma therapy",
  "triggering events",
  "trust-building",
  "unconscious bias",
  "unconditional positive regard",
  "underlying issues",
  "unresolved conflict",
  "validation",
  "values clarification",
  "verbal abuse",
  "victim mentality",
  "victim support",
  "victimization",
  "vocational counseling",
  "volunteering",
  "vulnerability",
  "wellness check",
  "whole-person care",
  "withdrawal",
  "work environment",
  "workplace bullying",
  "workplace mental health",
  "worthlessness",
  "yoga therapy",
  "youth counseling",
  "youth mental health",
  "zen meditation",
  "zero tolerance policies",
  
  "hello",
  "hi",
  "hey",
  "welcome",
  "good morning",
  "good afternoon",
  "good evening",
  "how can I help you today?",
  "how are you feeling today?",
  "what's on your mind?",
  "how can I support you?",
  "is there something you'd like to talk about?",
  "it's great to see you",
  "thanks for reaching out",
  "how can I assist you today?",
  "let's talk about how you're feeling",
  "what brings you here today?",
  "I'm here to help",
  "how can I make your day better?",
  "let's work through this together",
  "I'm here to listen",
  "what's bothering you?",
  "let's talk about what's on your mind",
  "how can I be of service?",
];

const isRelatedToMentalHealth = (query) => {
  return mentalHealthKeywords.some((keyword) =>
    query.toLowerCase().includes(keyword)
  );
};

const connectWithChatBot = async (req, res) => {
  let wss = null;
  const roomId = uuid();
  
  try {
    // Validate user ID first
    if (!req.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Processing chat request for user:", req.userId);

    // Get chat history
    const foundHist = await ChatHist.find({ userId: req.userId }).sort({
      timestamp: 1,
    });

    console.log("Found chat history:", foundHist.length, "messages");

    let foundHistForGemini = [];
    for (let conv of foundHist) {
      foundHistForGemini.push({
        role: "user",
        parts: [{ text: conv.prompt }],
      });
      foundHistForGemini.push({
        role: "model",
        parts: [{ text: conv.response }],
      });
    }

    // Send response immediately with roomId and chat history as fallback
    res.status(200).json({ 
      chatId: roomId,
      chatHistory: foundHist // Add chat history as fallback
    });
    console.log("HTTP response sent with roomId:", roomId);

    // Add delay to allow client to connect first
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ADD THIS DEBUG LINE:
    console.log("About to connect to WebSocket server...");

    // Connect to WebSocket server with timeout
    const websocketserverLink = `wss://websocket-server-6mtr.onrender.com?${querystring.stringify({
      id: roomId,
      isServer: true,
    })}`;

    console.log("Connecting to WebSocket:", websocketserverLink);

    wss = new WebSocket(websocketserverLink, {
      timeout: 15000, // 15 second timeout
    });

    // Set up connection timeout
    const connectionTimeout = setTimeout(() => {
      if (wss.readyState === WebSocket.CONNECTING) {
        console.error("WebSocket connection timeout - server may be sleeping");
        wss.terminate();
      }
    }, 15000);

    // Add immediate state check
    console.log("WebSocket initial state:", wss.readyState);

    wss.on("open", () => {
      clearTimeout(connectionTimeout);
      console.log("WebSocket connected successfully for room:", roomId);
      
      try {
        wss.send(JSON.stringify({ type: "server:connected" }));
        console.log("Server connected message sent");
      } catch (sendError) {
        console.error("Error sending initial message:", sendError.message);
      }
    });

    // Initialize Gemini chat
    let chat;
    try {
      chat = startGeminiChat(foundHistForGemini);
      console.log("Gemini chat initialized");
    } catch (geminiError) {
      console.error("Failed to initialize Gemini chat:", geminiError.message);
      return; // Exit gracefully
    }

    wss.on("message", async (data) => {
      try {
        const parsedData = JSON.parse(data.toString());
        console.log("Received message type:", parsedData.type);

        if (parsedData?.type === "client:chathist") {
          const response = {
            type: "server:chathist",
            data: foundHist
          };
          
          if (wss.readyState === WebSocket.OPEN) {
            wss.send(JSON.stringify(response));
            console.log("Chat history sent");
          }
          
        } else if (parsedData?.type === "client:prompt") {
          if (!parsedData.prompt) {
            console.error("Received empty prompt");
            return;
          }

          // Correct spelling in the prompt
          const correctedPrompt = correctSpelling(parsedData.prompt);
          console.log("Processing prompt:", correctedPrompt.substring(0, 50) + "...");

          if (!isRelatedToMentalHealth(correctedPrompt)) {
            const restrictedResponse = {
              type: "server:response:restricted",
              message: "Our platform is dedicated to providing comprehensive support and resources specifically tailored for mental health topics. If you're looking for assistance related to mental well-being, our app offers a range of tools and information to help you navigate and manage various aspects of mental health."
            };
            
            if (wss.readyState === WebSocket.OPEN) {
              wss.send(JSON.stringify(restrictedResponse));
            }
            return;
          }

          try {
            const result = await chat.sendMessageStream(correctedPrompt);
            let respText = "";

            if (wss.readyState === WebSocket.OPEN) {
              wss.send(JSON.stringify({ type: "server:response:start" }));
            }

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              
              if (wss.readyState === WebSocket.OPEN) {
                wss.send(JSON.stringify({
                  type: "server:response:chunk",
                  chunk: chunkText,
                }));
              }
              respText += chunkText;
            }

            if (wss.readyState === WebSocket.OPEN) {
              wss.send(JSON.stringify({ type: "server:response:end" }));
            }

            // Save to database
            try {
              await ChatHist.create({
                userId: req.userId,
                prompt: correctedPrompt,
                response: respText,
              });
              console.log("Chat history saved successfully");
            } catch (dbError) {
              console.error("Database save error:", dbError.message);
            }

          } catch (geminiError) {
            console.error("Gemini API error:", geminiError.message);
            
            if (wss.readyState === WebSocket.OPEN) {
              wss.send(JSON.stringify({
                type: "server:error",
                message: "Sorry, I'm having trouble processing your request right now."
              }));
            }
          }
        }
      } catch (parseError) {
        console.error("Message parsing error:", parseError.message);
      }
    });

    wss.on("close", (code, reason) => {
      clearTimeout(connectionTimeout);
      console.log(`WebSocket connection closed for room ${roomId}. Code: ${code}, Reason: ${reason}`);
    });

    wss.on("error", (error) => {
      clearTimeout(connectionTimeout);
      console.error("WebSocket Error for room", roomId, ":", error.message);
      console.error("Error code:", error.code);
      console.error("WebSocket readyState:", wss.readyState);
      
      // Check if it's a connection issue
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        console.error("Network connectivity issue - WebSocket server may be down");
      }
      
      // Don't try to send HTTP response here - it's already sent
      if (wss && wss.readyState === WebSocket.OPEN) {
        try {
          wss.close();
        } catch (closeError) {
          console.error("Error closing WebSocket:", closeError.message);
        }
      }
    });

  } catch (error) {
    console.error("ConnectWithChatBot error:", error.message);
    
    // Only send error response if we haven't sent response yet
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Internal server error", 
        message: error.message 
      });
    }
    
    // Clean up WebSocket if it exists
    if (wss) {
      try {
        wss.close();
      } catch (closeError) {
        console.error("Error closing WebSocket in catch:", closeError.message);
      }
    }
  }
};

module.exports = { connectWithChatBot };