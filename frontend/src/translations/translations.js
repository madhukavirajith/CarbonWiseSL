// frontend/src/translations/translations.js

export const translations = {
    en: {
        // Navbar
        nav: {
            calculate: "Calculate",
            solar: "Solar ROI",
            history: "History",
            signIn: "Sign In",
            getStarted: "Get Started",
            logout: "Logout",
            langName: "English",
        },

        // Hero Section
        hero: {
            badge: "Sri Lanka's 1st AI Household Carbon Platform",
            titlePrefix: "Know Your",
            titleHighlight1: "Carbon Footprint",
            titleMiddle: ". Cut Your",
            titleHighlight2: "CEB Bill.",
            subtitle: "Sri Lanka's first AI-powered electricity carbon tracker. Enter your appliances, get your exact CO₂ footprint, see which appliances cause it, and simulate how much you can save in rupees and kilograms.",
            ctaCalculate: "Calculate My Footprint",
            ctaSolar: "Solar ROI Calculator",
            imgAlt: "CarbonWiseSL Dashboard Preview",
        },

        // Stats
        stats: {
            stat1Value: "0.52",
            stat1Label: "kg CO₂ per kWh (SLSEA 2024)",
            stat2Value: "38%",
            stat2Label: "of SL electricity is residential",
            stat3Value: "Multi-Tier",
            stat3Label: "CEB tariff modelled accurately",
            stat4Value: "Free",
            stat4Label: "No registration required",
        },

        // Features Section
        features: {
            badge: "What CarbonWiseSL Does",
            title: "Not Just a Calculator. An AI-Powered Advisor.",
            subtitle: "Three AI models working together to predict, explain, and help you reduce your household electricity carbon footprint - calibrated specifically for Sri Lanka.",
            items: [
                {
                    title: "AI Carbon Prediction",
                    desc: "Track your daily and monthly carbon footprint instantly. Built specifically for Sri Lankan homes, our smart tool looks at your electricity usage to predict your exact impact and matches it with current CEB electricity bills so you know exactly where you stand.",
                },
                {
                    title: "Appliance Breakdown",
                    desc: "Ever wonder which appliance is harming the environment (and your wallet) the most? We pinpoint exactly how much your AC, refrigerator, or heater contributes to your footprint, giving you a clear list of your home's biggest energy guzzlers.",
                },
                {
                    title: "Personalised Profiles",
                    desc: "Every home is different. Our system automatically figures out your household type-whether you are a Heavy AC User, an Energy-Efficient home, or a High Occupancy family-and gives you custom, realistic tips tailored to your specific lifestyle.",
                },
                {
                    title: "What-If Simulator",
                    desc: "Test out habits before you change them. See exactly how much money and CO₂ you'll save in real-time by making simple tweaks, like setting your AC to 26°C, switching to LEDs, or reducing your weekly washing machine loads.",
                },
                {
                    title: "Solar ROI Calculator",
                    desc: "Thinking about going solar? Just enter your roof area and city to see how much your CEB bill will drop, how much clean energy you will generate, and exactly how many years it will take for the solar panels to pay for themselves.",
                },
                {
                    title: "Emission History Tracker",
                    desc: "Watch your green journey unfold. By saving your history, you can look back at monthly trends to see how your small daily changes add up to massive, real-world reductions over time.",
                },
            ],
        },

        // How It Works
        howItWorks: {
            badge: "How It Works",
            title: "From Your CEB Bill to Actionable Insights in 60 Seconds",
            steps: [
                {
                    n: "1",
                    title: "Enter Your Appliances",
                    desc: "Tell us what you own - AC, fridge, fans, TV, washing machine, bulbs. Takes about 3 minutes for the first time.",
                },
                {
                    n: "2",
                    title: "AI Predicts Your CO₂",
                    desc: "Our system instantly calculates your daily and monthly carbon footprint based on your specific CEB electricity tariff, giving you an accurate picture of your impact.",
                },
                {
                    n: "3",
                    title: "See Your Biggest Energy Guzzlers",
                    desc: "No vague totals here. We break down the data to show you exactly how much carbon each individual appliance is responsible for, exposing the hidden culprits.",
                },
                {
                    n: "4",
                    title: "Act on Personalised Recommendations",
                    desc: "Get recommendations matched to your household profile, simulate scenarios, and track your reduction progress week by week.",
                },
            ],
        },

        // Testimonials
        testimonials: {
            title: "What Urban Households Say",
            subtitle: "Feedback from our User Acceptance Testing across Colombo, Kandy, and Galle",
            items: [
                {
                    quote: "I had no idea my AC was responsible for 60% of my electricity bill AND my carbon footprint. The SHAP chart made it immediately obvious. I shifted the temperature to 26°C and saved LKR 1,800 last month.",
                    name: "Ruwan S.",
                    area: "Colombo 7",
                },
                {
                    quote: "The solar calculator showed me my rooftop would pay back in 6.2 years. I've now applied for a solar loan. No other tool gave me this clearly with Sri Lankan data.",
                    name: "Priya N.",
                    area: "Kandy",
                },
                {
                    quote: "The what-if simulator let us experiment before making any changes. We replaced 4 old bulbs and reduced the washing machine loads - 0.7 kg CO₂ less per day, which we can see in the history chart.",
                    name: "Fernando Family",
                    area: "Galle",
                },
            ],
        },

        // CTA Band
        cta: {
            title: "Ready to Know Your Carbon Footprint?",
            subtitle: "It takes 3 minutes. No registration. Free forever. Built with Sri Lankan data for Sri Lankan households.",
            btnCalculate: "Calculate My Footprint",
            btnSolar: "Solar ROI Calculator",
            dataSource: "Data source: SLSEA Grid Emission Factor 2024 · CEB Domestic Tariff May 2026 · IPCC AR6",
        },
    },

    si: {
        // Navbar
        nav: {
            calculate: "ගණනය කරන්න",
            solar: "සූර්ය ප්‍රතිලාභ",
            history: "ඉතිහාසය",
            signIn: "ඇතුල් වන්න",
            getStarted: "ආරම්භ කරන්න",
            logout: "ඉවත් වන්න",
            langName: "සිංහල",
        },

        // Hero Section
        hero: {
            badge: "ශ්‍රී ලංකාවේ ප්‍රථම AI ගෘහස්ථ කාබන් පියසටහන් වේදිකාව",
            titlePrefix: "ඔබේ",
            titleHighlight1: "කාබන් පියසටහන",
            titleMiddle: "හඳුනාගන්න. ඔබේ",
            titleHighlight2: "විදුලි බිල අඩු කරන්න.",
            subtitle: "ශ්‍රී ලංකාවේ ප්‍රථම AI බලගැන්වූ විදුලි කාබන් පියසටහන් ඇස්තමේන්තුකරු. ඔබගේ ගෘහ විදුලි උපකරණ ඇතුළත් කර, නිවැරදි CO₂ විමෝචනය දැනගන්න. වැඩිපුරම වැයවන උපකරණ හඳුනාගෙන මුදල් සහ කාබන් ඉතිරි කරගන්න.",
            ctaCalculate: "මගේ කාබන් පියසටහන ගණනය කරන්න",
            ctaSolar: "සූර්ය ප්‍රතිලාභ ගණකය",
            imgAlt: "CarbonWiseSL පාලක පුවරුව පෙරදසුන",
        },

        // Stats
        stats: {
            stat1Value: "0.52",
            stat1Label: "කි.ග්‍රෑ. CO₂ / kWh (SLSEA 2024)",
            stat2Value: "38%",
            stat2Label: "ශ්‍රී ලංකා විදුලියෙන් නිවාස සඳහාය",
            stat3Value: "පියවර ක්‍රමය",
            stat3Label: "CEB ගෘහස්ථ ගාස්තු නිවැරදිව ආකෘතිගත කර ඇත",
            stat4Value: "නොමිලේ",
            stat4Label: "ලියාපදිංචිය අවශ්‍ය නොවේ",
        },

        // Features Section
        features: {
            badge: "CarbonWiseSL මඟින් සිදුවන්නේ කුමක්ද",
            title: "හුදු ගණකයක් පමණක් නොවේ. AI බලගැන්වූ උපදේශකයෙකි.",
            subtitle: "ශ්‍රී ලංකාවේ ගෘහස්ථ විදුලි පරිභෝජනයට ගැළපෙන පරිදි සකස් කරන ලද, පුරෝකථනය සහ විශ්ලේෂණය සඳහා සහය වන AI ආකෘති 3ක්.",
            items: [
                {
                    title: "AI කාබන් පුරෝකථනය",
                    desc: "ඔබේ දෛනික සහ මාසික කාබන් පියසටහන ක්ෂණිකව ගණනය කරන්න. ශ්‍රී ලාංකික නිවාස සඳහා විශේෂයෙන් සකස් කර ඇති අතර, CEB විදුලි බිල්පත් ක්‍රමවේදයට අනුකූලව ඔබේ නිවැරදි බලපෑම පෙන්වයි.",
                },
                {
                    title: "උපකරණ අනුව වෙන්කර දැක්වීම",
                    desc: "ඔබේ මුදල් පසුම්බියට සහ පරිසරයට වැඩිම බලපෑමක් කරන්නේ කුමන උපකරණයද? AC, ශීතකරණය හෝ හීටරය නිසා සිදුවන කාබන් විමෝචනය වෙන වෙනම පැහැදිලිව හඳුනාගන්න.",
                },
                {
                    title: "පුද්ගලීකරණය කළ පැතිකඩ",
                    desc: "සෑම නිවසක්ම එකිනෙකට වෙනස්ය. ඔබ අධික AC භාවිතා කරන්නෙක්ද, බලශක්ති කාර්යක්ෂම නිවසක්ද යන්න හඳුනාගෙන, ඔබේ ජීවන රටාවට වඩාත් ප්‍රායෝගික උපදෙස් ලබා දෙයි.",
                },
                {
                    title: "තත්ත්‍ව සමාකරණ යන්ත්‍රය (What-If)",
                    desc: "පුරුදු වෙනස් කිරීමට පෙර ප්‍රතිඵල අත්හදා බලන්න. AC උෂ්ණත්වය 26°C කිරීම, LED බල්බ භාවිතය හෝ රෙදි සෝදන වාර ගණන අඩු කිරීමෙන් ඉතිරිවන මුදල සහ CO₂ ප්‍රමාණය සජීවීව බලන්න.",
                },
                {
                    title: "සූර්ය පැනල ROI ගණකය",
                    desc: "සූර්ය බලශක්තියට මාරුවීමට සිතනවාද? ඔබේ වහලයේ ප්‍රමාණය සහ නගරය ඇතුළත් කර, විදුලි බිල කොපමණ අඩුවේද සහ ආයෝජනය පියවීමට ගතවන කාලය නිවැරදිව ගණනය කරන්න.",
                },
                {
                    title: "විමෝචන ඉතිහාස සටහන",
                    desc: "ඔබේ පරිසර හිතකාමී ප්‍රගතිය නිරීක්ෂණය කරන්න. ඉතිහාසය සුරැකීමෙන්, ඔබ සිදුකළ කුඩා දෛනික වෙනස්කම් කාලයත් සමඟ විශාල ඉතිරියක් ගෙනදුන් ආකාරය සටහන් මඟින් දැකගත හැක.",
                },
            ],
        },

        // How It Works
        howItWorks: {
            badge: "ක්‍රියාකාරීත්වය",
            title: "ඔබේ විදුලි බිල්පතේ සිට තත්පර 60කින් පූර්ණ විශ්ලේෂණයකට",
            steps: [
                {
                    n: "1",
                    title: "උපකරණ විස්තර ඇතුළත් කරන්න",
                    desc: "ඔබ භාවිතා කරන AC, ශීතකරණ, විදුලි පංකා, TV සහ බල්බ පිළිබඳ තොරතුරු ලබා දෙන්න. පළමු වරට ගතවන්නේ මිනිත්තු 3ක් පමණි.",
                },
                {
                    n: "2",
                    title: "AI මඟින් CO₂ පුරෝකථනය",
                    desc: "ඔබේ CEB විදුලි ගාස්තු කාණ්ඩය මත පදනම්ව ඔබේ දෛනික සහ මාසික කාබන් විමෝචනය පද්ධතිය ක්ෂණිකව ගණනය කරයි.",
                },
                {
                    n: "3",
                    title: "වැඩිම විදුලියක් ගන්නා උපකරණ බලන්න",
                    desc: "සාමාන්‍ය එකතුවක් වෙනුවට, එක් එක් උපකරණයෙන් සිදුවන කාබන් හානිය සහ වියදම නිශ්චිතවම හඳුනාගන්න.",
                },
                {
                    n: "4",
                    title: "පුද්ගලීකරණය කළ උපදෙස් ක්‍රියාත්මක කරන්න",
                    desc: "ඔබේ නිවසට ගැළපෙන උපදෙස් ලබාගෙන, විවිධ ක්‍රම අත්හදා බලමින් ඔබේ කාබන් අඩුකිරීමේ ප්‍රගතිය සතිපතා සටහන් කරගන්න.",
                },
            ],
        },

        // Testimonials
        testimonials: {
            title: "නාගරික නිවාස පවසන අදහස්",
            subtitle: "කොළඹ, මහනුවර සහ ගාල්ල ප්‍රදේශවල අපගේ පරිශීලක පරීක්ෂණ (UAT) මඟින් ලැබුණු ප්‍රතිචාර",
            items: [
                {
                    quote: "මගේ විදුලි බිලෙන් සහ කාබන් විමෝචනයෙන් 60% කටම හේතුව AC එක බව මම දැන සිටියේ නැහැ. SHAP ප්‍රස්ථාරය මඟින් එය පැහැදිලි විය. උෂ්ණත්වය 26°C ට වෙනස් කිරීමෙන් පසුගිය මාසයේ රු. 1,800ක් ඉතිරි කරගත්තා.",
                    name: "රුවන් එස්.",
                    area: "කොළඹ 07",
                },
                {
                    quote: "සූර්ය ගණකය මඟින් මගේ වහලයේ ආයෝජනය වසර 6.2 කින් පියවෙන බව පෙන්වා දුන්නා. දැන් මම සූර්ය බලශක්ති ණයක් සඳහා අයදුම් කර තිබෙනවා. ශ්‍රී ලාංකික දත්ත සමඟ මෙතරම් පැහැදිලි තොරතුරු වෙනත් කිසිදු තැනකින් ලැබුණේ නැහැ.",
                    name: "ප්‍රියා එන්.",
                    area: "මහනුවර",
                },
                {
                    quote: "පුරුදු වෙනස් කිරීමට පෙර අත්හදා බැලීමට what-if සිමියුලේටරය අපට බෙහෙවින් උදවු වුණා. පරණ බල්බ 4ක් මාරු කර රෙදි සේදීමේ වාර ගණන අඩු කළා - දිනකට 0.7 kg CO₂ අඩු වූ අතර එය ඉතිහාස සටහනෙන් දැකගත හැකියි.",
                    name: "ප්‍රනාන්දු පවුල",
                    area: "ගාල්ල",
                },
            ],
        },

        // CTA Band
        cta: {
            title: "ඔබේ කාබන් පියසටහන දැන ගැනීමට සූදානම්ද?",
            subtitle: "මිනිත්තු 3ක් පමණයි. ලියාපදිංචි වීමක් නැත. සැමවිටම නොමිලේ. ශ්‍රී ලාංකික නිවාස සඳහාම දේශීය දත්ත ඇසුරින් නිර්මාණය කර ඇත.",
            btnCalculate: "මගේ කාබන් පියසටහන ගණනය කරන්න",
            btnSolar: "සූර්ය ප්‍රතිලාභ ගණකය",
            dataSource: "දත්ත මූලාශ්‍ර: SLSEA විදුලිබල ජාල විමෝචන සාධකය 2024 · CEB ගෘහස්ථ ගාස්තු 2026 මැයි · IPCC AR6",
        },
    },
};
