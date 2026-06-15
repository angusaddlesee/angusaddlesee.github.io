// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "Long-form posts on conversational AI, LLM systems, and accessibility — alongside selected articles I&#39;ve written for Towards Data Science, Heartbeat, Amazon Science, and others.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Publications and articles on conversational AI, LLM routing, and accessibility, listed in reverse chronological order.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Case studies in conversational AI, robotics, and accessibility deployments.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Curriculum vitae highlighting work in conversational AI, LLM routing, and accessibility.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Teaching, supervision, and mentorship in conversational AI and machine learning.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "post-llm-routing-at-scale-lessons-from-amazon-alexa",
        
          title: "LLM Routing at Scale: Lessons from Amazon Alexa",
        
        description: "How intelligent model selection makes voice assistants faster and more accessible",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/llm-routing-at-scale/";
          
        },
      },{id: "post-designing-ai-for-cognitive-diversity-lessons-from-hospital-deployments",
        
          title: "Designing AI for Cognitive Diversity: Lessons from Hospital Deployments",
        
        description: "What I learned building conversational AI for people with dementia",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/accessible-ai-design/";
          
        },
      },{id: "post-repairing-interrupted-questions-makes-voice-assistants-more-accessible",
        
          title: 'Repairing Interrupted Questions Makes Voice Assistants More Accessible <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Making voice assistants more accessible by handling interrupted questions.",
        section: "Posts",
        handler: () => {
          
            window.open("https://www.amazon.science/blog/repairing-interrupted-questions-makes-voice-agents-more-accessible", "_blank");
          
        },
      },{id: "post-designing-conversational-agents-for-multi-party-interactions",
        
          title: 'Designing Conversational Agents for Multi-party Interactions <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Exploring how additional participants impact conversations.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/designing-conversational-agents-for-multi-party-interactions-523b05ea8834?source=friends_link&sk=aa13926898a2cdca47d69192c05ad670", "_blank");
          
        },
      },{id: "post-voice-assistant-accessibility",
        
          title: 'Voice Assistant Accessibility <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Ensuring everyone is understood by voice systems.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/voice-assistant-accessibility-dc737cde0394?source=friends_link&sk=b24436d717009c37083fbd7d78c59a31", "_blank");
          
        },
      },{id: "post-the-future-of-voice-assistants-what-are-the-early-research-trends",
        
          title: 'The Future of Voice Assistants: What Are the Early Research Trends? <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Analysing five years of PhD research topics in conversational AI.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/the-future-of-voice-assistants-what-are-the-early-research-trends-dc02215fe2aa?source=friends_link&sk=8f07eb0c8254b871fa4f245985c87c3b", "_blank");
          
        },
      },{id: "post-the-spoon-is-in-the-sink-assisting-visually-impaired-people-in-the-kitchen",
        
          title: 'The Spoon is in the Sink: Assisting Visually Impaired People in the Kitchen... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "A multimodal voice assistant that helps visually impaired users locate items in the kitchen.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/the-spoon-is-in-the-sink-assisting-visually-impaired-people-in-the-kitchen-ccea20b098cd", "_blank");
          
        },
      },{id: "post-how-to-adapt-voice-assistants-for-people-with-dementia-and-people-affected-by-sight-loss",
        
          title: 'How to Adapt Voice Assistants for People with Dementia and People Affected by... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "How to adapt voice assistants for people with dementia and sight loss.",
        section: "Posts",
        handler: () => {
          
            window.open("https://thedatalab.com/news/how-to-adapt-voice-assistants-for-people-with-dementia-and-people-affected-by-sight-loss/", "_blank");
          
        },
      },{id: "post-am-i-allergic-to-this-developing-a-voice-assistant-for-sight-impaired-people",
        
          title: 'Am I Allergic to This? Developing a Voice Assistant for Sight Impaired People... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "A voice assistant that helps sight-impaired people read food packaging.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/am-i-allergic-to-this-developing-a-voice-assistant-for-sight-impaired-people-3f036fe7792b", "_blank");
          
        },
      },{id: "post-haver-design-collective-39-s-interview-with-angus-addlesee",
        
          title: 'Haver Design Collective&#39;s Interview with Angus Addlesee <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "An interview with Haver Design Collective on conversational AI and accessibility.",
        section: "Posts",
        handler: () => {
          
            window.open("https://haver.scot/angusaddlesee.html", "_blank");
          
        },
      },{id: "post-the-current-state-of-chatbots-and-conversational-ai-across-europe-and-africa",
        
          title: 'The Current State of Chatbots and Conversational AI across Europe and Africa <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "A catalogue of conversational AI activity across Europe and Africa.",
        section: "Posts",
        handler: () => {
          
            window.open("https://chatbotslife.com/the-current-state-of-chatbots-and-conversational-ai-across-europe-and-africa-a-catalogue-c85605c85878", "_blank");
          
        },
      },{id: "post-an-overview-of-scotland-39-s-linked-data-projects-from-sliding-7",
        
          title: 'An Overview of Scotland&#39;s Linked Data Projects from SLiDInG 7 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "An overview of Scotland&#39;s linked data projects.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/an-overview-of-scotlands-linked-data-projects-from-sliding-7-561617454415", "_blank");
          
        },
      },{id: "post-creating-better-conversational-agents-to-improve-health-and-social-care",
        
          title: 'Creating Better Conversational Agents to Improve Health and Social Care <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Creating better conversational agents to improve health and social care.",
        section: "Posts",
        handler: () => {
          
            window.open("https://wattmag.hw.ac.uk/9/", "_blank");
          
        },
      },{id: "post-the-olympics-how-to-build-a-linked-data-application",
        
          title: 'The Olympics: How to Build a Linked Data Application <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "How to build a linked data application using RDFox and Wallscope&#39;s platform.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/the-olympics-how-to-build-a-linked-data-application-f6f844b3a19c", "_blank");
          
        },
      },{id: "post-ethically-collecting-conversations-with-people-that-have-cognitive-impairments",
        
          title: 'Ethically Collecting Conversations with People that have Cognitive Impairments <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Practical guidance for ethical research with people who have cognitive impairments.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/ethically-collecting-conversations-with-people-that-have-cognitive-impairments-9ad0d2714bdd?source=friends_link&sk=d78703a4c5fda9d24a74c70463635fc9", "_blank");
          
        },
      },{id: "post-covid-impact-on-ecrs-angus-addlesee",
        
          title: 'COVID Impact on ECRs: Angus Addlesee <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Reflections on the impact of COVID on early career researchers.",
        section: "Posts",
        handler: () => {
          
            window.open("https://www.sdrc.scot/covid-impact-blog-angus-addlesee", "_blank");
          
        },
      },{id: "post-where-to-find-linked-open-data-for-your-home-projects",
        
          title: 'Where to Find Linked Open Data for Your Home Projects <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Sources of linked open data for home projects.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/where-to-find-linked-open-data-for-your-home-projects-d4f56b46223a", "_blank");
          
        },
      },{id: "post-using-furhat-and-rasa-to-assist-when-you-forget-a-word-mid-sentence",
        
          title: 'Using Furhat and Rasa to Assist when You Forget a Word Mid-sentence <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "A student group project assisting users who pause mid-sentence.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/using-furhat-and-rasa-to-assist-when-you-forget-a-word-mid-sentence-a-student-group-project-53e40d788acb", "_blank");
          
        },
      },{id: "post-building-a-voice-assistant-for-blind-and-partially-sighted-people",
        
          title: 'Building a Voice Assistant for Blind and Partially Sighted People <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "A student group project on accessible voice assistance.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/building-a-voice-assistant-for-blind-and-partially-sighted-people-a-student-group-project-ce1ecd631382", "_blank");
          
        },
      },{id: "post-convolutions-image-resizing-and-filtering",
        
          title: 'Convolutions, Image Resizing, and Filtering <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Convolutions, image resizing, and filtering.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/the-ancient-secrets-of-computer-vision-4-by-joseph-redmon-convolutions-546f4032f335", "_blank");
          
        },
      },{id: "post-image-storage-colour-spaces-and-manipulation",
        
          title: 'Image Storage, Colour Spaces, and Manipulation <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Image storage, colour spaces, and manipulation.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/the-ancient-secrets-of-computer-vision-3-by-joseph-redmon-condensed-681517a89060", "_blank");
          
        },
      },{id: "post-developing-conversational-ai-to-be-more-human",
        
          title: 'Developing Conversational AI to be More Human <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Featured in DIGIT discussing the human side of conversational AI.",
        section: "Posts",
        handler: () => {
          
            window.open("https://www.digit.fyi/developing-conversational-ai-to-be-more-human/", "_blank");
          
        },
      },{id: "post-comparison-of-linked-data-triplestores-a-new-contender",
        
          title: 'Comparison of Linked Data Triplestores: A New Contender <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Comparing the latest triplestores.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/comparison-of-linked-data-triplestores-a-new-contender-c62ae04901d3", "_blank");
          
        },
      },{id: "post-how-dementia-affects-conversation-building-a-more-accessible-conversational-ai",
        
          title: 'How Dementia Affects Conversation: Building a More Accessible Conversational AI <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Building a more accessible conversational AI for people with dementia.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/how-dementia-effects-conversation-f538d2d9507a", "_blank");
          
        },
      },{id: "post-human-vision-how-eyes-work-and-why-they-evolved-that-way",
        
          title: 'Human Vision: How Eyes Work and Why they Evolved that Way <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "How eyes work and why they evolved that way.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/the-ancient-secrets-of-computer-vision-2-by-joseph-redmon-condensed-934e16eacb44", "_blank");
          
        },
      },{id: "post-introduction-to-computer-vision",
        
          title: 'Introduction to Computer Vision <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "An introduction to computer vision.",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/the-ancient-secrets-of-computer-vision-1-by-joseph-redmon-condensed-9839ae85a4c8", "_blank");
          
        },
      },{id: "post-constructing-more-advanced-sparql-queries",
        
          title: 'Constructing More Advanced SPARQL Queries <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Constructing more advanced SPARQL queries.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/constructing-more-advanced-sparql-queries-72d5ade1eedc", "_blank");
          
        },
      },{id: "post-beginning-to-replicate-natural-conversation-in-real-time",
        
          title: 'Beginning to Replicate Natural Conversation in Real Time <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Early steps towards real-time, naturally interactive dialogue.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/beginning-to-replicate-natural-conversation-in-real-time-d4f6b7f62e08?source=friends_link&sk=58b50bb44a3d9ef2d21bd89768284a06", "_blank");
          
        },
      },{id: "post-conversational-ai-with-angus-addlesee-of-heriot-watt",
        
          title: 'Conversational AI with Angus Addlesee of Heriot-Watt <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "An interview about conversational AI research at Heriot-Watt.",
        section: "Posts",
        handler: () => {
          
            window.open("https://companyconnecting.com/2019/04/04/conversational-ai-with-angus-addlesee-of-heriot-watt/", "_blank");
          
        },
      },{id: "post-linked-data-reconciliation-in-graphdb",
        
          title: 'Linked Data Reconciliation in GraphDB <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "How to reconcile linked data using GraphDB.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/linked-data-reconciliation-in-graphdb-cd2796d2870b", "_blank");
          
        },
      },{id: "post-comparison-of-linked-data-triplestores-developing-the-methodology",
        
          title: 'Comparison of Linked Data Triplestores: Developing the Methodology <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Developing a methodology for comparing linked data triplestores.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/comparison-of-linked-data-triplestores-developing-the-methodology-e87771cb3011", "_blank");
          
        },
      },{id: "post-using-ontorefine-to-transform-tabular-data-into-linked-data",
        
          title: 'Using OntoRefine to Transform Tabular Data into Linked Data <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Using OntoRefine to transform tabular data into linked data.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/using-ontorefine-to-transform-tabular-data-into-linked-data-7277ec8c2c0f", "_blank");
          
        },
      },{id: "post-comparing-linked-data-triplestores",
        
          title: 'Comparing Linked Data Triplestores <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "An initial comparison of linked data triplestores.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/comparing-linked-data-triplestores-ebfac8c3ad4f", "_blank");
          
        },
      },{id: "post-constructing-sparql-queries",
        
          title: 'Constructing SPARQL Queries <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "An introduction to constructing SPARQL queries.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/constructing-sparql-queries-ca63b8b9ac02", "_blank");
          
        },
      },{id: "post-creating-linked-data",
        
          title: 'Creating Linked Data <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "How to create linked data.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/creating-linked-data-31c7dd479a9e", "_blank");
          
        },
      },{id: "post-understanding-linked-data-formats",
        
          title: 'Understanding Linked Data Formats <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Understanding RDF/XML vs Turtle vs N-Triples.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/understanding-linked-data-formats-rdf-xml-vs-turtle-vs-n-triples-eb931dbe9827", "_blank");
          
        },
      },{id: "post-tackling-big-data-challenges-with-linked-data",
        
          title: 'Tackling Big Data Challenges with Linked Data <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "Tackling big data challenges with linked data.",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/tackling-big-data-challenges-with-linked-data-278b0761a6de", "_blank");
          
        },
      },{id: "post-an-interview-with-heriot-watt-student-angus-addlesee",
        
          title: 'An Interview with Heriot-Watt Student Angus Addlesee <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "An interview as a Heriot-Watt student about my early studies.",
        section: "Posts",
        handler: () => {
          
            window.open("https://companyconnecting.com/2017/03/02/graduate-series-an-interview-with-heriot-watt-student-angus-addlesee/", "_blank");
          
        },
      },{id: "books-artificial-intelligence-a-modern-approach",
          title: 'Artificial Intelligence: A Modern Approach',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/artificial_intelligence_modern_approach/";
            },},{id: "books-deep-learning",
          title: 'Deep Learning',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/deep_learning/";
            },},{id: "books-the-elements-of-statistical-learning",
          title: 'The Elements of Statistical Learning',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/elements_statistical_learning/";
            },},{id: "books-graph-representation-learning",
          title: 'Graph Representation Learning',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/graph_representation_learning/";
            },},{id: "books-knowledge-graphs",
          title: 'Knowledge Graphs',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/knowledge_graphs/";
            },},{id: "books-pattern-recognition-and-machine-learning",
          title: 'Pattern Recognition and Machine Learning',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/pattern_recognition_ml/";
            },},{id: "books-probabilistic-graphical-models-principles-and-techniques",
          title: 'Probabilistic Graphical Models: Principles and Techniques',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/probabilistic_graphical_models/";
            },},{id: "books-reinforcement-learning-an-introduction",
          title: 'Reinforcement Learning: An Introduction',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/reinforcement_learning/";
            },},{id: "books-a-semantic-web-primer",
          title: 'A Semantic Web Primer',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/semantic_web_primer/";
            },},{id: "books-speech-and-language-processing",
          title: 'Speech and Language Processing',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/speech_language_processing/";
            },},{id: "news-completed-the-edinburgh-marathon-my-first-ever-marathon",
          title: 'Completed the Edinburgh Marathon — my first ever marathon!',
          description: "",
          section: "News",},{id: "news-finished-my-bookmaking-internship-at-tipico-in-malta-where-i-created-optimisation-algorithms",
          title: 'Finished my bookmaking internship at Tipico in Malta, where I created optimisation algorithms....',
          description: "",
          section: "News",},{id: "news-graduated-from-heriot-watt-university-with-a-bsc-hons-in-mathematics-dissertation-markov-chains-modelling-stochastic-processes-and-exploring-the-mathematics-behind-these-models",
          title: 'Graduated from Heriot-Watt University with a BSc (Hons) in Mathematics. Dissertation: “Markov Chains:...',
          description: "",
          section: "News",},{id: "news-finished-a-data-analyst-internship-at-go4venture-in-london",
          title: 'Finished a Data Analyst internship at Go4Venture in London.',
          description: "",
          section: "News",},{id: "news-i-was-interviewed-by-company-connecting-as-a-heriot-watt-student",
          title: 'I was interviewed by Company Connecting as a Heriot-Watt student.',
          description: "",
          section: "News",},{id: "news-started-as-a-data-scientist-at-wallscope",
          title: 'Started as a Data Scientist at Wallscope!',
          description: "",
          section: "News",},{id: "news-spoke-at-the-data-science-skills-symposium-at-codebase-edinburgh",
          title: 'Spoke at the Data Science Skills Symposium at CodeBase, Edinburgh.',
          description: "",
          section: "News",},{id: "news-presented-at-the-edinburgh-tourism-innovation-challenge-in-codebase-achieving-2nd-place",
          title: 'Presented at the Edinburgh Tourism Innovation Challenge in Codebase, achieving 2nd place.',
          description: "",
          section: "News",},{id: "news-presented-our-2nd-place-challenge-pitch-at-the-national-museum-in-edinburgh-to-over-500-people",
          title: 'Presented our 2nd place challenge pitch at the National Museum in Edinburgh to...',
          description: "",
          section: "News",},{id: "news-worked-on-a-side-project-during-my-masters-on-abuse-detection-towards-conversational-agents-collaborating-with-a-phd-student-under-professor-verena-rieser",
          title: 'Worked on a side-project during my Masters on abuse detection towards conversational agents...',
          description: "",
          section: "News",},{id: "news-promoted-to-machine-learning-engineer-at-wallscope",
          title: 'Promoted to Machine Learning Engineer at Wallscope.',
          description: "",
          section: "News",},{id: "news-graduated-with-a-distinction-in-my-msc-in-artificial-intelligence-with-speech-and-multimodal-interaction-at-heriot-watt-university-thesis-an-exploration-into-open-domain-question-answering-for-conversational-agents",
          title: 'Graduated with a Distinction in my MSc in Artificial Intelligence with Speech and...',
          description: "",
          section: "News",},{id: "news-worked-with-the-scottish-government-in-their-hq-on-child-protection-statistics-and-data-management-unifying-large-messy-datasets-and-analysing-the-results",
          title: 'Worked with the Scottish Government in their HQ on child protection statistics and...',
          description: "",
          section: "News",},{id: "news-my-article-tackling-big-data-challenges-with-linked-data-was-published-on-the-wallscope-blog",
          title: 'My article “Tackling Big Data Challenges with Linked Data” was published on the...',
          description: "",
          section: "News",},{id: "news-my-article-understanding-linked-data-formats-was-published-on-the-wallscope-blog",
          title: 'My article “Understanding Linked Data Formats” was published on the Wallscope blog.',
          description: "",
          section: "News",},{id: "news-my-article-creating-linked-data-was-published-on-the-wallscope-blog",
          title: 'My article “Creating Linked Data” was published on the Wallscope blog.',
          description: "",
          section: "News",},{id: "news-started-working-with-the-nhs-to-build-a-patient-management-platform",
          title: 'Started working with the NHS to build a patient management platform.',
          description: "",
          section: "News",},{id: "news-my-article-constructing-sparql-queries-was-published-on-the-wallscope-blog",
          title: 'My article “Constructing SPARQL Queries” was published on the Wallscope blog.',
          description: "",
          section: "News",},{id: "news-my-article-comparing-linked-data-triplestores-was-published-on-the-wallscope-blog",
          title: 'My article “Comparing Linked Data Triplestores” was published on the Wallscope blog.',
          description: "",
          section: "News",},{id: "news-my-article-using-ontorefine-to-transform-tabular-data-into-linked-data-was-published-on-the-wallscope-blog",
          title: 'My article “Using OntoRefine to Transform Tabular Data into Linked Data” was published...',
          description: "",
          section: "News",},{id: "news-successfully-granted-the-data-lab-scotland-s-industrial-doctorate-funding-award",
          title: 'Successfully granted the Data Lab Scotland’s Industrial Doctorate Funding Award!',
          description: "",
          section: "News",},{id: "news-my-article-comparison-of-linked-data-triplestores-developing-the-methodology-was-published-on-the-wallscope-blog",
          title: 'My article “Comparison of Linked Data Triplestores: Developing the Methodology” was published on...',
          description: "",
          section: "News",},{id: "news-started-my-phd-at-heriot-watt-university-focusing-on-conversational-ai-for-people-with-dementia",
          title: 'Started my PhD at Heriot-Watt University, focusing on Conversational AI for people with...',
          description: "",
          section: "News",},{id: "news-my-article-linked-data-reconciliation-in-graphdb-was-published-on-the-wallscope-blog",
          title: 'My article “Linked Data Reconciliation in GraphDB” was published on the Wallscope blog....',
          description: "",
          section: "News",},{id: "news-presented-at-the-dementia-research-nrs-ndn-event-at-the-strathclyde-university-innovation-centre",
          title: 'Presented at the Dementia Research NRS NDN event at the Strathclyde University Innovation...',
          description: "",
          section: "News",},{id: "news-i-was-interviewed-by-company-connecting-about-conversational-ai-at-heriot-watt",
          title: 'I was interviewed by Company Connecting about Conversational AI at Heriot-Watt.',
          description: "",
          section: "News",},{id: "news-my-article-beginning-to-replicate-natural-conversation-in-real-time-was-published-in-towards-data-science",
          title: 'My article “Beginning to Replicate Natural Conversation in Real Time” was published in...',
          description: "",
          section: "News",},{id: "news-my-article-constructing-more-advanced-sparql-queries-was-published-on-the-wallscope-blog",
          title: 'My article “Constructing More Advanced SPARQL Queries” was published on the Wallscope blog....',
          description: "",
          section: "News",},{id: "news-my-article-introduction-to-computer-vision-was-published-on-heartbeat",
          title: 'My article “Introduction to Computer Vision” was published on Heartbeat.',
          description: "",
          section: "News",},{id: "news-my-article-human-vision-how-eyes-work-and-why-they-evolved-that-way-was-published-on-heartbeat",
          title: 'My article “Human Vision: How Eyes Work and Why they Evolved that Way”...',
          description: "",
          section: "News",},{id: "news-my-article-how-dementia-affects-conversation-building-a-more-accessible-conversational-ai-was-published-on-heartbeat",
          title: 'My article “How Dementia Affects Conversation: Building a More Accessible Conversational AI” was...',
          description: "",
          section: "News",},{id: "news-spoke-at-the-data-lab-phd-talks-at-the-bayes-centre-edinburgh",
          title: 'Spoke at the Data Lab PhD Talks at the Bayes Centre, Edinburgh.',
          description: "",
          section: "News",},{id: "news-presented-at-the-dbpedia-conference-at-leipzig-university-germany",
          title: 'Presented at the DBpedia Conference at Leipzig University, Germany.',
          description: "",
          section: "News",},{id: "news-my-article-comparison-of-linked-data-triplestores-a-new-contender-was-published-on-the-wallscope-blog",
          title: 'My article “Comparison of Linked Data Triplestores: A New Contender” was published on...',
          description: "",
          section: "News",},{id: "news-started-and-began-hosting-a-monthly-tech-meetup-l-amp-amp-l-in-edinburgh",
          title: 'Started and began hosting a monthly tech meetup (L&amp;amp;amp;L) in Edinburgh.',
          description: "",
          section: "News",},{id: "news-i-was-featured-in-digit-discussing-developing-conversational-ai-to-be-more-human",
          title: 'I was featured in DIGIT discussing “Developing Conversational AI to be more Human”....',
          description: "",
          section: "News",},{id: "news-my-article-image-storage-color-spaces-and-manipulation-was-published-on-heartbeat",
          title: 'My article “Image Storage, Color Spaces, and Manipulation” was published on Heartbeat.',
          description: "",
          section: "News",},{id: "news-presented-at-esslli-at-the-university-of-latvia",
          title: 'Presented at ESSLLI at the University of Latvia.',
          description: "",
          section: "News",},{id: "news-presented-at-yrrsds-young-researchers-roundtable-on-spoken-dialogue-systems-at-kth-royal-institute-of-technology-in-stockholm-sweden",
          title: 'Presented at YRRSDS (Young Researchers’ Roundtable on Spoken Dialogue Systems) at KTH Royal...',
          description: "",
          section: "News",},{id: "news-presented-current-challenges-in-spoken-dialogue-systems-and-why-they-are-critical-for-those-living-with-dementia-at-dialogue-for-good-in-stockholm-outlining-urgent-research-priorities-for-accessible-voice-technology",
          title: 'Presented “Current Challenges in Spoken Dialogue Systems and Why They Are Critical for...',
          description: "",
          section: "News",},{id: "news-placed-2nd-at-the-furhat-hackathon-in-stockholm-sweden",
          title: 'Placed 2nd at the Furhat Hackathon in Stockholm, Sweden.',
          description: "",
          section: "News",},{id: "news-spoke-at-the-open-data-mixer-at-the-edinburgh-business-school-about-linked-data",
          title: 'Spoke at the Open Data Mixer at the Edinburgh Business School about Linked...',
          description: "",
          section: "News",},{id: "news-returned-to-the-open-data-mixer-at-the-edinburgh-business-school-to-talk-about-my-phd-on-conversational-ai-for-people-with-dementia",
          title: 'Returned to the Open Data Mixer at the Edinburgh Business School to talk...',
          description: "",
          section: "News",},{id: "news-my-article-convolutions-image-resizing-and-filtering-was-published-on-heartbeat",
          title: 'My article “Convolutions, Image Resizing, and Filtering” was published on Heartbeat.',
          description: "",
          section: "News",},{id: "news-spoke-at-barclays-ai-frenzy-at-codebase-edinburgh",
          title: 'Spoke at Barclays AI Frenzy at CodeBase, Edinburgh.',
          description: "",
          section: "News",},{id: "news-gave-a-talk-on-putting-ethics-in-ai-at-the-bayes-centre-edinburgh",
          title: 'Gave a talk on “Putting Ethics in AI” at the Bayes Centre, Edinburgh....',
          description: "",
          section: "News",},{id: "news-presented-at-the-heriot-watt-psychology-seminar-series",
          title: 'Presented at the Heriot-Watt Psychology Seminar series.',
          description: "",
          section: "News",},{id: "news-presented-my-phd-research-to-teams-at-bbc-pacific-quay-glasgow",
          title: 'Presented my PhD research to teams at BBC Pacific Quay, Glasgow.',
          description: "",
          section: "News",},{id: "news-presented-at-the-crcs-workshop-on-ai-for-social-impact-at-harvard-university-a-highlight-of-my-early-academic-career",
          title: 'Presented at the CRCS Workshop on AI for Social Impact at Harvard University...',
          description: "",
          section: "News",},{id: "news-presented-at-the-cmu-symposium-on-artificial-intelligence-and-social-good-virtual",
          title: 'Presented at the CMU Symposium on Artificial Intelligence and Social Good (virtual).',
          description: "",
          section: "News",},{id: "news-presented-ethically-collecting-multi-modal-spontaneous-conversations-with-people-that-have-cognitive-impairments-at-an-lrec-workshop-online-sharing-guidance-and-our-cusco-system-for-secure-data-collection-with-vulnerable-groups",
          title: 'Presented “Ethically Collecting Multi-Modal Spontaneous Conversations with People that have Cognitive Impairments” at...',
          description: "",
          section: "News",},{id: "news-my-article-building-a-voice-assistant-for-blind-and-partially-sighted-people-was-published-on-heartbeat-a-student-group-project-on-accessible-kitchen-assistance",
          title: 'My article “Building a Voice Assistant for Blind and Partially Sighted People” was...',
          description: "",
          section: "News",},{id: "news-my-article-using-furhat-and-rasa-to-assist-when-you-forget-a-word-mid-sentence-was-published-on-heartbeat-a-student-group-project-on-word-finding-assistance",
          title: 'My article “Using Furhat and Rasa to Assist when You Forget a Word...',
          description: "",
          section: "News",},{id: "news-my-article-where-to-find-linked-open-data-for-your-home-projects-was-published-on-the-wallscope-blog",
          title: 'My article “Where to Find Linked Open Data for Your Home Projects” was...',
          description: "",
          section: "News",},{id: "news-founded-the-aye-saac-project-a-voice-assistant-designed-to-help-blind-and-partially-sighted-people-particularly-in-the-kitchen",
          title: 'Founded the Aye-Saac project — a voice assistant designed to help blind and...',
          description: "",
          section: "News",},{id: "news-i-wrote-about-the-impact-of-covid-on-early-career-researchers-for-sdrc-s-blog",
          title: 'I wrote about the impact of COVID on early career researchers for SDRC’s...',
          description: "",
          section: "News",},{id: "news-co-founded-the-european-and-african-conversational-ai-summits-the-first-european-event-hosted-1-200-attendees-with-46-speakers-and-the-first-african-event-hosted-1-000-attendees-with-44-speakers-the-first-event-of-its-kind-in-africa",
          title: 'Co-founded the European and African Conversational AI Summits! The first European event hosted...',
          description: "",
          section: "News",},{id: "news-began-supervising-a-lab-of-80-students-alongside-20-msc-students-working-on-individual-conversational-ai-projects",
          title: 'Began supervising a lab of 80 students alongside 20 MSc students working on...',
          description: "",
          section: "News",},{id: "news-my-article-ethically-collecting-conversations-with-people-that-have-cognitive-impairments-was-published-in-towards-data-science",
          title: 'My article “Ethically Collecting Conversations with People that have Cognitive Impairments” was published...',
          description: "",
          section: "News",},{id: "news-co-organised-and-spoke-at-sliding-7-with-the-scottish-government-a-workshop-on-scotland-s-linked-data-projects",
          title: 'Co-organised and spoke at SLiDInG 7 with the Scottish Government — a workshop...',
          description: "",
          section: "News",},{id: "news-my-article-the-olympics-how-to-build-a-linked-data-application-was-published-on-the-wallscope-blog-demonstrating-how-to-combine-rdfox-with-wallscope-s-platform",
          title: 'My article “The Olympics: How to Build a Linked Data Application” was published...',
          description: "",
          section: "News",},{id: "news-supported-the-organisation-of-icmi-2020-international-conference-on-multimodal-interaction",
          title: 'Supported the organisation of ICMI 2020 (International Conference on Multimodal Interaction).',
          description: "",
          section: "News",},{id: "news-spoke-at-edinburgh-ux-virtual",
          title: 'Spoke at Edinburgh UX (virtual).',
          description: "",
          section: "News",},{id: "news-presented-a-comprehensive-evaluation-of-incremental-speech-recognition-and-diarization-for-conversational-ai-at-coling-online-benchmarking-commercial-asr-systems-for-real-time-multi-party-dialogue",
          title: 'Presented “A comprehensive evaluation of incremental speech recognition and diarization for conversational AI”...',
          description: "",
          section: "News",},{id: "news-my-article-creating-better-conversational-agents-to-improve-health-and-social-care-was-featured-in-the-watt-magazine",
          title: 'My article “Creating Better Conversational Agents to Improve Health and Social Care” was...',
          description: "",
          section: "News",},{id: "news-my-article-an-overview-of-scotland-s-linked-data-projects-from-sliding-7-was-published-on-the-wallscope-blog",
          title: 'My article “An Overview of Scotland’s Linked Data Projects from SLiDInG 7” was...',
          description: "",
          section: "News",},{id: "news-spoke-at-the-inaugural-european-chatbot-and-conversational-ai-summit-that-i-co-founded-1-200-attendees-and-46-speakers",
          title: 'Spoke at the inaugural European Chatbot and Conversational AI Summit that I co-founded...',
          description: "",
          section: "News",},{id: "news-spoke-at-the-inaugural-african-chatbot-and-conversational-ai-summit-that-i-co-founded-1-000-attendees-and-44-speakers-the-first-event-of-its-kind-in-africa",
          title: 'Spoke at the inaugural African Chatbot and Conversational AI Summit that I co-founded...',
          description: "",
          section: "News",},{id: "news-my-article-the-current-state-of-chatbots-and-conversational-ai-across-europe-and-africa-was-published-on-chatbots-life-cataloguing-findings-from-our-regional-summits",
          title: 'My article “The Current State of Chatbots and Conversational AI across Europe and...',
          description: "",
          section: "News",},{id: "news-spoke-at-the-iberoamerican-chatbot-and-conversational-ai-summit",
          title: 'Spoke at the Iberoamerican Chatbot and Conversational AI Summit.',
          description: "",
          section: "News",},{id: "news-presented-at-the-rasa-superhero-meetup",
          title: 'Presented at the Rasa Superhero Meetup.',
          description: "",
          section: "News",},{id: "news-spoke-at-the-knowledge-graph-working-group",
          title: 'Spoke at the Knowledge Graph Working Group.',
          description: "",
          section: "News",},{id: "news-co-organised-and-presented-at-yrrsds-2021-young-researchers-roundtable-on-spoken-dialogue-systems",
          title: 'Co-organised and presented at YRRSDS 2021 (Young Researchers’ Roundtable on Spoken Dialogue Systems)....',
          description: "",
          section: "News",},{id: "news-supervised-20-msc-students-working-on-the-aye-saac-project-extending-the-voice-assistant-for-visually-impaired-users",
          title: 'Supervised 20 MSc students working on the Aye-Saac project — extending the voice...',
          description: "",
          section: "News",},{id: "news-i-was-interviewed-by-haver-design-collective-about-my-research-on-conversational-ai-and-accessibility-read-it-here",
          title: 'I was interviewed by Haver Design Collective about my research on conversational AI...',
          description: "",
          section: "News",},{id: "news-featured-in-datatech-s-our-people-series-at-datafest",
          title: 'Featured in DataTech’s “Our People” series at Datafest.',
          description: "",
          section: "News",},{id: "news-visited-leuchie-house-a-respite-care-home-that-had-installed-alexa-devices-to-discuss-voice-assistant-accessibility-for-their-residents-and-staff",
          title: 'Visited Leuchie House, a respite care home that had installed Alexa devices, to...',
          description: "",
          section: "News",},{id: "news-took-part-in-the-borrow-a-researcher-programme-at-broxburn-library-sharing-my-research-on-conversational-ai-with-the-local-community",
          title: 'Took part in the Borrow a Researcher programme at Broxburn Library, sharing my...',
          description: "",
          section: "News",},{id: "news-presented-incremental-graph-based-semantics-and-reasoning-for-conversational-ai-at-reinact-in-gothenburg-proposing-a-dynamic-syntax-rdf-hybrid-for-real-time-incremental-semantic-parsing-our-paper-the-spoon-is-in-the-sink-on-kitchen-assistance-for-visually-impaired-people-was-also-presented",
          title: 'Presented “Incremental Graph-Based Semantics and Reasoning for Conversational AI” at ReInAct in Gothenburg...',
          description: "",
          section: "News",},{id: "news-my-article-am-i-allergic-to-this-developing-a-voice-assistant-for-sight-impaired-people-was-published-on-heartbeat-answering-safety-critical-food-packaging-questions-for-visually-impaired-users",
          title: 'My article “Am I Allergic to This? Developing a Voice Assistant for Sight...',
          description: "",
          section: "News",},{id: "news-featured-on-the-rasa-community-livestream",
          title: 'Featured on the Rasa Community Livestream.',
          description: "",
          section: "News",},{id: "news-my-article-how-to-adapt-voice-assistants-for-people-with-dementia-and-people-affected-by-sight-loss-was-published-on-the-data-lab-s-blog",
          title: 'My article “How to Adapt Voice Assistants for People with Dementia and People...',
          description: "",
          section: "News",},{id: "news-our-paper-am-i-allergic-to-this-assisting-sight-impaired-people-in-the-kitchen-was-presented-at-icmi-in-montreal-our-system-outperformed-existing-vqa-systems-on-real-food-packaging-questions-from-visually-impaired-users",
          title: 'Our paper “Am I allergic to this? Assisting sight impaired people in the...',
          description: "",
          section: "News",},{id: "news-my-article-the-spoon-is-in-the-sink-assisting-visually-impaired-people-in-the-kitchen-was-published-on-heartbeat-explaining-how-spatial-reasoning-can-help-blind-users-locate-kitchen-objects",
          title: 'My article “The Spoon is in the Sink: Assisting Visually Impaired People in...',
          description: "",
          section: "News",},{id: "news-gave-a-machine-learning-talk-at-neo-house-aberdeen",
          title: 'Gave a Machine Learning talk at Neo House, Aberdeen.',
          description: "",
          section: "News",},{id: "news-won-heriot-watt-s-societal-impact-award-for-my-research-on-accessible-conversational-ai-for-people-with-dementia",
          title: 'Won Heriot-Watt’s Societal Impact Award for my research on accessible conversational AI for...',
          description: "",
          section: "News",},{id: "news-ran-the-spartan-ultramarathon-in-wales-a-58k-race-with-71-obstacles-and-2-800m-elevation-gain-ben-nevis-twice",
          title: 'Ran the Spartan Ultramarathon in Wales — a 58k race with 71 obstacles...',
          description: "",
          section: "News",},{id: "news-co-organised-yrrsds-2022-young-researchers-roundtable-on-spoken-dialogue-systems",
          title: 'Co-organised YRRSDS 2022 (Young Researchers’ Roundtable on Spoken Dialogue Systems).',
          description: "",
          section: "News",},{id: "news-finished-my-applied-scientist-internship-at-amazon-alexa-working-on-neural-semantic-parsing-of-partial-utterances-with-the-nlu-and-alexa-knowledge-teams-submitted-three-papers-during-this-internship",
          title: 'Finished my Applied Scientist internship at Amazon Alexa, working on neural semantic parsing...',
          description: "",
          section: "News",},{id: "news-started-my-postdoc-as-a-research-associate-on-the-eu-spring-h2020-project-deploying-an-llm-based-conversational-robot-in-a-hospital-memory-clinic",
          title: 'Started my postdoc as a Research Associate on the EU SPRING H2020 project...',
          description: "",
          section: "News",},{id: "news-our-paper-a-visually-aware-conversational-robot-receptionist-was-presented-at-sigdial-in-edinburgh-demonstrating-a-robot-that-can-perceive-and-discuss-its-physical-environment-while-managing-hospital-visitors",
          title: 'Our paper “A Visually-Aware Conversational Robot Receptionist” was presented at SIGdial in Edinburgh...',
          description: "",
          section: "News",},{id: "news-helped-organise-sigdial-2022-in-edinburgh-bringing-the-dialogue-research-community-to-my-home-city",
          title: 'Helped organise SIGdial 2022 in Edinburgh — bringing the dialogue research community to...',
          description: "",
          section: "News",},{id: "news-my-article-the-future-of-voice-assistants-what-are-the-early-research-trends-was-published-in-towards-data-science-analysing-five-years-of-phd-research-topics-at-conversational-ai-conferences",
          title: 'My article “The Future of Voice Assistants: What Are the Early Research Trends?”...',
          description: "",
          section: "News",},{id: "news-ran-two-marathons-in-one-month-the-london-marathon-on-2nd-october-and-another-just-29-days-later",
          title: 'Ran two marathons in one month — the London Marathon on 2nd October...',
          description: "",
          section: "News",},{id: "news-presented-securely-capturing-people-s-interactions-with-voice-assistants-at-home-at-nlp4pi-in-abu-dhabi-introducing-cvr-si-our-bespoke-tool-for-ethical-data-collection-with-vulnerable-populations",
          title: 'Presented “Securely Capturing People’s Interactions with Voice Assistants at Home” at NLP4PI in...',
          description: "",
          section: "News",},{id: "news-presented-two-papers-at-iwsds-in-los-angeles-one-on-voice-assistant-accessibility-and-another-on-data-collection-for-multi-party-robot-dialogue",
          title: 'Presented two papers at IWSDS in Los Angeles — one on voice assistant...',
          description: "",
          section: "News",},{id: "news-joined-the-early-career-scientists-panel-at-dynamic-earth-edinburgh",
          title: 'Joined the Early Career Scientists panel at Dynamic Earth, Edinburgh.',
          description: "",
          section: "News",},{id: "news-my-article-voice-assistant-accessibility-was-published-in-towards-data-science-addressing-how-to-ensure-everyone-is-understood-by-voice-systems",
          title: 'My article “Voice Assistant Accessibility” was published in Towards Data Science — addressing...',
          description: "",
          section: "News",},{id: "news-my-article-designing-conversational-agents-for-multi-party-interactions-was-published-in-towards-data-science-exploring-how-additional-participants-impact-conversations",
          title: 'My article “Designing Conversational Agents for Multi-party Interactions” was published in Towards Data...',
          description: "",
          section: "News",},{id: "news-presented-to-the-voice-ai-scientists-team-at-natwest-edinburgh",
          title: 'Presented to the Voice AI Scientists team at NatWest, Edinburgh.',
          description: "",
          section: "News",},{id: "news-presented-building-for-speech-designing-the-next-generation-of-social-robots-for-audio-interaction-at-the-wtf-workshop-in-eindhoven-arguing-that-robot-designers-and-dialogue-researchers-need-to-collaborate-from-day-one",
          title: 'Presented “Building for Speech: Designing the Next Generation of Social Robots for Audio...',
          description: "",
          section: "News",},{id: "news-presented-understanding-and-answering-incomplete-questions-at-acm-cui-in-eindhoven-our-partial-understanding-pipeline-answered-only-0-77-fewer-questions-than-one-given-the-full-query",
          title: 'Presented “Understanding and Answering Incomplete Questions” at ACM CUI in Eindhoven — our...',
          description: "",
          section: "News",},{id: "news-my-article-repairing-interrupted-questions-makes-voice-assistants-more-accessible-was-published-on-amazon-science-exploring-how-semantic-parsing-can-help-voice-agents-recover-from-mid-sentence-pauses",
          title: 'My article “Repairing Interrupted Questions Makes Voice Assistants More Accessible” was published on...',
          description: "",
          section: "News",},{id: "news-presented-understanding-disrupted-sentences-using-underspecified-amr-at-interspeech-in-dublin-our-best-pipeline-recovered-meaning-from-disrupted-speech-with-only-1-6-loss-compared-to-full-sentences",
          title: 'Presented “Understanding Disrupted Sentences Using Underspecified AMR” at INTERSPEECH in Dublin — our...',
          description: "",
          section: "News",},{id: "news-supervised-20-students-on-a-multi-party-quiz-project-exploring-agreement-detection-in-group-conversations-with-social-robots",
          title: 'Supervised 20+ students on a multi-party quiz project — exploring agreement detection in...',
          description: "",
          section: "News",},{id: "news-presented-multi-party-goal-tracking-with-llms-at-sigdial-in-prague-comparing-pre-training-fine-tuning-and-prompt-engineering-for-understanding-hospital-conversations-gpt-3-5-turbo-with-reasoning-style-prompts-came-out-on-top",
          title: 'Presented “Multi-party Goal Tracking with LLMs” at SIGdial in Prague — comparing pre-training,...',
          description: "",
          section: "News",},{id: "news-two-papers-presented-at-the-ground-workshop-at-icmi-in-paris-both-exploring-how-to-detect-agreement-in-multi-party-conversations-with-social-robots",
          title: 'Two papers presented at the GROUND workshop at ICMI in Paris — both...',
          description: "",
          section: "News",},{id: "news-taught-applied-ethics-and-data-privacy-to-phd-students-and-postgraduate-researchers",
          title: 'Taught Applied Ethics and Data Privacy to PhD students and postgraduate researchers.',
          description: "",
          section: "News",},{id: "news-graduated-with-a-phd-in-artificial-intelligence-from-heriot-watt-university-thesis-incremental-multi-party-conversational-ai-for-people-with-dementia",
          title: 'Graduated with a PhD in Artificial Intelligence from Heriot-Watt University! Thesis: “Incremental Multi-party...',
          description: "",
          section: "News",},{id: "news-new-paper-in-frontiers-in-dementia-you-have-interrupted-me-again-showing-how-incremental-clarification-requests-can-make-voice-assistants-more-accessible-for-people-with-dementia",
          title: 'New paper in Frontiers in Dementia: “You Have Interrupted Me Again!” — showing...',
          description: "",
          section: "News",},{id: "news-our-paper-a-multi-party-conversational-social-robot-using-llms-was-presented-at-acm-ieee-hri-in-boulder-colorado-describing-the-architecture-of-our-hospital-robot-s-llm-based-dialogue-system",
          title: 'Our paper “A Multi-party Conversational Social Robot Using LLMs” was presented at ACM/IEEE...',
          description: "",
          section: "News",},{id: "news-won-the-eacl-best-demo-award-at-eacl-2024-in-malta-for-our-multi-party-hospital-robot-system",
          title: 'Won the EACL Best Demo Award at EACL 2024 in Malta for our...',
          description: "",
          section: "News",},{id: "news-spoke-at-pint-of-science-edinburgh-the-robots-are-coming-edition-with-my-talk-deploying-an-accessible-llm-based-conversational-agent-in-a-hospital",
          title: 'Spoke at Pint of Science Edinburgh (The Robots are Coming edition) with my...',
          description: "",
          section: "News",},{id: "news-presented-grounding-llms-to-in-prompt-instructions-at-the-safety4convai-workshop-in-turin-demonstrating-up-to-28-accuracy-improvement-by-grounding-llms-to-in-prompt-knowledge-in-safety-critical-domains",
          title: 'Presented “Grounding LLMs to In-prompt Instructions” at the Safety4ConvAI workshop in Turin —...',
          description: "",
          section: "News",},{id: "news-presented-clarifying-completions-evaluating-how-llms-respond-to-incomplete-questions-at-lrec-coling-in-turin-italy-showing-that-the-ability-to-generate-clarification-requests-only-emerges-at-larger-llm-sizes",
          title: 'Presented “Clarifying Completions: Evaluating How LLMs Respond to Incomplete Questions” at LREC-COLING in...',
          description: "",
          section: "News",},{id: "news-started-my-new-role-as-an-applied-scientist-at-amazon-alexa-joining-the-frontier-ai-modelling-lab",
          title: 'Started my new role as an Applied Scientist at Amazon Alexa+, joining the...',
          description: "",
          section: "News",},{id: "news-our-paper-self-ownership-not-self-production-modulates-bias-and-agency-over-a-synthesised-voice-was-published-in-cognition-finding-that-merely-owning-a-voice-is-sufficient-to-generate-perceptual-bias-and-a-sense-of-agency-over-it",
          title: 'Our paper “Self-ownership, not self-production, modulates bias and agency over a synthesised voice”...',
          description: "",
          section: "News",},{id: "news-our-multi-party-dialogue-dataset-paper-was-presented-at-semdial-in-trento-italy-releasing-a-hospital-dialogue-corpus-designed-for-goal-tracking-with-llms",
          title: 'Our multi-party dialogue dataset paper was presented at SemDial in Trento, Italy —...',
          description: "",
          section: "News",},{id: "news-our-paper-a-holistic-evaluation-methodology-for-multi-party-spoken-conversational-agents-was-presented-at-iva-in-glasgow-proposing-a-standard-for-evaluating-multi-party-systems-that-captures-both-dialogue-performance-and-user-experience",
          title: 'Our paper “A Holistic Evaluation Methodology for Multi-Party Spoken Conversational Agents” was presented...',
          description: "",
          section: "News",},{id: "news-our-paper-building-for-speech-designing-the-next-generation-of-social-robots-for-audio-interaction-was-published-in-frontiers-in-robotics-and-ai-making-the-case-for-better-speakers-microphones-and-quieter-motors-in-social-robots",
          title: 'Our paper “Building for Speech: Designing the Next Generation of Social Robots for...',
          description: "",
          section: "News",},{id: "news-presented-my-work-at-the-london-ai-dinner",
          title: 'Presented my work at The London AI Dinner.',
          description: "",
          section: "News",},{id: "news-alexa-announced-for-early-access-i-joined-at-the-perfect-time-to-create-and-train-a-model-deployed-in-production-contributing-to-enabling-this-launch-the-model-i-trained-is-triggered-for-100-of-traffic",
          title: 'Alexa+ announced for early access! I joined at the perfect time to create...',
          description: "",
          section: "News",},{id: "news-keynote-speaker-at-the-rasa-conversational-ai-meetup-in-london",
          title: 'Keynote speaker at the Rasa Conversational AI Meetup in London.',
          description: "",
          section: "News",},{id: "news-our-paper-socially-pertinent-robots-in-gerontological-healthcare-was-published-in-the-international-journal-of-social-robotics-reporting-on-two-waves-of-experiments-with-60-end-users-in-a-parisian-day-care-facility",
          title: 'Our paper “Socially Pertinent Robots in Gerontological Healthcare” was published in the International...',
          description: "",
          section: "News",},{id: "news-alexa-released-in-canada",
          title: 'Alexa+ released in Canada.',
          description: "",
          section: "News",},{id: "news-our-paper-evaluating-multi-party-interactions-with-social-robots-using-large-language-models-and-multi-modal-systems-was-published-in-the-international-journal-of-interaction-studies-evaluating-llm-integrated-multi-party-robot-conversations-with-27-pairs-of-participants",
          title: 'Our paper “Evaluating Multi-party Interactions with Social Robots Using Large Language Models and...',
          description: "",
          section: "News",},{id: "news-alexa-launched-in-mexico-the-first-non-english-release-an-exciting-challenge-developing-production-models-for-multilingual-support",
          title: 'Alexa+ launched in Mexico — the first non-English release. An exciting challenge developing...',
          description: "",
          section: "News",},{id: "news-alexa-launched-for-general-availability-across-the-entire-us-my-work-continues-to-contribute-directly-to-production-improvements-for-100-of-traffic",
          title: 'Alexa+ launched for general availability across the entire US. My work continues to...',
          description: "",
          section: "News",},{id: "news-presented-from-a-memory-clinic-to-alexa-scaling-conversational-ai-in-the-real-world-when-latency-actually-matters-at-the-european-conversational-ai-summit",
          title: 'Presented “From a Memory Clinic to Alexa+: Scaling Conversational AI in the Real...',
          description: "",
          section: "News",},{id: "news-alexa-launched-in-the-uk-thrilled-to-see-the-systems-i-ve-been-building-reach-users-in-my-home-country",
          title: 'Alexa+ launched in the UK! Thrilled to see the systems I’ve been building...',
          description: "",
          section: "News",},{id: "news-alexa-is-rolling-out-across-europe-italy-spain-and-more-an-exciting-and-challenging-time-as-we-scale-models-triggered-for-100-of-traffic-to-support-an-increasing-variety-of-languages",
          title: 'Alexa+ is rolling out across Europe — Italy, Spain, and more. An exciting...',
          description: "",
          section: "News",},{id: "projects-production-llm-systems-at-amazon-alexa",
          title: 'Production LLM Systems at Amazon Alexa+',
          description: "LLM routing, reward modelling, and evaluation infrastructure in Alexa&#39;s Frontier AI Modelling Lab.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-voice-assistants-for-people-with-dementia",
          title: 'Voice Assistants for People with Dementia',
          description: "PhD research on accessible dialogue systems tailored to cognitive abilities and communication patterns of dementia patients.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-spring-hospital-memory-clinic-robot",
          title: 'SPRING Hospital Memory Clinic Robot',
          description: "Multi-party conversational social robot deployed in real hospital settings for patient interactions.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-voice-assistants-for-visually-impaired-people-in-the-kitchen",
          title: 'Voice Assistants for Visually Impaired People in the Kitchen',
          description: "Accessible kitchen assistance systems addressing malnutrition challenges for visually impaired users.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-nhs-amp-scottish-government-ml-projects",
          title: 'NHS &amp;amp; Scottish Government ML Projects',
          description: "Machine learning systems for healthcare information extraction and patient care management.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-abuse-detection-amp-question-analysis-on-the-alexa-prize-corpus",
          title: 'Abuse Detection &amp;amp; Question Analysis on the Alexa Prize Corpus',
          description: "Two MSc projects analysing roughly 1.7 million real Alexa Prize utterances; one for abuse detection, one for conversational question analysis.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/7_project/";
            },},{id: "projects-european-amp-african-conversational-ai-summits",
          title: 'European &amp;amp; African Conversational AI Summits',
          description: "Co-founded international summits bringing together researchers, practitioners, and industry leaders in conversational AI.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%61%6E%67%75%73[%61%74]%61%64%64%6C%65%73%65%65%48%51[%64%6F%74]%63%6F%6D", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/angusaddlesee", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=6n2P4OEAAAAJ", "_blank");
        },
      },{
        id: 'social-medium',
        title: 'Medium',
        section: 'Socials',
        handler: () => {
          window.open("https://medium.com/@addlesee", "_blank");
        },
      },{
        id: 'social-bluesky',
        title: 'Bluesky',
        section: 'Socials',
        handler: () => {
          window.open("https://bsky.app/profile/addlesee.bsky.social", "_blank");
        },
      },{
        id: 'social-youtube',
        title: 'YouTube',
        section: 'Socials',
        handler: () => {
          window.open("https://youtube.com/@UCWT5QO09NnvGkikoQW4aYug", "_blank");
        },
      },{
        id: 'social-x',
        title: 'X',
        section: 'Socials',
        handler: () => {
          window.open("https://twitter.com/Addlesee_AI", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/angusaddlesee", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
