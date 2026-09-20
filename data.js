const places = [{
        id: 1,
        name: "Gateway of India",
        cat: "historic",
        lat: 18.9220,
        lng: 72.8347,
        address: "Apollo Bandar, Colaba, Mumbai",
        history: "Gateway of India ka foundation stone 1911 me rakha gaya aur monument 1924 me complete hua.",
        desc: "Mumbai ka iconic historical monument aur Elephanta ferry ka main point.",
        time: "Subah 7-10 ya shaam 4-7",
        months: [10, 11, 12, 1, 2, 3],
        fee: "Free; ferry ticket alag",
        budget: "₹150-₹800",
        food: "Colaba Causeway aur nearby cafes",
        tip: "Ferry timing pehle check karein."
    },
    {
        id: 2,
        name: "Marine Drive",
        cat: "viewpoint",
        lat: 18.9430,
        lng: 72.8238,
        address: "Netaji Subhash Chandra Bose Road, Mumbai",
        history: "Marine Drive Mumbai ka famous sea-facing boulevard hai.",
        desc: "Queen's Necklace, sunset aur night view ke liye famous.",
        time: "Sunset ke baad",
        months: [10, 11, 12, 1, 2, 3, 4],
        fee: "Free",
        budget: "₹100-₹600",
        food: "Girgaum Chowpatty",
        tip: "Weekend par crowd zyada hota hai."
    },
    {
        id: 3,
        name: "Juhu Beach",
        cat: "beach",
        lat: 19.0988,
        lng: 72.8267,
        address: "Juhu Beach, Mumbai",
        history: "Juhu Mumbai ke popular beach areas me se ek hai.",
        desc: "Sunset, street food aur local atmosphere ke liye famous.",
        time: "Shaam 5-8",
        months: [10, 11, 12, 1, 2, 3, 4],
        fee: "Free",
        budget: "₹150-₹800",
        food: "Pav bhaji, bhel puri aur kulfi",
        tip: "Monsoon me high tide se safe distance rakhein."
    },
    {
        id: 4,
        name: "Siddhivinayak Temple",
        cat: "religious",
        lat: 19.0169,
        lng: 72.8306,
        address: "Prabhadevi, Mumbai",
        history: "Mumbai ka famous Lord Ganesha temple hai.",
        desc: "Religious tourism aur devotees ke liye important place.",
        time: "Weekday subah jaldi",
        months: [1, 2, 3, 10, 11, 12],
        fee: "Free",
        budget: "₹100-₹500",
        food: "Dadar aur Prabhadevi snacks",
        tip: "Festival days par crowd bahut zyada hoti hai."
    },
    {
        id: 5,
        name: "Sanjay Gandhi National Park",
        cat: "nature",
        lat: 19.2147,
        lng: 72.9106,
        address: "Borivali East, Mumbai",
        history: "Mumbai ke andar located major urban national park hai.",
        desc: "Nature trails, wildlife aur Kanheri Caves ke liye famous.",
        time: "Subah 7:30 se dopahar",
        months: [10, 11, 12, 1, 2, 3],
        fee: "Entry ticket applicable",
        budget: "₹300-₹1,000",
        food: "Borivali food areas",
        tip: "Water bottle aur comfortable shoes lekar jaen."
    },
    {
        id: 6,
        name: "Colaba Causeway",
        cat: "market",
        lat: 18.9225,
        lng: 72.8314,
        address: "Shahid Bhagat Singh Road, Colaba",
        history: "South Mumbai ka famous heritage shopping district hai.",
        desc: "Clothes, jewellery, souvenirs aur street shopping ke liye famous.",
        time: "Late morning se evening",
        months: [10, 11, 12, 1, 2, 3, 4],
        fee: "Free",
        budget: "₹300-₹3,000",
        food: "Colaba cafes aur street food",
        tip: "Bargaining zaroor karein."
    }
];

const festivals = [{
        id: "ganesh",
        name: "Ganesh Chaturthi",
        month: "August / September",
        history: "Mumbai me public Ganesh festival tradition late 19th century me popular hua.",
        desc: "Pandal, darshan, aarti aur visarjan procession is festival ki main attractions hain.",
        tip: "Weekday morning best hota hai. Last days me crowd bahut zyada hota hai.",
        photos: [],
        venues: [
            [
                "Lalbaugcha Raja",
                "GD Ambekar Marg, Lalbaug",
                18.9915,
                72.8377,
                "Currey Road / Chinchpokli",
                "Central Line se Currey Road ya Chinchpokli; wahan se walk/auto",
                "Famous Ganpati idol aur grand pandal",
                "₹200-₹800"
            ],
            [
                "Ganesh Galli Mumbaicha Raja",
                "Ganesh Galli, Lalbaug",
                18.9910,
                72.8390,
                "Currey Road / Chinchpokli",
                "Station se walk ya auto",
                "Themed pandal aur artistic decoration",
                "₹200-₹700"
            ],
            [
                "Andhericha Raja",
                "Veera Desai Road, Andheri West",
                19.1364,
                72.8337,
                "Andheri West Metro",
                "Metro ke baad auto",
                "Western suburbs ka famous pandal",
                "₹200-₹800"
            ]
        ]
    },
    {
        id: "diwali",
        name: "Diwali",
        month: "October / November",
        history: "Mumbai me Diwali lights, diyas, rangoli, sweets aur shopping ke saath celebrate hoti hai.",
        desc: "Festival of lights aur festive atmosphere ke liye famous.",
        tip: "Marine Drive aur Bandra public viewing ke liye achhe places hain.",
        photos: [],
        venues: [
            [
                "Marine Drive",
                "Netaji Subhash Chandra Bose Road",
                18.9430,
                72.8238,
                "Churchgate / Charni Road",
                "Western Line ke baad walk ya taxi",
                "Lights aur sea view",
                "₹100-₹700"
            ],
            [
                "Bandra Bandstand",
                "Bandstand Promenade, Bandra West",
                19.0437,
                72.8194,
                "Bandra",
                "Bandra station se auto/cab",
                "Sea-side lights aur festive walk",
                "₹100-₹800"
            ]
        ]
    }
];

const foodPlaces = [
    [
        "Juhu Food Area",
        "Juhu Beach, Mumbai",
        19.0988,
        72.8267,
        "Pav bhaji, bhel puri, sev puri aur kulfi",
        "₹150-₹800",
        "Vile Parle"
    ],
    [
        "Mohammed Ali Road",
        "Bhendi Bazaar, South Mumbai",
        18.9551,
        72.8293,
        "Kebab, biryani, nihari, malpua aur falooda",
        "₹300-₹1,200",
        "Masjid Bunder"
    ],
    [
        "Matunga Food Area",
        "Matunga East and West",
        19.0269,
        72.8552,
        "Dosa, idli, vada aur filter coffee",
        "₹150-₹600",
        "King's Circle"
    ],
    [
        "Bandra Cafe Area",
        "Carter Road and Bandstand",
        19.0600,
        72.8360,
        "Cafes, pizza, burgers aur desserts",
        "₹400-₹1,500",
        "Bandra"
    ]
];

const hotels = [
    [
        "Colaba Stay Area",
        "Colaba, South Mumbai",
        18.9220,
        72.8347,
        "₹1,500-₹10,000+",
        "Gateway, CSMT aur Colaba",
        "Churchgate se taxi/bus"
    ],
    [
        "Bandra Stay Area",
        "Bandra West",
        19.0600,
        72.8360,
        "₹2,500-₹12,000+",
        "Bandra, Juhu aur cafes",
        "Bandra station, auto aur Metro"
    ],
    [
        "Andheri Stay Area",
        "Andheri East and West",
        19.1197,
        72.8468,
        "₹1,500-₹8,000",
        "Airport, Juhu aur Film City",
        "Andheri station aur Metro"
    ],
    [
        "Dadar-Parel Stay Area",
        "Dadar, Parel and Prabhadevi",
        19.0178,
        72.8478,
        "₹1,200-₹7,000",
        "Siddhivinayak aur Central Mumbai",
        "Dadar station"
    ]
];