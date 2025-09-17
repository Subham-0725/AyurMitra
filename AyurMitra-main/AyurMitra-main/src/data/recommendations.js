export const recommendations = {
    // --- Single Dosha ---
    "vata": {
        "therapy": "basti",
        "herbs": ["ashwagandha", "triphala", "dashmool"],
        "lifestyle": ["oil massage", "warm food", "rest", "regular sleep"]
    },
    "pitta": {
        "therapy": "virechana",
        "herbs": ["turmeric", "pippali", "amla"],
        "lifestyle": ["cooling diet", "hydration", "avoid spicy food", "evening walks"]
    },
    "kapha": {
        "therapy": "nasya",
        "herbs": ["ginger", "trikatu", "punarnava"],
        "lifestyle": ["exercise", "steam inhalation", "light diet", "early rising"]
    },

    // --- Dual Dosha ---
    "vata-pitta": {
        "therapy": "shirodhara",
        "herbs": ["brahmi", "shatavari"],
        "lifestyle": ["yoga", "meditation", "good sleep", "soothing music"]
    },
    "pitta-kapha": {
        "therapy": "raktamokshana",
        "herbs": ["neem", "guduchi"],
        "lifestyle": ["light cooling food", "evening meditation", "avoid oily food"]
    },
    "vata-kapha": {
        "therapy": "udvartana",
        "herbs": ["dry ginger", "musta", "cinnamon"],
        "lifestyle": ["dry massage", "regular exercise", "warm herbal teas"]
    },

    // --- Tri-doshic ---
    "sannipata": {
        "therapy": "panchakarma (combined)",
        "herbs": ["triphala", "guduchi", "haritaki"],
        "lifestyle": ["balanced diet", "mindful eating", "daily yoga", "breathing exercises"]
    },

    // --- Organ/Disease Specific ---
    "digestive-imbalance": {
        "therapy": "virechana",
        "herbs": ["triphala", "haritaki", "ginger"],
        "lifestyle": ["eat light", "avoid late-night meals", "warm water"]
    },
    "stress-related": {
        "therapy": "shirodhara",
        "herbs": ["jatamansi", "brahmi", "ashwagandha"],
        "lifestyle": ["deep breathing", "meditation", "journaling", "digital detox"]
    },
    "skin-disorders": {
        "therapy": "raktamokshana",
        "herbs": ["neem", "turmeric", "manjistha"],
        "lifestyle": ["avoid oily food", "cooling drinks", "herbal face wash"]
    },
    "respiratory-imbalance": {
        "therapy": "nasya",
        "herbs": ["tulsi", "pippali", "ginger"],
        "lifestyle": ["steam inhalation", "light breathing exercise", "avoid damp climate"]
    },
    "obesity": {
        "therapy": "udvartana",
        "herbs": ["trikatu", "guggul", "punarnava"],
        "lifestyle": ["regular exercise", "intermittent fasting", "avoid heavy meals"]
    },
    "diabetes": {
        "therapy": "virechana",
        "herbs": ["jamun seed", "meshshringi", "gudmar"],
        "lifestyle": ["low sugar diet", "morning walk", "yoga"]
    },
    "hypertension": {
        "therapy": "shirodhara",
        "herbs": ["sarpagandha", "jatamansi", "brahmi"],
        "lifestyle": ["calm environment", "salt reduction", "meditation"]
    },
    "arthritis": {
        "therapy": "basti",
        "herbs": ["dashmool", "shallaki", "guggul"],
        "lifestyle": ["oil massage", "gentle yoga", "avoid cold food"]
    },
    "insomnia": {
        "therapy": "shirodhara",
        "herbs": ["brahmi", "jatamansi", "tagar"],
        "lifestyle": ["warm milk", "fixed bedtime", "avoid screens at night"]
    },
    "migraine": {
        "therapy": "nasya",
        "herbs": ["jatamansi", "brahmi", "ashwagandha"],
        "lifestyle": ["avoid loud noise", "head massage", "deep breathing"]
    },
    "liver-disorders": {
        "therapy": "virechana",
        "herbs": ["bhumi amla", "kutki", "guduchi"],
        "lifestyle": ["avoid alcohol", "light food", "hydration"]
    },
    "kidney-disorders": {
        "therapy": "basti",
        "herbs": ["punarnava", "varuna", "gokshura"],
        "lifestyle": ["hydration", "low salt diet", "avoid excess protein"]
    },
    "cold-cough": {
        "therapy": "steam inhalation",
        "herbs": ["tulsi", "ginger", "black pepper"],
        "lifestyle": ["warm water", "avoid cold drinks", "light diet"]
    },
    "asthma": {
        "therapy": "nasya",
        "herbs": ["vasaka", "pippali", "licorice"],
        "lifestyle": ["avoid dust", "pranayama", "steam inhalation"]
    },
    "anemia": {
        "therapy": "rakta shodhana",
        "herbs": ["punarnava", "shatavari", "amla"],
        "lifestyle": ["iron-rich diet", "regular meals", "avoid stress"]
    },
    "eye-disorders": {
        "therapy": "netra-tarpana",
        "herbs": ["triphala", "amla", "brahmi"],
        "lifestyle": ["eye wash", "avoid late-night screen use", "cooling food"]
    },
    "skin-allergy": {
        "therapy": "lepa (herbal paste)",
        "herbs": ["turmeric", "neem", "sandalwood"],
        "lifestyle": ["avoid allergens", "hydration", "cool food"]
    },
    "fever": {
        "therapy": "sudation therapy",
        "herbs": ["tulsi", "ginger", "coriander"],
        "lifestyle": ["light khichdi", "bed rest", "herbal tea"]
    },
    "constipation": {
        "therapy": "basti",
        "herbs": ["triphala", "castor oil", "isabgol"],
        "lifestyle": ["fiber diet", "warm water", "early dinner"]
    },
    "gastritis": {
        "therapy": "virechana",
        "herbs": ["amla", "licorice", "shatavari"],
        "lifestyle": ["avoid spicy food", "cooling diet", "hydration"]
    },
    "ulcer": {
        "therapy": "pitta pacification",
        "herbs": ["amla", "yashtimadhu", "shatavari"],
        "lifestyle": ["soft food", "no alcohol", "avoid stress"]
    },
    "thyroid": {
        "therapy": "nasya",
        "herbs": ["kanchanar", "guggul", "punarnava"],
        "lifestyle": ["iodine-rich food", "morning walk", "stress management"]
    },
    "fertility-support": {
        "therapy": "uttarbasti",
        "herbs": ["ashwagandha", "shatavari", "gokshura"],
        "lifestyle": ["stress-free life", "balanced diet", "yoga"]
    },
    "pregnancy-care": {
        "therapy": "abhyanga (gentle massage)",
        "herbs": ["shatavari", "amla", "ashwagandha"],
        "lifestyle": ["rest", "nourishing food", "meditation"]
    },
    "postnatal-care": {
        "therapy": "abhyanga + basti",
        "herbs": ["dashmool", "shatavari", "ajwain"],
        "lifestyle": ["light diet", "oil massage", "rest"]
    },
    "menstrual-disorders": {
        "therapy": "basti",
        "herbs": ["ashoka", "lodhra", "shatavari"],
        "lifestyle": ["warm bath", "gentle yoga", "hydration"]
    },
    "pcos": {
        "therapy": "virechana + basti",
        "herbs": ["triphala", "ashoka", "lodhra"],
        "lifestyle": ["exercise", "avoid junk food", "stress reduction"]
    },
    "male-infertility": {
        "therapy": "vajikarana therapy",
        "herbs": ["ashwagandha", "shilajit", "gokshura"],
        "lifestyle": ["balanced diet", "stress-free life", "exercise"]
    },
    "immune-boosting": {
        "therapy": "rasayana",
        "herbs": ["giloy", "amla", "tulsi"],
        "lifestyle": ["seasonal fruits", "regular yoga", "adequate sleep"]
    },
    "aging-support": {
        "therapy": "rasayana rejuvenation",
        "herbs": ["amla", "ashwagandha", "shatavari"],
        "lifestyle": ["light diet", "meditation", "herbal tea"]
    },
    "memory-support": {
        "therapy": "shirodhara",
        "herbs": ["brahmi", "shankhpushpi", "ashwagandha"],
        "lifestyle": ["mental exercises", "adequate sleep", "avoid multitasking"]
    },
    "hair-fall": {
        "therapy": "shiro-abhyanga",
        "herbs": ["bhringraj", "amla", "neem"],
        "lifestyle": ["oil massage", "avoid stress", "protein-rich diet"]
    },
    "dandruff": {
        "therapy": "shiro-abhyanga",
        "herbs": ["neem", "amla", "fenugreek"],
        "lifestyle": ["oil massage", "mild shampoo", "avoid excessive hair products"]
    },
    "weight-gain": {
        "therapy": "basti",
        "herbs": ["ashwagandha", "shatavari", "ghee"],
        "lifestyle": ["nutritious food", "yoga", "regular meals"]
    },
    "weight-loss": {
        "therapy": "udvartana",
        "herbs": ["triphala", "trikatu", "guggul"],
        "lifestyle": ["exercise", "early dinner", "avoid fried foods"]
    },
    "fatigue": {
        "therapy": "rasayana",
        "herbs": ["ashwagandha", "amla", "shilajit"],
        "lifestyle": ["rest", "nutritious food", "yoga"]
    },
    "low-immunity-children": {
        "therapy": "swarnaprashana",
        "herbs": ["turmeric", "amla", "tulsi"],
        "lifestyle": ["outdoor play", "seasonal diet", "adequate sleep"]
    }
}
