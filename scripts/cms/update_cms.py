import json
import os

with open('src/data/cms.json', 'r') as f:
    cms_data = json.load(f)

cms_data['pages']['grocery'] = {
    "title": "Fresh. Organic.",
    "subtitle": "Better Living.",
    "sections": {
        "hero": {
            "title": "Daily Harvest",
            "description": "Organic Heirloom Selection",
            "image": "https://plus.unsplash.com/premium_photo-1663039978847-63f7484bf701?q=80&w=1600"
        },
        "philosophy": {
            "title": "Health Begins with Everyday Choices",
            "description": "The food we eat impacts every aspect of our wellbeing. At AIRO Essentials, we believe access to high-quality ingredients should be simple, convenient, and inspiring. Our approach focuses on sourcing products that support healthier lifestyles while maintaining exceptional standards for quality and freshness.",
            "image": "https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1600"
        },
        "categories": [
            { "title": "Fresh & Organic Produce", "description": "Farm-fresh fruits, vegetables, herbs, microgreens, salads, and cold-pressed juices.", "image": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800" },
            { "title": "Premium Proteins", "description": "Fresh poultry, seafood, meats, eggs, and plant-based protein alternatives.", "image": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800" },
            { "title": "Dairy & Alternatives", "description": "Traditional dairy products alongside modern plant-based options designed for diverse lifestyles.", "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=800" },
            { "title": "Pantry Essentials", "description": "Rice, grains, oils, baking ingredients, cereals, pulses, and everyday kitchen staples.", "image": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800" },
            { "title": "Bakery & Ready-to-Eat", "description": "Freshly baked breads, pastries, sandwiches, wraps, salads, and prepared meals.", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800" },
            { "title": "Frozen Foods", "description": "Convenient premium frozen options without compromising on quality.", "image": "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=800" },
            { "title": "Beverages", "description": "Coffee, tea, juices, hydration products, and functional wellness beverages.", "image": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800" },
            { "title": "Snacks & Wellness Foods", "description": "Protein snacks, nuts, dried fruits, chocolates, and healthier alternatives.", "image": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=800" },
            { "title": "Global Foods", "description": "A curated selection of international products inspired by cuisines from around the world.", "image": "https://images.unsplash.com/photo-1511381939415-e440c082180e?q=80&w=800" },
            { "title": "Home Essentials", "description": "Thoughtfully selected household and everyday living products.", "image": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800" }
        ]
    }
}

cms_data['pages']['minuteClinic'] = {
    "title": "Healthcare For The",
    "subtitle": "Way Life Happens.",
    "sections": {
        "hero": {
            "title": "Diagnostics & Prevention",
            "description": "Advanced Biomarker Screenings",
            "image": "https://plus.unsplash.com/premium_photo-1675686363422-7d7ab88ee530?q=80&w=1600"
        },
        "friction": {
            "title": "Healthcare Without the Friction",
            "description": "Getting quality care shouldn't require weeks of waiting. AIRO Minute Clinic was created to provide faster access to healthcare services for individuals and families seeking preventive care, everyday medical support, and ongoing wellness guidance.",
            "image": "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1600"
        },
        "prevention": {
            "title": "Designed Around Prevention",
            "description": "We go beyond treating symptoms to understand the broader picture of your health. Through biomarker testing, preventative screenings, and targeted lifestyle interventions, we help patients identify potential issues before they become chronic conditions.",
            "image": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1600"
        }
    }
}

cms_data['pages']['pharmacy'] = {
    "title": "Modern Pharmacy.",
    "subtitle": "Personalized Wellness.",
    "sections": {
        "hero": {
            "title": "Premium Pharmacy Care",
            "description": "Everyday Prescriptions & Clinical Support",
            "image": "/pharmacy-hero.jpg"
        },
        "compounding": {
            "title": "Precision Care, Tailored For You",
            "description": "Not every patient’s needs are met by off-the-shelf medications. AIRO Compounding offers customized formulations—from tailored dosages and hormone therapies to specialized dermatological preparations—designed precisely for your unique biology.",
            "image": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=1600"
        },
        "everyday": {
            "title": "Seamless Everyday Prescriptions",
            "description": "Managing your daily medications should be effortless. With AIRO Pharmacy, you get streamlined prescription management, transparent access to pharmacists, and coordinated care that aligns perfectly with your overall health journey.",
            "image": "https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=1600"
        }
    }
}

cms_data['pages']['healthChair'] = {
    "title": "Precision Longevity.",
    "subtitle": "In Five Minutes.",
    "sections": {
        "hero": {
            "title": "AIRO Praana",
            "description": "Comprehensive Vitals Assessment",
            "image": "/airo-praana-hero.png"
        },
        "assessment": {
            "title": "The Ultimate 5-Minute Assessment",
            "description": "The AIRO Praana chair delivers a comprehensive look at your cardiovascular, respiratory, and metabolic health without an invasive procedure. Sit back, relax, and let non-contact sensors analyze your core vitality metrics in real-time.",
            "image": "https://images.unsplash.com/photo-1505587043598-a6da2ce15aa5?q=80&w=1600"
        },
        "insights": {
            "title": "Actionable Biomarker Insights",
            "description": "Knowledge is only power when you can act on it. AIRO Praana translates complex physiological data into clear, personalized protocols for fitness, recovery, and nutrition.",
            "image": "https://plus.unsplash.com/premium_photo-1681995449767-17ed4fb8b0d4?q=80&w=1600"
        }
    }
}

with open('src/data/cms.json', 'w') as f:
    json.dump(cms_data, f, indent=2)

print("Updated cms.json successfully!")
