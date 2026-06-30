import json

def simplify_copy():
    with open('src/data/cms.json', 'r') as f:
        data = json.load(f)

    # Home Page
    data['pages']['home']['tagline'] = "A complete health network connecting healthy food, clinics, pharmacy, and online care."
    data['pages']['home']['description'] = "At AIRO, we believe in preventing illness before it happens. We bring together expert medical care and daily wellness to help you live a longer, healthier life."
    
    data['pages']['home']['sections']['pillars']['essentials']['subtitle'] = "Fresh • Organic • Local • Healthy Groceries"
    data['pages']['home']['sections']['pillars']['essentials']['description'] = "A hand-picked market of fresh, organic fruits, vegetables, and healthy groceries to keep you healthy from the inside out."
    
    data['pages']['home']['sections']['pillars']['pharmacy']['subtitle'] = "Medicines • Supplements • Custom Pharmacy"
    data['pages']['home']['sections']['pillars']['pharmacy']['description'] = "Expert pharmacy services with custom medicines, daily supplements, and health advice made just for you."
    
    data['pages']['home']['sections']['pillars']['clinic']['subtitle'] = "Preventive Care • Walk-In Clinics • Health Checks"
    data['pages']['home']['sections']['pillars']['clinic']['description'] = "Easy access to doctors in-person and online. Get check-ups, treatments, and vaccines quickly."

    data['pages']['home']['sections']['praana']['tagline'] = "A 5-minute health check. A lifetime of good health."
    data['pages']['home']['sections']['praana']['description'] = "Experience the future of health checks. The AIRO Smart Chair measures your body's important health signs in just minutes, helping doctors create a personal health plan for you."
    data['pages']['home']['sections']['praana']['connectedCareText'] = "Your results are instantly saved to your secure health profile and shared with your doctors. If needed, you can talk directly to a doctor online right away."

    data['pages']['home']['sections']['manifesto']['text'] = "A new way to live a long, healthy life. We combine organic food, exact health checks, custom medicines, and online doctor visits into one simple platform. Welcome to the new standard of living well."

    # Ecosystem Categories
    for cat in data['pages']['home']['sections']['ecosystemCategories']:
        if cat['name'] == 'Pharmacy':
            cat['description'] = "Expert pharmacy care, long-life treatments, and daily health supplements."
        elif cat['name'] == 'Minute Clinic':
            cat['description'] = "Walk-in care, vaccines, and everyday doctor visits."
        elif cat['name'] == 'Diagnostics':
            cat['description'] = "Full body health checks, blood tests, and routine screenings."
        elif cat['name'] == 'Compounding Pharmacy':
            cat['description'] = "Custom-made medicines and allergy-free health mixtures."
        elif cat['name'] == 'IV Therapy':
            cat['description'] = "Direct vitamin drips and instant body hydration."
        elif cat['name'] == 'Digital Health':
            cat['description'] = "Track your health, talk to doctors online, and view your records."

    # Health Page
    data['pages']['health']['tagline'] = "Top-quality medicines, long-life treatments, walk-in clinics, and advanced health checks."
    data['pages']['health']['sections']['praana']['description'] = "A 5-minute health check. A lifetime of good health."
    data['pages']['health']['sections']['praana']['bodyText'] = "Experience the future of health checks. The AIRO Smart Chair measures your body's important health signs in just minutes, helping doctors create a personal health plan for you."

    # About Page
    data['pages']['about']['hero']['title'] = "A New Era of Long and Healthy Living"
    data['pages']['about']['hero']['description'] = "AIRO was built to change how we think about health. Instead of just treating sickness, we focus on keeping you healthy every day. We bring together advanced health checks, custom pharmacies, physical clinics, and organic grocery stores into one easy system."
    
    pillars = data['pages']['about']['trustFramework']['pillars']
    pillars[0]['description'] = "Every health check, blood test, and custom medicine is reviewed and approved by our expert doctors. We only give treatments based on real test results, not trends."
    pillars[1]['description'] = "Our pharmacy makes custom medicines in highly clean and safe rooms, following strict international quality and safety rules."
    pillars[1]['badge'] = "Strictly Quality Checked"
    pillars[2]['description'] = "AIRO Essentials works only with trusted organic farmers. Every fruit, vegetable, and juice is strictly tested to make sure it is free from harmful chemicals and pesticides."
    pillars[3]['description'] = "Your health reports, contact details, and medical files are highly secured and encrypted. We will never share or sell your personal data to anyone."

    # Health Chair (if present)
    if 'health-chair' in data['pages']:
        data['pages']['health-chair']['hero']['title'] = "AIRO Smart Health Chair"
        data['pages']['health-chair']['hero']['description'] = "A 5-minute full body health check to help you live a longer, healthier life."

    with open('src/data/cms.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == '__main__':
    simplify_copy()
