import json

with open('src/data/cms.json', 'r') as f:
    cms_data = json.load(f)

cms_data['pages']['contact'] = {
    "title": "Get In Touch",
    "subtitle": "We're here to help",
    "sections": {
        "details": {
            "title": "Contact Details",
            "phone": "1-800-AIRO-WELL",
            "email": "concierge@airoessentials.com",
            "address": "123 Wellness Boulevard, Suite 100, Los Angeles, CA 90024"
        }
    }
}

with open('src/data/cms.json', 'w') as f:
    json.dump(cms_data, f, indent=2)

print("Added contact page to cms.json")
