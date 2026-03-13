"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'en' | 'bn'

interface LanguageState {
    language: Language
    setLanguage: (lang: Language) => void
}

export const useLanguage = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'en',
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'language-storage',
        }
    )
)

export const translations = {
    en: {
        nav: {
            services: "Services",
            results: "Results",
            pricing: "Pricing",
            about: "About",
            bookCall: "Book Strategy Call",
            sendProposal: "Send Proposal",
            videoEditing: "Video Editing",
            graphicDesign: "Graphic Design",
            home: "Studio",
            team: "The Squad",
            blog: "Blog"
        },
        hero: {
            heading: "Cinematic Video Editing",
            subtitle: "We Turn Your Content Into Viral Machines.",
            viewShowreel: "View Showreel",
            consultancy: "Free 30m Consultancy"
        },
        cta: {
            title: "Ready to Create Magic?",
            desc: "Let's collaborate to turn your raw footage into a masterpiece.",
            btn: "Start a Project"
        },
        services: {
            title: "Our Expertise",
            subtitle: "We don't just edit videos. we build brands.",
            videoTitle: "Viral Video Editing",
            videoDesc: "High-retention editing for Reels, TikToks, and Shorts that keeps viewers hooked.",
            graphicTitle: "Graphic Design",
            graphicDesc: "Eye-catching social media posts, carousels, and thumbnails that stop the scroll.",
            webTitle: "Web Development",
            webDesc: "High-performance, responsive websites and web applications that establish your brand digitally."
        },
        showreel: {
            title: "Our Viral Edits",
            subtitle: "Swipe to explore our top-performing reels."
        },
        graphicPreview: {
            title: "Selected Graphics",
            subtitle: "Visuals that convert.",
            viewGallery: "View Gallery",
            requestDesign: "Request Similar Design"
        },
        results: {
            title: "Business Results",
            subtitle: "Scalable video production that drives growth.",
            label1: "Reels with 100k+ views",
            label2: "Average Retention Rate",
            label3: "Client Revenue Generated"
        },
        packages: {
            title: "Packages",
            subtitle: "Scalable packages designed to meet you where you are.",
            pkg1: { name: "Standard", desc: "Perfect for small businesses and creators.", price: "$500", cta: "Get Standard", features: ["Up to 5 minutes video", "Basic Color Grading", "Sound Design", "2 Revisions"] },
            pkg2: { name: "Premium", desc: "For high-end productions and brands.", price: "$900", cta: "Get Premium", features: ["Up to 15 minutes video", "Advanced Color Grading", "Motion Graphics", "Unlimited Revisions", "Source Files"] },
            pkg3: { name: "Enterprise", desc: "Tailored solutions for large scale needs.", price: "Custom", cta: "Contact Us", features: ["Dedicated Editor", "Daily Turnaround", "Priority Support", "Strategy Session"] },
            pkg4: { name: "Custom", desc: "Specific requirements? Let's talk.", price: "Variable", cta: "Contact Us", features: ["Custom Scope", "Flexible Timeline", "Full Rights"] },
            btnStandard: "Get Standard",
            btnPopular: "Get Premium",
            mostPopular: "Most Popular"
        },
        testimonials: {
            title: "Success Stories",
            subtitle: "Creators we've helped blow up online."
        },
        clientReviews: {
            title: "Client Love"
        },
        about: {
            titleLine1: "ABOUT",
            titleLine2: "ME",
            desc1: "I am a passionate creator dedicated to bringing stories to life through visual arts.",
            desc2: "With over 5 years of experience in the industry, I have worked with diverse clients ranging from tech startups to lifestyle influencers. My goal is to not just edit videos but to craft compelling narratives that resonate with audiences.",
            btn: "Read Our Story",
            stats: {
                exp: "Years Experience",
                projects: "Projects Delivered",
                views: "Views Generated",
                support: "Dedicated Support"
            }
        },
        team: {
            title: "Meet The Squad",
            subtitle: "The creative minds behind your viral content."
        },
        clients: {
            label: "As Seen In",
            title: "Trusted by Top Brands"
        },
        footer: {
            tagline: "Visual Storytelling Redefined",
            quickLinks: "Quick Links",
            connect: "Connect",
            rights: "Rana Edits. All rights reserved.",
            contact: "Contact",
            address: "Dhaka, Bangladesh",
            phone: "+880 1700-000000",
            copyright: "All rights reserved."
        },
        // Inner Pages
        videoPage: {
            title: "Video Projects",
            subtitle: "Cinematic editing that tells your story and engages your audience.",
            horizontalTitle: "Horizontal Videos",
            verticalTitle: "Vertical Shorts & Reels",
            ctaTitle: "Transform Your Footage",
            ctaDesc: "Ready to turn your raw clips into cinematic masterpieces? Let's create videos that stop the scroll.",
            ctaBtn: "Book an Edit"
        },
        graphicPage: {
            title: "Graphic Design",
            subtitle: "Visual storytelling that elevates your brand.",
            ctaTitle: "Need Stunning Visuals?",
            ctaDesc: "From logos to social media posts, I design graphics that capture attention and communicate your brand's unique identity.",
            ctaBtn: "Get Your Design",
            galleryModalDesc: "Professional design crafted to capture attention and communicate your brand's value effectively.",
            galleryModalBtn: "Get Graphics Like This"
        },
        contactPage: {
            title: "Contact Us",
            subtitle: "Ready to scale your content? Book a strategy call or send us a message.",
            bookCallTitle: "Book a Strategy Call",
            bookCallDesc: "Skip the email tag. Schedule a direct 15-minute consultation with Rana to discuss your content needs.",
            calendlyPlaceholder: "Calendly Widget will appear here",
            openCalendly: "Open Calendly",
            form: {
                title: "Get In Touch",
                subtitle: "Fill out the form below or book a call directly.",
                name: "Name",
                business: "Business Type",
                budget: "Monthly Content Budget",
                budgetPlaceholder: "Select a budget range",
                instagram: "Instagram Link",
                goal: "Primary Goal",
                send: "Send Message",
                sending: "Sending...",
                successTitle: "Message Sent!",
                successDesc: "We'll get back to you within 24 hours.",
                sendAnother: "Send Another"
            }
        },
        portfolioPage: {
            title: "Our Portfolio",
            subtitle: "Browse through our latest work and see how we help brands stand out.",
            all: "All",
            categories: {
                reels: "Reels",
                business: "Business",
                personalBrand: "Personal Brand",
                ecommerce: "E-Commerce"
            }
        },
        faq: {
            title: "Frequently Asked Questions",
            subtitle: "Everything you need to know about working with me.",
            q1: "What is your typical turnaround time?",
            a1: "For most projects, I deliver the first draft within 48 hours. However, complex projects may take 3-5 days. I always provide a specific timeline before we start.",
            q2: "Do you offer revisions?",
            a2: "Yes! I offer unlimited revisions until you are 100% satisfied with the result. My goal is to maximize your retention and engagement.",
            q3: "What software do you use?",
            a3: "I primarily use Adobe Premiere Pro and After Effects for video editing. For graphic design, I use Photoshop and Illustrator."
        },
        resultsPage: {
            heroTitle: "Verified Results",
            heroSubtitle: "We don't just edit videos. We engineer content that dominates the algorithm and drives massive growth.",
            ctaTitle: "Ready To Go Viral?",
            ctaSubtitle: "Stop guessing. Start growing. Join the top 1% of creators today.",
            ctaBtn: "Get Started Now",
            viralStrategy: "Viral Growth Strategy",
            clientSatisfaction: "Client Satisfaction",
            strategies: {
                s1: { title: "Alex Hormozi Style", desc: "Fast-paced, dynamic captions, engaging B-roll." },
                s2: { title: "Iman Gadzhi Style", desc: "Cinematic storytelling, sound design, premium feel." },
                s3: { title: "Podcast Clips", desc: "Highlighting the hook, re-framing for vertical." },
                s4: { title: "Educational Content", desc: "Clear delivery, visual aids, retention editing." }
            }
        },
        webDev: {
            heroTitle: "We Speak Code. You See Magic.",
            heroSubtitle: "Full-stack engineering meets cinematic design. We build pixel-perfect, high-performance websites that convert your audience.",
            systemOnline: "System Online: V.2.0.4",
            startProject: "Start Project",
            viewWork: "View Work",
            selectedDeployments: "Selected Deployments",
            shippingRecords: "Recent shipping records.",
            viewGithub: "View GitHub",
            initializeSequence: "Initialize Sequence",
            terminalProtocol: "Complete the terminal protocol below to request a briefing.",
            projects: {
                p1: { title: "E-Commerce Ultra", category: "Next.js Store", desc: "High-performance headless e-commerce with 99/100 Lighthouse score." },
                p2: { title: "SaaS Dashboard Profile", category: "Admin Panel", desc: "Real-time analytics dashboard involving complex data visualization." },
                p3: { title: "Creative Portfolio 2025", category: "awwwards style", desc: "Award-winning animation heavy portfolio site." }
            }
        },
        codeTransform: {
            badge: "Full Stack Engineering",
            title: "We Don't Just Edit Video. We Build Digital Empires.",
            desc: "From high-performance landing pages to complex web applications. We bring the same cinematic quality to your code that we bring to your timeline.",
            feature1: "React / Next.js",
            feature2: "High Performance",
            cta: "Explore Web Services"
        },
        terminal: {
            user: "user@rana-edits:~",
            lastLogin: "Last login:",
            welcome: "Welcome to Rana Edits Terminal. Let's build something great.",
            complete: "Sequence Complete",
            received: "We have received your signal. Standby for contact.",
            restart: "./restart_sequence.sh",
            uploading: "Uploading data...",
            steps: {
                name: "Initialize User Identity (Name):",
                namePlaceholder: "Ex: John Doe",
                email: "Enter Communication Protocol (Email):",
                emailPlaceholder: "john@example.com",
                projectType: "Select Project Architecture:",
                budget: "Allocate Resources (Budget):",
                details: "Define Project Specifies:",
                detailsPlaceholder: "Describe your vision..."
            },
            options: {
                ecommerce: "E-Commerce",
                portfolio: "Portfolio",
                saas: "SaaS",
                corporate: "Corporate",
                custom: "Custom App",
                budget1: "< $1k",
                budget2: "$1k - $3k",
                budget3: "$3k - $5k",
                budget4: "$5k+"
            }
        }
    },
    bn: {
        nav: {
            services: "সার্ভিসেস",
            results: "ফলাফল",
            pricing: "প্যাকেজসমূহ",
            about: "পরিচিতি",
            bookCall: "কল বুক করুন",
            sendProposal: "প্রপোজাল পাঠান",
            videoEditing: "Video এডিটিং",
            graphicDesign: "Graphic ডিজাইন",
            home: "স্টুডিও",
            team: "টিম মেম্বার",
            blog: "ব্লগ"
        },
        hero: {
            heading: "সিনেম্যাটিক ভিডিও এডিটিং",
            subtitle: "আমরা আপনার কন্টেন্টকে ভাইরাল মেশিনে পরিণত করি।",
            viewShowreel: "শো-রিল দেখুন",
            consultancy: "ফ্রি ৩০ মিনিট পরামর্শ"
        },
        cta: {
            title: "ম্যাজিক তৈরি করতে প্রস্তুত?",
            desc: "চলুন আপনার র ফুটেজকে মাস্টারপিসে পরিণত করি।",
            btn: "প্রজেক্ট শুরু করুন"
        },
        services: {
            title: "আমাদের দক্ষতা",
            subtitle: "আমরা শুধু ভিডিও এডিট করি না, আমরা ব্র্যান্ড তৈরি করি।",
            videoTitle: "ভাইরাল Video এডিটিং",
            videoDesc: "Reels, TikToks এবং Shorts-এর জন্য হাই-রিটেনশন এডিটিং যা দর্শকদের ধরে রাখে।",
            graphicTitle: "Graphic ডিজাইন",
            graphicDesc: "দৃষ্টিনন্দন সোশ্যাল মিডিয়া পোস্ট, ক্যারোসেল এবং থাম্বনেল যা স্ক্রল থামিয়ে দেয়।",
            webTitle: "ওয়েব ডেভেলপমেন্ট",
            webDesc: "হাই-পারফরম্যান্স, রেসপন্সিভ ওয়েবসাইট এবং ওয়েব অ্যাপ্লিকেশন যা আপনার ব্র্যান্ডকে ডিজিটালে প্রতিষ্ঠিত করে।"
        },
        showreel: {
            title: "আমাদের ভাইরাল এডিটসমূহ",
            subtitle: "আমাদের সেরা রিলগুলো দেখতে সোয়াইপ করুন।"
        },
        graphicPreview: {
            title: "নির্বাচিত গ্রাফিক্স",
            subtitle: "ভিজ্যুয়াল যা কনভার্ট করে।",
            viewGallery: "গ্যালারি দেখুন",
            requestDesign: "অনুরূপ ডিজাইন অনুরোধ করুন"
        },
        results: {
            title: "ব্যবসায়িক ফলাফল",
            subtitle: "স্কেলেবল ভিডিও প্রোডাকশন যা গ্রোথ ড্রাইভ করে।",
            label1: "১০০k+ ভিউ সহ রিলস",
            label2: "গড় রিটেনশন রেট",
            label3: "ক্লায়েন্ট রেভিনিউ জেনারেটেড"
        },
        packages: {
            title: "প্যাকেজসমূহ",
            subtitle: "আপনার প্রয়োজন অনুযায়ী স্কেলেবল প্যাকেজ।",
            pkg1: { name: "স্ট্যান্ডার্ড", desc: "ছোট ব্যবসা এবং নির্মাতাদের জন্য নিখুঁত।", price: "$৫০০", cta: "স্ট্যান্ডার্ড নিন", features: ["সর্বোচ্চ ৫ মিনিট ভিডিও", "বেসিক কালার গ্রেডিং", "সাউন্ড ডিজাইন", "২টি রিভিশন"] },
            pkg2: { name: "প্রিমিয়াম", desc: "হাই-এন্ড প্রোডাকশন এবং ব্র্যান্ডের জন্য।", price: "$৯০০", cta: "প্রিমিয়াম নিন", features: ["সর্বোচ্চ ১৫ মিনিট ভিডিও", "অ্যাডভান্সড কালার গ্রেডিং", "মোশন গ্রাফিক্স", "আনলিমিটেড রিভিশন", "সোর্স ফাইল"] },
            pkg3: { name: "এন্টারপ্রাইজ", desc: "বড় স্কেলের প্রয়োজনের জন্য কাস্টমাইজড সমাধান।", price: "কাস্টম", cta: "যোগাযোগ করুন", features: ["ডেডিকেটেড এডিটর", "দৈনিক টার্নঅ্যারাউন্ড", "প্রায়োরিটি সাপোর্ট", "স্ট্র্যাটেজি সেশন"] },
            pkg4: { name: "কাস্টম", desc: "নির্দিষ্ট প্রয়োজনীয়তা? চলুন কথা বলি।", price: "ভেরিয়েবল", cta: "যোগাযোগ করুন", features: ["কাস্টম স্কোপ", "ফ্লেক্সিবল টাইমলাইন", "সম্পূর্ণ রাইটস"] },
            btnStandard: "স্ট্যান্ডার্ড নিন",
            btnPopular: "প্রিমিয়াম নিন",
            mostPopular: "জনপ্রিয়"
        },
        testimonials: {
            title: "সাফল্যের গল্প",
            subtitle: "যেসব ক্রিয়েটরদের আমরা অনলাইনে ভাইরাল হতে সাহায্য করেছি।"
        },
        clientReviews: {
            title: "ক্লায়েন্ট ভালোবাসা"
        },
        about: {
            titleLine1: "ABOUT",
            titleLine2: "ME",
            desc1: "আমি একজন প্যাশনেট ক্রিয়েটর যিনি ভিজ্যুয়াল আর্টের মাধ্যমে গল্পকে জীবন্ত করে তুলতে নিবেদিত।",
            desc2: "ইন্ডাস্ট্রিতে ৫ বছরেরও বেশি অভিজ্ঞতার সাথে, আমি টেক স্টার্টআপ থেকে শুরু করে লাইফস্টাইল ইনফ্লুয়েন্সার পর্যন্ত বিভিন্ন ক্লায়েন্টের সাথে কাজ করেছি। আমার লক্ষ্য শুধু ভিডিও এডিট করা নয়, বরং এমন আকর্ষণীয় ন্যারেটিভ তৈরি করা যা দর্শকদের সাথে সংযোগ স্থাপন করে।",
            btn: "আমাদের গল্প পড়ুন",
            stats: {
                exp: "বছরের অভিজ্ঞতা",
                projects: "প্রজেক্ট ডেলিভারি",
                views: "ভিউ জেনারেটেড",
                support: "ডেডিকেটেড সাপোর্ট"
            }
        },
        team: {
            title: "আমাদের টিম",
            subtitle: "আপনার ভাইরাল কন্টেন্টের পেছনের কারিগররা।"
        },
        clients: {
            label: "যাদের সাথে কাজ করেছি",
            title: "সেরা ব্র্যান্ডদের দ্বারা বিশ্বস্ত"
        },
        footer: {
            tagline: "ভিজ্যুয়াল স্টোরিটেলিং রিডিফাইন্ড",
            quickLinks: "দ্রুত লিঙ্ক",
            connect: "যুক্ত হোন",
            rights: "Rana Edits. সর্বস্বত্ব সংরক্ষিত।",
            contact: "যোগাযোগ",
            address: "ঢাকা, বাংলাদেশ",
            phone: "+৮৮০ ১৭০০-০০০০০০",
            copyright: "সর্বস্বত্ব সংরক্ষিত।"
        },
        // Inner Pages
        videoPage: {
            title: "ভিডিও প্রজেক্টস",
            subtitle: "সিনেম্যাটিক এডিটিং যা আপনার গল্প বলে এবং দর্শকদের ধরে রাখে।",
            horizontalTitle: "হরাইজন্টাল ভিডিও",
            verticalTitle: "ভার্টিকাল শর্টস এবং রিলস",
            ctaTitle: "আপনার ফুটেজকে রূপান্তর করুন",
            ctaDesc: "আপনার র ক্লিপগুলোকে সিনেম্যাটিক মাস্টারপিসে পরিণত করতে প্রস্তুত? আসুন এমন ভিডিও তৈরি করি যা স্ক্রল থামিয়ে দেয়।",
            ctaBtn: "এডিট বুক করুন"
        },
        graphicPage: {
            title: "Graphic ডিজাইন",
            subtitle: "ভিজ্যুয়াল স্টোরিটেলিং যা আপনার ব্র্যান্ডকে উচ্চতায় নিয়ে যায়।",
            ctaTitle: "অত্যাশ্চর্য ভিজ্যুয়াল প্রয়োজন?",
            ctaDesc: "লোগো থেকে সোশ্যাল মিডিয়া পোস্ট পর্যন্ত, আমি এমন গ্রাফিক্স ডিজাইন করি যা মনোযোগ আকর্ষণ করে এবং আপনার ব্র্যান্ডের অনন্য পরিচয় তুলে ধরে।",
            ctaBtn: "আপনার ডিজাইন নিন",
            galleryModalDesc: "মনোযোগ আকর্ষণ করতে এবং আপনার ব্র্যান্ড ভ্যালু কার্যকরভাবে যোগাযোগ করতে প্রফেশনাল ডিজাইন।",
            galleryModalBtn: "এই ধরনের ডিজাইন নিন"
        },
        contactPage: {
            title: "যোগাযোগ করুন",
            subtitle: "আপনার কন্টেন্ট স্কেল করতে প্রস্তুত? একটি স্ট্র্যাটেজি কল বুক করুন বা আমাদের মেসেজ পাঠান।",
            bookCallTitle: "স্ট্র্যাটেজি কল বুক করুন",
            bookCallDesc: "ইমেল ট্যাগ এড়িয়ে যান। আপনার কন্টেন্ট প্রয়োজন নিয়ে আলোচনা করতে রানার সাথে সরাসরি ১৫ মিনিটের পরামর্শ শিডিউল করুন।",
            calendlyPlaceholder: "ক্যালেন্ডলি উইজেট এখানে প্রদর্শিত হবে",
            openCalendly: "ক্যালেন্ডলি খুলুন",
            form: {
                title: "বার্তা পাঠান",
                subtitle: "নিচের ফর্মটি পূরণ করুন বা সরাসরি কল বুক করুন।",
                name: "নাম",
                business: "ব্যবসার ধরন",
                budget: "মাসিক কন্টেন্ট বাজেট",
                budgetPlaceholder: "বাজেট রেঞ্জ নির্বাচন করুন",
                instagram: "ইনস্টাগ্রাম লিঙ্ক",
                goal: "প্রধান লক্ষ্য",
                send: "মেসেজ পাঠান",
                sending: "পাঠানো হচ্ছে...",
                successTitle: "মেসেজ পাঠানো হয়েছে!",
                successDesc: "আমরা ২৪ ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করব।",
                sendAnother: "আরেকটি পাঠান"
            }
        },
        portfolioPage: {
            title: "আমাদের পোর্টফোলিও",
            subtitle: "আমাদের সাম্প্রতিক কাজগুলো দেখুন এবং জানুন কিভাবে আমরা ব্র্যান্ডগুলোকে আলাদা হতে সাহায্য করি।",
            all: "সব",
            categories: {
                reels: "রিলস",
                business: "বিজনেস",
                personalBrand: "পার্সোনাল ব্র্যান্ড",
                ecommerce: "ই-কমার্স"
            }
        },
        faq: {
            title: "সচরাচর জিজ্ঞাসিত প্রশ্ন",
            subtitle: "আমার সাথে কাজ করার বিষয়ে আপনার যা জানা প্রয়োজন।",
            q1: "আপনার এডিটিং ডেলিভারি টাইম কত?",
            a1: "অধিকাংশ প্রজেক্টের জন্য আমি ৪৮ ঘন্টার মধ্যে প্রথম ড্রাফ্ট ডেলিভারি দেই। তবে জটিল প্রজেক্টে ৩-৫ দিন লাগতে পারে। কাজ শুরুর আগেই আমি টাইমলাইন জানিয়ে দিই।",
            q2: "আপনি কি রিভিশন সুবিধা দেন?",
            a2: "হ্যাঁ! আপনি ১০০% সন্তুষ্ট না হওয়া পর্যন্ত আমি আনলিমিটেড রিভিশন দেই। আমার লক্ষ্য আপনার রিটেনশন এবং এনগেজমেন্ট সর্বোচ্চ করা।",
            q3: "আপনি কোন সফটওয়্যার ব্যবহার করেন?",
            a3: "ভিডিও এডিটিংয়ের জন্য আমি মূলত Adobe Premiere Pro এবং After Effects ব্যবহার করি। গ্রাফিক্সের জন্য Photoshop এবং Illustrator।"
        },
        resultsPage: {
            heroTitle: "যাচাইকৃত ফলাফল",
            heroSubtitle: "আমরা শুধু ভিডিও এডিট করি না। আমরা এমন কন্টেন্ট তৈরি করি যা অ্যালগরিদম ডমিনেট করে এবং ম্যাসিভ গ্রোথ নিয়ে আসে।",
            ctaTitle: "ভাইরাল হতে প্রস্তুত?",
            ctaSubtitle: "অনুমান করা বন্ধ করুন। গ্রোথ শুরু করুন। আজই সেরা ১% ক্রিয়েটরদের সাথে যোগ দিন।",
            ctaBtn: "এখনই শুরু করুন",
            viralStrategy: "ভাইরাল গ্রোথ স্ট্র্যাটেজি",
            clientSatisfaction: "ক্লায়েন্ট সন্তুষ্টি",
            strategies: {
                s1: { title: "Alex Hormozi স্টাইল", desc: "দ্রুত গতির, ডাইনামিক ক্যাপশন, এনগেজিং বি-রোল।" },
                s2: { title: "Iman Gadzhi স্টাইল", desc: "সিনেম্যাটিক স্টোরিটেলিং, সাউন্ড ডিজাইন, প্রিমিয়াম ফিল।" },
                s3: { title: "পডকাস্ট ক্লিপস", desc: "হুক হাইলাইট করা, ভার্টিকাল ফরম্যাটের জন্য রি-ফ্রেমিং।" },
                s4: { title: "এডুকেশনাল কন্টেন্ট", desc: "পরিষ্কার ডেলিভারি, ভিজ্যুয়াল এইডস, রিটেনশন এডিটিং।" }
            }
        },
        webDev: {
            heroTitle: "আমরা কোডে কথা বলি। আপনি ম্যাজিক দেখেন।",
            heroSubtitle: "ফুল-স্ট্যাক ইঞ্জিনিয়ারিং এবং সিনেম্যাটিক ডিজাইন। আমরা পিক্সেল-পারফেক্ট, হাই-পারফরম্যান্স ওয়েবসাইট তৈরি করি যা আপনার অডিয়েন্সকে কনভার্ট করে।",
            systemOnline: "সিস্টেম অনলাইন: V.2.0.4",
            startProject: "প্রজেক্ট শুরু করুন",
            viewWork: "কাজ দেখুন",
            selectedDeployments: "নির্বাচিত প্রজেক্টস",
            shippingRecords: "সাম্প্রতিক কাজের রেকর্ড।",
            viewGithub: "GitHub দেখুন",
            initializeSequence: "সিকোয়েন্স শুরু করুন",
            terminalProtocol: "ব্রিফিংয়ের জন্য নিচের টার্মিনাল প্রোটোকলটি পূরণ করুন।",
            projects: {
                p1: { title: "ই-কমার্স আল্ট্রা", category: "Next.js স্টোর", desc: "৯৯/১০০ লাইটহাউস স্কোর সহ হাই-পারফরম্যান্স হেডলেস ই-কমার্স।" },
                p2: { title: "SaaS ড্যাশবোর্ড প্রোফাইল", category: "অ্যাডমিন প্যানেল", desc: "রিয়েল-টাইম অ্যানালিটিক্স ড্যাশবোর্ড এবং জটিল ডেটা ভিজ্যুয়ালাইজেশন।" },
                p3: { title: "ক্রিয়েটিভ পোর্টফোলিও ২০২৫", category: "awwwards স্টাইল", desc: "অ্যাওয়ার্ড-উইনিং অ্যানিমেশন হেভি পোর্টফোলিও সাইট।" }
            }
        },
        codeTransform: {
            badge: "ফুল স্ট্যাক ইঞ্জিনিয়ারিং",
            title: "আমরা শুধু ভিডি এডিট করি না। আমরা ডিজিটাল এম্পায়ার তৈরি করি।",
            desc: "হাই-পারফরম্যান্স ল্যান্ডিং পেজ থেকে জটিল ওয়েব অ্যাপ্লিকেশন পর্যন্ত। আমরা আপনার কোডেও সেই একই সিনেম্যাটিক কোয়ালিটি নিয়ে আসি যা আমরা আপনার ভিডিওতে দিই।",
            feature1: "React / Next.js",
            feature2: "হাই পারফরম্যান্স",
            cta: "ওয়েব সার্ভিস এক্সপ্লোর করুন"
        },
        terminal: {
            user: "user@rana-edits:~",
            lastLogin: "শেষ লগইন:",
            welcome: "Rana Edits টার্মিনালে স্বাগতম। আসুন দারুণ কিছু তৈরি করি।",
            complete: "সিকোয়েন্স সম্পন্ন",
            received: "আমরা আপনার সিগন্যাল পেয়েছি। যোগাযোগের জন্য অপেক্ষা করুন।",
            restart: "./restart_sequence.sh",
            uploading: "ডেটা আপলোড হচ্ছে...",
            steps: {
                name: "আপনার পরিচয় (নাম):",
                namePlaceholder: "উদাঃ জন দো",
                email: "যোগাযোগ প্রোটোকল (ইমেইল):",
                emailPlaceholder: "john@example.com",
                projectType: "প্রজেক্ট আর্কিটেকচার নির্বাচন করুন:",
                budget: "রিসোর্স অ্যালোকেশন (বাজেট):",
                details: "প্রজেক্ট স্পেসিফিকেশন:",
                detailsPlaceholder: "আপনার ভিশন বর্ণনা করুন..."
            },
            options: {
                ecommerce: "ই-কমার্স",
                portfolio: "পোর্টফোলিও",
                saas: "SaaS",
                corporate: "কর্পোরেট",
                custom: "কাস্টম অ্যাপ",
                budget1: "< ১০০০ ডলার",
                budget2: "১০০০ - ৩০০০ ডলার",
                budget3: "৩০০০ - ৫০০০ ডলার",
                budget4: "৫০০০+ ডলার"
            }
        }
    }
}

export function useTranslation() {
    const { language } = useLanguage()
    return {
        t: translations[language],
        language
    }
}
