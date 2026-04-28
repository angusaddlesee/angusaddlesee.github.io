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
        },{id: "nav-repositories",
          title: "repositories",
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
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
        },{id: "dropdown-bookshelf",
              title: "bookshelf",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/books/";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
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
            },},{id: "news-published-on-amazon-science-repairing-interrupted-questions-in-voice-assistants-improving-conversation-flow-when-users-change-their-minds-mid-sentence",
          title: 'Published on Amazon Science: “Repairing Interrupted Questions in Voice Assistants” - improving conversation...',
          description: "",
          section: "News",},{id: "news-co-founded-the-european-and-african-conversational-ai-summits-bringing-together-researchers-and-practitioners-to-advance-the-field",
          title: 'Co-founded the European and African Conversational AI Summits - bringing together researchers and...',
          description: "",
          section: "News",},{id: "news-speaking-at-international-conferences",
          title: 'Speaking at International Conferences',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-presented-multi-party-conversational-ai-in-memory-clinics-at-the-international-conference-on-multimodal-interaction-icmi-2024",
          title: 'Presented “Multi-party Conversational AI in Memory Clinics” at the International Conference on Multimodal...',
          description: "",
          section: "News",},{id: "news-excited-to-be-working-on-llm-routing-and-optimisation-at-amazon-alexa-making-voice-assistants-faster-and-more-accessible-for-millions-of-users-worldwide",
          title: 'Excited to be working on LLM routing and optimisation at Amazon Alexa, making...',
          description: "",
          section: "News",},{id: "news-new-journal-paper-published-socially-pertinent-robots-in-gerontological-healthcare-exploring-how-conversational-ai-can-support-elderly-care-in-clinical-settings",
          title: 'New journal paper published: “Socially Pertinent Robots in Gerontological Healthcare” - exploring how...',
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
            },},{id: "projects-2-minute-papers-series",
          title: '2-Minute Papers Series',
          description: "Bite-sized videos and articles explaining research progress and lessons learned.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
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
