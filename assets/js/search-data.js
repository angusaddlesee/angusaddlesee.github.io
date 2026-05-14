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
          description: "Updates, 2-Minute Papers, and notes on conversational AI research and deployments.",
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
      },{id: "post-designing-conversational-agents-for-multi-party-interactions",
        
          title: 'Designing Conversational Agents for Multi-party Interactions <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/designing-conversational-agents-for-multi-party-interactions-523b05ea8834?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-voice-assistant-accessibility",
        
          title: 'Voice Assistant Accessibility <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/voice-assistant-accessibility-dc737cde0394?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-the-future-of-voice-assistants-what-are-the-early-research-trends",
        
          title: 'The Future of Voice Assistants: What are the Early Research Trends? <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/the-future-of-voice-assistants-what-are-the-early-research-trends-dc02215fe2aa?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-am-i-allergic-to-this-developing-a-voice-assistant-for-sight-impaired-people",
        
          title: 'Am I Allergic to This? Developing a Voice Assistant for Sight Impaired People... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/am-i-allergic-to-this-developing-a-voice-assistant-for-sight-impaired-people-3f036fe7792b?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-the-spoon-is-in-the-sink-assisting-visually-impaired-people-in-the-kitchen",
        
          title: 'The Spoon is in the Sink: Assisting Visually Impaired People in the Kitchen... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/the-spoon-is-in-the-sink-assisting-visually-impaired-people-in-the-kitchen-ccea20b098cd?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-the-current-state-of-chatbots-and-conversational-ai-across-europe-and-africa-a-catalogue",
        
          title: 'The Current State of Chatbots and Conversational AI across Europe and Africa -... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.chatbotslife.com/the-current-state-of-chatbots-and-conversational-ai-across-europe-and-africa-a-catalogue-c85605c85878?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-an-overview-of-scotland-s-linked-data-projects-from-sliding-7",
        
          title: 'An Overview of Scotland’s Linked Data Projects from SLiDInG 7 <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/an-overview-of-scotlands-linked-data-projects-from-sliding-7-561617454415?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-the-olympics-how-to-build-a-linked-data-application",
        
          title: 'The Olympics: How to Build a Linked Data Application <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/wallscope/the-olympics-how-to-build-a-linked-data-application-f6f844b3a19c?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-ethically-collecting-conversations-with-people-that-have-cognitive-impairments",
        
          title: 'Ethically Collecting Conversations With People that have Cognitive Impairments <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/data-science/ethically-collecting-conversations-with-people-that-have-cognitive-impairments-9ad0d2714bdd?source=rss-7f06284203ea------2", "_blank");
          
        },
      },{id: "post-using-furhat-and-rasa-to-assist-when-you-forget-a-word-mid-sentence-a-student-group-project",
        
          title: 'Using Furhat and Rasa to Assist when You Forget a Word Mid-Sentence: A... <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://heartbeat.comet.ml/using-furhat-and-rasa-to-assist-when-you-forget-a-word-mid-sentence-a-student-group-project-53e40d788acb?source=rss-7f06284203ea------2", "_blank");
          
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
            },},{id: "news-co-founded-the-european-and-african-conversational-ai-summits-the-first-european-event-hosted-1-200-attendees-with-46-speakers-and-the-first-african-event-hosted-1-000-attendees-with-44-speakers-the-first-event-of-its-kind-in-africa",
          title: 'Co-founded the European and African Conversational AI Summits! The first European event hosted...',
          description: "",
          section: "News",},{id: "news-won-heriot-watt-s-societal-impact-award-for-my-research-on-accessible-conversational-ai-for-people-with-dementia",
          title: 'Won Heriot-Watt’s Societal Impact Award for my research on accessible conversational AI for...',
          description: "",
          section: "News",},{id: "news-started-my-postdoc-as-a-research-associate-on-the-eu-spring-h2020-project-deploying-an-llm-based-conversational-robot-in-a-hospital-memory-clinic",
          title: 'Started my postdoc as a Research Associate on the EU SPRING H2020 project...',
          description: "",
          section: "News",},{id: "news-graduated-with-a-phd-in-artificial-intelligence-from-heriot-watt-university-thesis-incremental-multi-party-conversational-ai-for-people-with-dementia",
          title: 'Graduated with a PhD in Artificial Intelligence from Heriot-Watt University! Thesis: “Incremental Multi-party...',
          description: "",
          section: "News",},{id: "news-won-the-eacl-best-demo-award-at-eacl-2024-in-malta-for-our-multi-party-hospital-robot-system",
          title: 'Won the EACL Best Demo Award at EACL 2024 in Malta for our...',
          description: "",
          section: "News",},{id: "news-started-my-new-role-as-an-applied-scientist-at-amazon-alexa-joining-the-frontier-ai-modelling-lab",
          title: 'Started my new role as an Applied Scientist at Amazon Alexa+, joining the...',
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
          section: "News",},{id: "news-alexa-released-in-canada",
          title: 'Alexa+ released in Canada.',
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
          section: "News",},{id: "projects-llm-routing-amp-optimisation-at-amazon-alexa",
          title: 'LLM Routing &amp;amp; Optimisation at Amazon Alexa+',
          description: "Intelligent model selection and latency optimisation for Alexa&#39;s large-scale conversational systems serving millions of users.",
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
            },},{id: "projects-multi-party-dialogue-datasets-and-evaluation",
          title: 'Multi-party Dialogue Datasets and Evaluation',
          description: "Hospital conversation datasets and evaluation frameworks for multi-speaker dialogue systems.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-conversational-ai-safety-and-question-understanding",
          title: 'Conversational AI Safety and Question Understanding',
          description: "Detecting inappropriate content and analyzing conversational question patterns in voice assistants.",
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
