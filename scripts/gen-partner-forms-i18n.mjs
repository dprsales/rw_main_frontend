import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rows = []
const add = (k, e, t) => rows.push([k, e, t])

add('seo.partner.title', 'Channel Partners, Sell Luxury Inventory | Rajiv Williams', 'ఛానల్ పార్ట్‌నర్లు, లగ్జరీ ఇన్వెంటరీ అమ్మండి | Rajiv Williams')
add('seo.partner.desc', 'Exclusive RW Realty mandates, golden-rate commissions, in-house sales training and warm leads. Apply to become a channel partner with the Rajiv Williams team.', 'ఎక్స్‌క్లూజివ్ RW Realty మాండేట్లు, గోల్డెన్-రేట్ కమీషన్లు, ఇన్-హౌస్ సేల్స్ ట్రైనింగ్, వార్మ్ లీడ్స్. Rajiv Williams టీమ్‌తో ఛానల్ పార్ట్‌నర్ అవ్వడానికి అప్లై చేయండి.')
add('seo.vendor.title', 'Vendor Partner | Share Your Work | Rajiv Williams', 'వెండర్ పార్ట్‌నర్ | మీ పని పంచుకోండి | Rajiv Williams')
add('seo.vendor.desc', 'Vendors share a profile photo, what they offer, and links to their work. Team RW reviews every submission.', 'వెండర్లు ప్రొఫైల్ ఫోటో, ఏమి ఇస్తారు, పని లింకులు పంచుకుంటారు. Team RW ప్రతి సమర్పణను చూస్తుంది.')
add('seo.start.title', 'Find the Right Service | Rajiv Williams', 'సరైన సేవ కనుక్కోండి | Rajiv Williams')
add('seo.start.desc', 'Answer one to three quick questions and we point you to the right Rajiv Williams service, whether coaching, consulting or an RW Realty mandate.', 'ఒకటి నుంచి మూడు త్వరిత ప్రశ్నలు. కోచింగ్, కన్సల్టింగ్, లేదా RW Realty మాండేట్ వైపు చూపిస్తాం.')
add('seo.form.title', 'Pre-Consultation Assessment | Rajiv Williams', 'కన్సల్టేషన్ ముందు అసెస్‌మెంట్ | Rajiv Williams')
add('seo.form.desc', 'A short assessment before we speak about coaching, developer consulting or an RW Realty mandate.', 'కోచింగ్, డెవలపర్ కన్సల్టింగ్, లేదా RW Realty మాండేట్ గురించి మాట్లాడే ముందు చిన్న అసెస్‌మెంట్.')
add('seo.formCoaching.title', 'Coaching Assessment | Rajiv Williams', 'కోచింగ్ అసెస్‌మెంట్ | Rajiv Williams')
add('seo.formCoaching.desc', 'A short pre-consultation assessment for luxury real estate sales coaching in Hyderabad.', 'హైదరాబాద్‌లో లగ్జరీ రియల్ ఎస్టేట్ సేల్స్ కోచింగ్ కోసం చిన్న ప్రీ-కన్సల్టేషన్ అసెస్‌మెంట్.')
add('seo.formConsulting.title', 'Consulting Assessment | Rajiv Williams', 'కన్సల్టింగ్ అసెస్‌మెంట్ | Rajiv Williams')
add('seo.formConsulting.desc', 'A short pre-consultation assessment for developer sales consulting in Hyderabad.', 'హైదరాబాద్‌లో డెవలపర్ సేల్స్ కన్సల్టింగ్ కోసం చిన్న ప్రీ-కన్సల్టేషన్ అసెస్‌మెంట్.')
add('seo.formRealty.title', 'RW Realty Mandate Assessment | Rajiv Williams', 'RW Realty మాండేట్ అసెస్‌మెంట్ | Rajiv Williams')
add('seo.formRealty.desc', 'A short pre-consultation assessment for an exclusive RW Realty sales mandate.', 'ఎక్స్‌క్లూజివ్ RW Realty సేల్స్ మాండేట్ కోసం చిన్న ప్రీ-కన్సల్టేషన్ అసెస్‌మెంట్.')

add('partner.eyebrow', 'RW REALTY · CHANNEL PARTNERS', 'RW REALTY · ఛానల్ పార్ట్‌నర్లు')
add('partner.h1.a', 'Sell luxury inventory ', 'లగ్జరీ ఇన్వెంటరీ అమ్మండి ')
add('partner.h1.b', 'with the people who move it.', 'దాన్ని కదిలించే వారితో.')
add('partner.lede', 'Exclusive mandates, golden-rate commissions, and a team that runs the funnel with you.', 'ఎక్స్‌క్లూజివ్ మాండేట్లు, గోల్డెన్-రేట్ కమీషన్లు, ఫన్నెల్‌ను మీతో కలిసి నడిపే టీమ్.')
add('partner.intro', 'RW Realty carries a small number of projects at a time, on exclusive mandates. Partners inside those mandates get inventory worth carrying, leads we keep warm, and the training to close at the ticket size.', 'RW Realty ఒకేసారి కొద్ది ప్రాజెక్టులు, ఎక్స్‌క్లూజివ్ మాండేట్లపై. ఆ మాండేట్ల లోపల పార్ట్‌నర్లకు మోయదగిన ఇన్వెంటరీ, వార్మ్‌గా ఉంచే లీడ్స్, టికెట్ సైజ్‌కు తగిన క్లోజ్ ట్రైనింగ్.')
add('partner.alt', 'Partnership network: trust, people, communication, handshake, shared aim, care and growth.', 'పార్ట్‌నర్‌షిప్ నెట్‌వర్క్: నమ్మకం, ప్రజలు, కమ్యూనికేషన్, హ్యాండ్‌షేక్, ఉమ్మడి లక్ష్యం, శ్రద్ధ, వృద్ధి.')
add('partner.apply', 'APPLY TO BECOME A CHANNEL PARTNER', 'ఛానల్ పార్ట్‌నర్ అవ్వడానికి అప్లై చేయండి')
add('partner.orCall', 'OR BOOK A CALL FIRST', 'లేదా ముందు కాల్ బుక్ చేయండి')
add('partner.why', 'WHY PARTNER WITH US', 'మాతో ఎందుకు పార్ట్‌నర్ అవ్వాలి')
add('partner.whyTitle', 'A few mandates, run properly.', 'కొద్ది మాండేట్లు, సరిగ్గా నడుస్తాయి.')
add('partner.band.a', 'Transparency at all levels. ', 'అన్ని స్థాయిల్లో పారదర్శకత. ')
add('partner.band.b', 'Excellent customer services.', 'అద్భుతమైన కస్టమర్ సర్వీస్.')
add('partner.band.c', '& Timely Payout support.', 'మరియు సమయానికి పేఅవుట్ సపోర్ట్.')
add('partner.app.eyebrow', 'APPLICATION', 'అప్లికేషన్')
add('partner.app.title', 'Apply to become a channel partner.', 'ఛానల్ పార్ట్‌నర్ అవ్వడానికి అప్లై చేయండి.')
add('partner.app.lede', 'Ten minutes, references over a big deck. Everything you share stays between us.', 'పది నిమిషాలు. పెద్ద డెక్ కంటే రిఫరెన్సులు. మీరు పంచుకున్నది మన మధ్యే ఉంటుంది.')
add('partner.done.title', 'Application received.', 'అప్లికేషన్ అందింది.')
add('partner.done.body', "It's under review. We respond within two hours, usually we reply faster and if you would rather talk first, call or WhatsApp us below.", 'రివ్యూలో ఉంది. రెండు గంటల్లో స్పందిస్తాం, తరచు అంతకంటే త్వరగా. ముందు మాట్లాడాలనుకుంటే కింద కాల్ లేదా WhatsApp చేయండి.')
add('partner.done.wa', 'WHATSAPP THE TEAM', 'టీమ్‌కు WHATSAPP')
add('partner.done.call', 'BOOK A CALL', 'కాల్ బుక్ చేయండి')
add('partner.f.name', 'Full name', 'పూర్తి పేరు')
add('partner.f.name.ph', 'Your name', 'మీ పేరు')
add('partner.f.phone', 'Phone', 'ఫోన్')
add('partner.f.phone.ph', '+91 ·····', '+91 ·····')
add('partner.f.email', 'Email', 'ఈమెయిల్')
add('partner.f.email.ph', 'you@agency.com', 'you@agency.com')
add('partner.f.agencyName', 'Agency / Company Name', 'ఏజెన్సీ / కంపెనీ పేరు')
add('partner.f.agencyName.ph', 'The firm you work under', 'మీరు పని చేసే సంస్థ')
add('partner.f.city', 'Base city', 'బేస్ సిటీ')
add('partner.f.city.ph', 'Hyderabad', 'Hyderabad')
add('partner.years', 'Years in real estate', 'రియల్ ఎస్టేట్‌లో సంవత్సరాలు')
add('partner.rera', 'Are you RERA registered?', 'మీరు RERA రిజిస్టర్డ్‌నా?')
add('partner.yes', 'Yes', 'అవును')
add('partner.no', 'No', 'కాదు')
add('partner.reraPh', 'Your RERA registration number', 'మీ RERA రిజిస్ట్రేషన్ నంబర్')
add('partner.reraNo', 'As per TG RERA, it is mandatory for every agent, channel partner, broker to have a RERA number, we recommend you encourage you to file for a RERA number ASAP to avoid future inconvenience.', 'TG RERA ప్రకారం ప్రతి ఏజెంట్, ఛానల్ పార్ట్‌నర్, బ్రోకర్‌కు RERA నంబర్ తప్పనిసరి. భవిష్యత్తు ఇబ్బంది రాకుండా వీలైనంత త్వరగా RERA నంబర్ కోసం దరఖాస్తు చేయమని సిఫార్సు చేస్తున్నాం.')
add('partner.cats', 'Which categories do you sell?', 'మీరు ఏ కేటగిరీలు అమ్ముతారు?')
add('partner.cat.0', 'Luxury apartments', 'లగ్జరీ అపార్ట్‌మెంట్లు')
add('partner.cat.1', 'Villas', 'విల్లాలు')
add('partner.cat.2', 'Plots and lands', 'ప్లాట్లు, భూములు')
add('partner.cat.3', 'Mixed use', 'మిక్స్‌డ్ యూస్')
add('partner.file.pan', 'Upload your PAN card', 'PAN కార్డ్ అప్‌లోడ్ చేయండి')
add('partner.file.panHint', 'Drag and drop your PAN card here', 'PAN కార్డ్‌ను ఇక్కడ డ్రాగ్ అండ్ డ్రాప్ చేయండి')
add('partner.file.cheque', 'Upload cancelled cheque', 'క్యాన్సిల్డ్ చెక్ అప్‌లోడ్ చేయండి')
add('partner.file.chequeHint', 'Drag and drop your cancelled cheque here', 'క్యాన్సిల్డ్ చెక్‌ను ఇక్కడ డ్రాగ్ అండ్ డ్రాప్ చేయండి')
add('partner.file.browse', 'or click to browse · PDF, JPG or PNG (Max 5MB)', 'లేదా క్లిక్ చేసి ఎంచుకోండి · PDF, JPG లేదా PNG (గరిష్టం 5MB)')
add('partner.file.doc', 'Document', 'డాక్యుమెంట్')
add('partner.file.remove', 'Remove {name}', '{name} తీసేయండి')
add('partner.file.tooBig', 'That file is over 5MB. Please attach a smaller one.', 'ఫైల్ 5MB దాటింది. చిన్నది జత చేయండి.')
add('partner.terms.title', 'Terms & conditions', 'నిబంధనలు')
add('partner.terms.before', 'I have read the', 'నేను')
add('partner.terms.link', 'Channel Partner Terms', 'ఛానల్ పార్ట్‌నర్ నిబంధనలు')
add('partner.terms.mid', 'and the', 'మరియు')
add('partner.terms.privacy', 'Privacy Policy', 'ప్రైవసీ పాలసీ')
add('partner.terms.after', '. I confirm the details and documents in this application are accurate, and I agree Team RW may contact me about this application.', ' చదివాను. ఈ అప్లికేషన్‌లోని వివరాలు, డాక్యుమెంట్లు ఖచ్చితమని నిర్ధారిస్తున్నాను. ఈ అప్లికేషన్ గురించి Team RW నన్ను సంప్రదించవచ్చు.')
add('partner.note', 'One application, no obligation to proceed.', 'ఒక అప్లికేషన్. ముందుకు వెళ్లాల్సిన బాధ్యత లేదు.')
add('partner.close', 'Put your buyer network in front of Hyderabad’s premium inventory.', 'మీ బయ్యర్ నెట్‌వర్క్‌ను హైదరాబాద్ ప్రీమియం ఇన్వెంటరీ ముందు పెట్టండి.')
add('partner.err.years', 'Please choose your years of experience.', 'మీ అనుభవ సంవత్సరాలు ఎంచుకోండి.')
add('partner.err.rera', 'Please tell us whether you are RERA registered.', 'మీరు RERA రిజిస్టర్డ్‌నా కాదా చెప్పండి.')
add('partner.err.reraNo', 'Please enter your RERA registration number.', 'మీ RERA రిజిస్ట్రేషన్ నంబర్ ఇవ్వండి.')
add('partner.err.pan', 'Please upload your PAN card.', 'PAN కార్డ్ అప్‌లోడ్ చేయండి.')
add('partner.err.cheque', 'Please upload a cancelled cheque.', 'క్యాన్సిల్డ్ చెక్ అప్‌లోడ్ చేయండి.')
add('partner.err.terms', 'Please read and accept the Channel Partner Terms to submit.', 'సమర్పించే ముందు ఛానల్ పార్ట్‌నర్ నిబంధనలు చదివి అంగీకరించండి.')
add('partner.v.0.tag', 'ACCESS', 'యాక్సెస్')
add('partner.v.0.title', 'Transparency at all levels, not open-market.', 'అన్ని స్థాయిల్లో పారదర్శకత, ఓపెన్-మార్కెట్ కాదు.')
add('partner.v.0.body', 'A small roster of projects owned end to end. Transparency at all levels, not open-market. Your buyers are chasing a property only you can sell.', 'మొదటి నుంచి చివరి వరకు మా యాజమాన్యంలో ఉండే చిన్న ప్రాజెక్ట్ జాబితా. అన్ని స్థాయిల్లో పారదర్శకత, ఓపెన్-మార్కెట్ కాదు. మీ కొనుగోలుదారులు మీరే అమ్మగల ప్రాపర్టీ కోసం వస్తారు.')
add('partner.v.1.tag', 'TRUST', 'నమ్మకం')
add('partner.v.1.title', 'Golden-rate commissions, published before you sign.', 'గోల్డెన్-రేట్ కమీషన్లు, సంతకం ముందే ప్రచురిస్తాం.')
add('partner.v.1.body', 'The structure is on the table from day one, the deal log is shared every month, and payments clear on schedule. No surprises at settlement.', 'నిర్మాణం మొదటి రోజు నుంచే బయట. డీల్ లాగ్ ప్రతి నెల పంచుకుంటాం. చెల్లింపులు షెడ్యూల్‌పై. సెటిల్‌మెంట్‌లో ఆశ్చర్యాలు లేవు.')
add('partner.v.2.tag', 'GROWTH', 'వృద్ధి')
add('partner.v.2.title', 'Training, warm leads and Volume.', 'ట్రైనింగ్, వార్మ్ లీడ్స్, వాల్యూమ్.')
add('partner.v.2.body', 'In-house sales training before the first site visit, leads kept warm by our funnel, and more inventory offered as your numbers come in.', 'మొదటి సైట్ విజిట్ ముందు ఇన్-హౌస్ సేల్స్ ట్రైనింగ్. ఫన్నెల్ లీడ్స్‌ను వార్మ్‌గా ఉంచుతుంది. సంఖ్యలు వచ్చేకొద్దీ మరింత ఇన్వెంటరీ.')
add('partner.v.3.tag', 'SUPPORT', 'సపోర్ట్')
add('partner.v.3.title', 'The funnel runs with you, not past you.', 'ఫన్నెల్ మీతో నడుస్తుంది, మిమ్మల్ని దాటి కాదు.')
add('partner.v.3.body', 'Site visits, buyer handling, and payout support sit with the same team. Excellent customer service is the standard, not an extra.', 'సైట్ విజిట్లు, బయ్యర్ హ్యాండ్లింగ్, పేఅవుట్ సపోర్ట్ ఒకే టీమ్. అద్భుతమైన కస్టమర్ సర్వీస్ స్టాండర్డ్, అదనం కాదు.')

add('vendor.eyebrow', 'VENDOR PARTNER', 'వెండర్ పార్ట్‌నర్')
add('vendor.h1.a', 'Tell us about ', 'మీ గురించి చెప్పండి ')
add('vendor.h1.b', 'your business.', 'మీ వ్యాపారం.')
add('vendor.lede', 'Share a profile photo, what you offer, and a link to the work. The team reviews every submission from this page.', 'ప్రొఫైల్ ఫోటో, మీరు ఏమి ఇస్తారు, పని లింక్ పంచుకోండి. ఈ పేజీ నుంచి వచ్చిన ప్రతి సమర్పణను టీమ్ చూస్తుంది.')
add('vendor.section', 'YOUR BUSINESS', 'మీ వ్యాపారం')
add('vendor.title', 'The details we keep on file.', 'ఫైల్‌లో ఉంచే వివరాలు.')
add('vendor.done.title', 'Received.', 'అందింది.')
add('vendor.done.body', 'The team will look through what you sent. If there is a fit, someone will be in touch.', 'మీరు పంపినది టీమ్ చూస్తుంది. సరిపోతే ఎవరైనా సంప్రదిస్తారు.')
add('vendor.done.wa', 'WHATSAPP THE TEAM', 'టీమ్‌కు WHATSAPP')
add('vendor.f.companyName', 'Company', 'కంపెనీ')
add('vendor.f.companyName.ph', 'The business name', 'వ్యాపారం పేరు')
add('vendor.f.contactName', 'Your name', 'మీ పేరు')
add('vendor.f.contactName.ph', 'Who we should speak to', 'మేము ఎవరితో మాట్లాడాలి')
add('vendor.f.phone', 'Phone', 'ఫోన్')
add('vendor.f.phone.ph', '+91 ·····', '+91 ·····')
add('vendor.f.email', 'Email', 'ఈమెయిల్')
add('vendor.f.email.ph', 'you@company.com', 'you@company.com')
add('vendor.f.city', 'City', 'నగరం')
add('vendor.f.city.ph', 'Hyderabad', 'Hyderabad')
add('vendor.f.gstNumber', 'GST number', 'GST నంబర్')
add('vendor.f.gstNumber.ph', '15-character GSTIN', '15 అక్షరాల GSTIN')
add('vendor.f.yearOfIncorporation', 'Year of incorporation', 'స్థాపన సంవత్సరం')
add('vendor.f.yearOfIncorporation.ph', 'e.g. 2014', 'ఉదా. 2014')
add('vendor.f.websiteUrl', 'Website or portfolio', 'వెబ్‌సైట్ లేదా పోర్ట్‌ఫోలియో')
add('vendor.f.websiteUrl.ph', 'https://', 'https://')
add('vendor.f.videoUrl', 'Video link', 'వీడియో లింక్')
add('vendor.f.videoUrl.ph', 'A demo, reel, or walkthrough', 'డెమో, రీల్, లేదా వాక్‌త్రూ')
add('vendor.f.officeLocation', 'Your office location', 'మీ ఆఫీస్ లొకేషన్')
add('vendor.f.officeLocation.ph', 'Street, area, and city of your office', 'వీధి, ప్రాంతం, నగరం')
add('vendor.photo', 'Profile image', 'ప్రొఫైల్ చిత్రం')
add('vendor.photoHint', 'Drop a photo of you or the business', 'మీ లేదా వ్యాపారం ఫోటో వేయండి')
add('vendor.supply', 'What you supply', 'మీరు ఏమి సరఫరా చేస్తారు')
add('vendor.supplyPh', 'Interior, printing, catering…', 'ఇంటీరియర్, ప్రింటింగ్, కేటరింగ్…')
add('vendor.about', 'About the business', 'వ్యాపారం గురించి')
add('vendor.aboutPh', 'What you make or offer, and who it is for.', 'మీరు ఏమి చేస్తారు లేదా ఇస్తారు, ఎవరి కోసం.')
add('vendor.brochure', 'Brochure', 'బ్రోషర్')
add('vendor.brochureHint', 'Drop a PDF or image', 'PDF లేదా ఇమేజ్ వేయండి')
add('vendor.file.browse', 'or click to browse · max 8MB', 'లేదా క్లిక్ చేసి ఎంచుకోండి · గరిష్టం 8MB')
add('vendor.file.remove', 'Remove {name}', '{name} తీసేయండి')
add('vendor.file.tooBig', 'That file is over 8MB. Please attach a smaller one.', 'ఫైల్ 8MB దాటింది. చిన్నది జత చేయండి.')
add('vendor.file.image', 'Use a JPG, PNG, or WEBP image.', 'JPG, PNG, లేదా WEBP ఇమేజ్ వాడండి.')
add('vendor.send', 'SEND DETAILS', 'వివరాలు పంపండి')
add('vendor.err.photo', 'Add a profile image of you or the business.', 'మీ లేదా వ్యాపారం ప్రొఫైల్ చిత్రం జత చేయండి.')
add('vendor.err.supply', 'Tell us what the business supplies.', 'వ్యాపారం ఏమి సరఫరా చేస్తుందో చెప్పండి.')
add('vendor.err.about', 'Write a short note about the business.', 'వ్యాపారం గురించి చిన్న నోట్ రాయండి.')
add('vendor.err.gst', 'Enter a valid 15-character GST number.', 'చెల్లుబాటు అయ్యే 15 అక్షరాల GST నంబర్ ఇవ్వండి.')
add('vendor.err.year', 'Enter a 4-digit year of incorporation.', '4 అంకెల స్థాపన సంవత్సరం ఇవ్వండి.')

add('sale.eyebrow', 'PRE-CONSULTATION ASSESSMENT', 'కన్సల్టేషన్ ముందు అసెస్‌మెంట్')
add('sale.h1.a', 'Coaching your team, consulting on your process, ', 'మీ టీమ్‌కు కోచింగ్, మీ ప్రాసెస్‌పై కన్సల్టింగ్, ')
add('sale.h1.b', 'or owning the sale outright.', 'లేదా అమ్మకాన్ని పూర్తిగా మేము నడపడం.')
add('sale.lede', 'Where do you need us?', 'మీకు మేము ఎక్కడ కావాలి?')
add('sale.intro', 'Pick a track below. A short set of questions is what lets us walk into the consultation already knowing your project, so the hour is spent on answers, not introductions.', 'కింద ఒక ట్రాక్ ఎంచుకోండి. చిన్న ప్రశ్నల వల్ల కన్సల్టేషన్‌కు మీ ప్రాజెక్ట్ తెలిసి వస్తాం. గంట పరిచయాలకు కాదు, సమాధానాలకు.')
add('sale.thanks', 'Thank you.', 'ధన్యవాదాలు.')
add('sale.all', '← All tracks', '← అన్ని ట్రాక్స్')
add('sale.rail', '{label} form · {done} of {total}', '{label} ఫారం · {done} / {total}')
add('sale.left', '{n} required questions left', 'ఇంకా {n} తప్పనిసరి ప్రశ్నలు')
add('sale.leftOne', '{n} required question left', 'ఇంకా {n} తప్పనిసరి ప్రశ్న')
add('sale.ready', 'Ready to submit', 'సమర్పించడానికి సిద్ధం')
add('sale.working', 'Submitting your details…', 'మీ వివరాలు పంపుతున్నాం…')
add('sale.submit', 'SUBMIT & SCHEDULE CONSULTATION', 'సమర్పించి కన్సల్టేషన్ షెడ్యూల్ చేయండి')
add('sale.submitting', 'SUBMITTING…', 'పంపుతున్నాం…')
add('sale.err', 'Unable to submit your enquiry.', 'మీ విచారణ పంపలేకపోయాం.')
add('sale.errKeep', 'Your answers are still here. Please try again.', 'మీ సమాధానాలు ఇక్కడే ఉన్నాయి. మళ్లీ ప్రయత్నించండి.')
add('sale.select', 'Select one…', 'ఒకటి ఎంచుకోండి…')
add('sale.optional', '(optional)', '(ఐచ్ఛికం)')

add('sale.q.contact.name.title', 'Your full name', 'మీ పూర్తి పేరు')
add('sale.q.contact.name.ph', 'Full name', 'పూర్తి పేరు')
add('sale.q.contact.phone.title', 'Phone number', 'ఫోన్ నంబర్')
add('sale.q.contact.phone.ph', '+91 98765 43210', '+91 98765 43210')
add('sale.q.contact.email.title', 'Email address', 'ఈమెయిల్ అడ్రస్')
add('sale.q.contact.email.ph', 'you@company.com', 'you@company.com')

const tracks = {
  coaching: {
    label: ['Coaching', 'కోచింగ్'],
    cardTitle: ['Sales Mastery Coaching', 'సేల్స్ మాస్టరీ కోచింగ్'],
    cardBody: ['Personalised coaching to sharpen closing skills, build a high-performing team, and grow into luxury real estate sales.', 'క్లోజింగ్ నైపుణ్యాలు పదును, బలమైన టీమ్, లగ్జరీ రియల్ ఎస్టేట్ సేల్స్‌లోకి ఎదగడం. వ్యక్తిగత కోచింగ్.'],
    cardCta: ['Share your coaching details', 'మీ కోచింగ్ వివరాలు పంచుకోండి'],
    eyebrow: ['RAJIV WILLIAMS COACHING', 'RAJIV WILLIAMS కోచింగ్'],
    title: ['Let’s Understand Where You Are Today', 'ఈరోజు మీరు ఎక్కడ ఉన్నారో అర్థం చేసుకుందాం'],
    line: ['A few thoughtful questions about your business, challenges, and where you want to go.', 'మీ వ్యాపారం, సవాళ్లు, మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారో కొన్ని ప్రశ్నలు.'],
    time: ['About 2 minutes', 'సుమారు 2 నిమిషాలు'],
    confirm: ['We will prepare a personalised coaching recommendation from your responses and be in touch shortly.', 'మీ సమాధానాల నుంచి వ్యక్తిగత కోచింగ్ సిఫార్సు సిద్ధం చేసి త్వరలో సంప్రదిస్తాం.'],
  },
  consulting: {
    label: ['Consulting', 'కన్సల్టింగ్'],
    cardTitle: ['Business & Sales Consulting', 'బిజినెస్ & సేల్స్ కన్సల్టింగ్'],
    cardBody: ['Expert guidance on sales setup, branding, hiring and process, tailored to where your business stands today.', 'సేల్స్ సెటప్, బ్రాండింగ్, హైరింగ్, ప్రాసెస్. మీ వ్యాపారం ఈరోజు ఎక్కడ ఉందో దానికి తగిన మార్గదర్శకత్వం.'],
    cardCta: ['Share your business details', 'మీ వ్యాపార వివరాలు పంచుకోండి'],
    eyebrow: ['RAJIV WILLIAMS CONSULTING', 'RAJIV WILLIAMS కన్సల్టింగ్'],
    title: ['Welcome to Rajiv Williams Consulting', 'Rajiv Williams కన్సల్టింగ్‌కు స్వాగతం'],
    thanks: ['Thank you for choosing Rajiv Williams Consulting.', 'Rajiv Williams కన్సల్టింగ్ ఎంచుకున్నందుకు ధన్యవాదాలు.'],
    line: ['We would like to understand your business, your current challenges, and the areas where you are seeking expert guidance.', 'మీ వ్యాపారం, ప్రస్తుత సవాళ్లు, మీరు మార్గదర్శకత్వం కోరే చోట్లు అర్థం చేసుకోవాలనుకుంటున్నాం.'],
    time: ['About 2 minutes', 'సుమారు 2 నిమిషాలు'],
    confirm: ['We will review your business context and follow up to schedule your consulting session.', 'మీ వ్యాపార సందర్భం చూసి, కన్సల్టింగ్ సెషన్ షెడ్యూల్ చేయడానికి ఫాలో అప్ చేస్తాం.'],
  },
  realty: {
    label: ['Realty', 'రియల్టీ'],
    cardTitle: ['Realty Services', 'రియల్టీ సేవలు'],
    cardBody: ['Hand us your project. We recommend and execute the right sales and marketing strategy to move your inventory.', 'మీ ప్రాజెక్ట్ మాకు ఇవ్వండి. ఇన్వెంటరీ కదిలించే సేల్స్, మార్కెటింగ్ వ్యూహం సిఫార్సు చేసి అమలు చేస్తాం.'],
    cardCta: ['Share your project details', 'మీ ప్రాజెక్ట్ వివరాలు పంచుకోండి'],
    eyebrow: ['RAJIV WILLIAMS REALTY SERVICES', 'RAJIV WILLIAMS రియల్టీ సేవలు'],
    title: ['Welcome to Rajiv Williams Realty Services', 'Rajiv Williams రియల్టీ సేవలకు స్వాగతం'],
    thanks: ['Thank you for reaching out to Rajiv Williams Realty Services.', 'Rajiv Williams రియల్టీ సేవలను సంప్రదించినందుకు ధన్యవాదాలు.'],
    line: ['To help us understand your project and recommend the right sales and marketing strategy, please answer a few quick questions.', 'మీ ప్రాజెక్ట్ అర్థమై, సరైన సేల్స్, మార్కెటింగ్ వ్యూహం చెప్పడానికి కొన్ని త్వరిత ప్రశ్నలు.'],
    time: ['Under 2 minutes', '2 నిమిషాల లోపు'],
    confirm: ['We will review your project details and follow up to schedule a consultation.', 'మీ ప్రాజెక్ట్ వివరాలు చూసి, కన్సల్టేషన్ షెడ్యూల్ చేయడానికి ఫాలో అప్ చేస్తాం.'],
  },
}

for (const [key, t] of Object.entries(tracks)) {
  for (const field of ['label', 'cardTitle', 'cardBody', 'cardCta', 'eyebrow', 'title', 'line', 'time', 'confirm']) {
    add(`sale.track.${key}.${field}`, t[field][0], t[field][1])
  }
  if (t.thanks) add(`sale.track.${key}.thanks`, t.thanks[0], t.thanks[1])
}

function q(track, id, en, te, options, extra = {}) {
  add(`sale.q.${track}.${id}.title`, en, te)
  if (extra.help) add(`sale.q.${track}.${id}.help`, extra.help[0], extra.help[1])
  if (extra.ph) add(`sale.q.${track}.${id}.ph`, extra.ph[0], extra.ph[1])
  ;(options || []).forEach((pair, i) => add(`sale.opt.${track}.${id}.${i}`, pair[0], pair[1]))
}

q('coaching', 'role', 'Which of the below best describes your role?', 'కిందివాటిలో మీ రోల్‌కు ఏది దగ్గర?', [
  ['Builder / Developer', 'బిల్డర్ / డెవలపర్'],
  ['Sales Head', 'సేల్స్ హెడ్'],
  ['Sales Manager', 'సేల్స్ మేనేజర్'],
  ['Sales Executive', 'సేల్స్ ఎగ్జిక్యూటివ్'],
  ['Channel Partner', 'ఛానల్ పార్ట్‌నర్'],
  ['Entrepreneur', 'ఎంట్రప్రెన్యూర్'],
  ['Other', 'ఇతర'],
])
q('coaching', 'experience', 'How long have you been in the real estate industry?', 'రియల్ ఎస్టేట్ ఇండస్ట్రీలో మీరు ఎంతకాలం ఉన్నారు?', [
  ['> 1 year', '1 సంవత్సరం కంటే ఎక్కువ'],
  ['1–3 yrs', '1–3 సంవత్సరాలు'],
  ['3–5 yrs', '3–5 సంవత్సరాలు'],
  ['< 5 yrs', '5 సంవత్సరాల కంటే తక్కువ'],
])
q('coaching', 'projectType', 'What type of projects do you sell most often?', 'మీరు ఎక్కువగా ఏ రకం ప్రాజెక్టులు అమ్ముతారు?', [
  ['Apartments', 'అపార్ట్‌మెంట్లు'],
  ['Villas', 'విల్లాలు'],
  ['Plots', 'ప్లాట్లు'],
  ['Commercial', 'కమర్షియల్'],
  ['Mixed projects', 'మిక్స్‌డ్ ప్రాజెక్టులు'],
])
q('coaching', 'challenges', 'What is the biggest challenge you are facing in your business?', 'మీ వ్యాపారంలో ఇప్పుడు అతి పెద్ద సవాలు ఏమిటి?', [
  ['Generating quality leads', 'నాణ్యమైన లీడ్స్'],
  ['Increasing site visits', 'సైట్ విజిట్లు పెంచడం'],
  ['Improving sales closures', 'సేల్స్ క్లోజర్లు మెరుగుపరచడం'],
  ['Building a strong sales team', 'బలమైన సేల్స్ టీమ్'],
  ['Handling customer objections', 'కస్టమర్ అభ్యంతరాలు'],
  ['Negotiation', 'నెగోషియేషన్'],
  ['Follow-up process', 'ఫాలో-అప్ ప్రాసెస్'],
  ['CRM & automation', 'CRM & ఆటోమేషన్'],
  ['Other', 'ఇతర'],
], { help: ['Choose as many as apply.', 'వర్తించేవన్నీ ఎంచుకోండి.'] })
q('coaching', 'goal', 'What would you like to achieve through Rajiv Williams Coaching?', 'Rajiv Williams కోచింగ్ ద్వారా మీరు ఏమి సాధించాలనుకుంటున్నారు?', [
  ['Increase sales', 'సేల్స్ పెంచడం'],
  ['Improve closing skills', 'క్లోజింగ్ నైపుణ్యాలు'],
  ['Train my sales team', 'నా సేల్స్ టీమ్‌కు ట్రైనింగ్'],
  ['Grow my business', 'నా వ్యాపారం పెంచడం'],
  ['Become a better leader', 'మెరుగైన లీడర్ కావడం'],
  ['Learn luxury real estate sales', 'లగ్జరీ రియల్ ఎస్టేట్ సేల్స్ నేర్చుకోవడం'],
])
q('coaching', 'timeline', 'How soon do you wish to get started?', 'ఎంత త్వరగా మొదలుపెట్టాలనుకుంటున్నారు?', [
  ['Immediately', 'వెంటనే'],
  ['Within 7 days', '7 రోజుల్లో'],
  ['This month', 'ఈ నెల'],
  ['Just exploring', 'ఇప్పుడు చూస్తున్నాను'],
])
q('coaching', 'notes', 'Anything specific you would like us to discuss in your coaching session?', 'కోచింగ్ సెషన్‌లో మేము ప్రత్యేకంగా చర్చించాలనుకునేది ఏమైనా ఉందా?')

q('consulting', 'orgName', 'Please state the name of your organisation', 'మీ సంస్థ పేరు చెప్పండి')
q('consulting', 'role', 'What best describes your role?', 'మీ రోల్‌కు ఏది దగ్గర?', [
  ['Builder / Developer', 'బిల్డర్ / డెవలపర్'],
  ['Founder / Director', 'ఫౌండర్ / డైరెక్టర్'],
  ['Entrepreneur / Owner', 'ఎంట్రప్రెన్యూర్ / యజమాని'],
])
q('consulting', 'businessStage', 'Which stage is your business currently in?', 'మీ వ్యాపారం ఇప్పుడు ఏ దశలో ఉంది?', [
  ['Planning stage (RERA not received)', 'ప్లానింగ్ దశ (RERA రాలేదు)'],
  ['Project launch (RERA received)', 'ప్రాజెక్ట్ లాంచ్ (RERA వచ్చింది)'],
  ['Actively selling', 'చురుకుగా అమ్ముతున్నాం'],
  ['Ready-to-move project', 'రెడీ-టు-మూవ్ ప్రాజెక్ట్'],
  ['Business expansion', 'వ్యాపార విస్తరణ'],
])
q('consulting', 'servicesNeeded', 'Which consulting service are you looking for?', 'మీకు ఏ కన్సల్టింగ్ సేవ కావాలి?', [
  ['End-to-end sales setup', 'ఎండ్-టు-ఎండ్ సేల్స్ సెటప్'],
  ['Branding & visibility', 'బ్రాండింగ్ & విజిబిలిటీ'],
  ['Sales team hiring', 'సేల్స్ టీమ్ హైరింగ్'],
  ['Sales process consulting', 'సేల్స్ ప్రాసెస్ కన్సల్టింగ్'],
  ['Business growth strategy', 'వ్యాపార వృద్ధి వ్యూహం'],
  ['Not sure (need guidance)', 'ఖచ్చితంగా తెలియదు (మార్గదర్శకత్వం కావాలి)'],
], { help: ['Choose as many as apply.', 'వర్తించేవన్నీ ఎంచుకోండి.'] })
q('consulting', 'biggestChallenge', 'What is your biggest challenge right now?', 'ఇప్పుడు మీ అతి పెద్ద సవాలు ఏమిటి?', [
  ['Setting up a sales team', 'సేల్స్ టీమ్ సెటప్'],
  ['Generating quality leads', 'నాణ్యమైన లీడ్స్'],
  ['Low sales conversion', 'తక్కువ సేల్స్ కన్వర్షన్'],
  ['Brand awareness', 'బ్రాండ్ అవేర్‌నెస్'],
  ['Hiring the right talent', 'సరైన టాలెంట్ హైర్ చేయడం'],
  ['Sales process & CRM', 'సేల్స్ ప్రాసెస్ & CRM'],
  ['Scaling the business', 'వ్యాపారం స్కేల్ చేయడం'],
  ['Other', 'ఇతర'],
])
q('consulting', 'challengeSeverity', 'How severely is this challenge affecting your business?', 'ఈ సవాలు మీ వ్యాపారాన్ని ఎంత తీవ్రంగా ప్రభావితం చేస్తోంది?', [
  ['Slightly', 'కొద్దిగా'],
  ['Moderately', 'మధ్యస్థంగా'],
  ['Significantly', 'గణనీయంగా'],
  ['Critically', 'కీలకంగా'],
])
q('consulting', 'primaryGoal', 'What is your primary goal over the next 6–12 months?', 'వచ్చే 6–12 నెలల్లో మీ ప్రధాన లక్ష్యం ఏమిటి?', [
  ['Launch a new project', 'కొత్త ప్రాజెక్ట్ లాంచ్'],
  ['Increase sales', 'సేల్స్ పెంచడం'],
  ['Build a high-performing sales team', 'బలమైన సేల్స్ టీమ్'],
  ['Strengthen brand presence', 'బ్రాండ్ ఉనికి బలపరచడం'],
  ['Expand my business', 'వ్యాపారం విస్తరించడం'],
  ['Improve overall operations', 'మొత్తం ఆపరేషన్లు మెరుగుపరచడం'],
])
q('consulting', 'hasSalesTeam', 'Do you currently have an in-house sales team?', 'ఇప్పుడు ఇన్-హౌస్ సేల్స్ టీమ్ ఉందా?', [
  ['Yes', 'అవును'],
  ['No', 'లేదు'],
  ['In the process of hiring', 'హైరింగ్ జరుగుతోంది'],
])
q('consulting', 'triedSolutions', 'What have you already tried to overcome this challenge?', 'ఈ సవాలు దాటడానికి ఇప్పటికే ఏమి ప్రయత్నించారు?', [
  ['Internal training', 'ఇంటర్నల్ ట్రైనింగ్'],
  ['External coach / consultant', 'బయటి కోచ్ / కన్సల్టెంట్'],
  ['Sales hiring', 'సేల్స్ హైరింగ్'],
  ['CRM / automation', 'CRM / ఆటోమేషన్'],
])
q('consulting', 'decisionMaker', 'Who will be the final decision-maker for this engagement?', 'ఈ ఎంగేజ్‌మెంట్‌కు తుది నిర్ణయం ఎవరిది?', [
  ['Myself', 'నేను'],
  ['Founder / Managing Director', 'ఫౌండర్ / మేనేజింగ్ డైరెక్టర్'],
  ['Partners', 'పార్ట్‌నర్లు'],
  ['Sales Head', 'సేల్స్ హెడ్'],
  ['HR', 'HR'],
  ['Management team', 'మేనేజ్‌మెంట్ టీమ్'],
])
q('consulting', 'reachOutReason', 'What made you reach out to Rajiv Williams today?', 'ఈరోజు Rajiv Williamsను ఎందుకు సంప్రదించారు?', [
  ['New project launch', 'కొత్త ప్రాజెక్ట్ లాంచ్'],
  ['Low sales performance', 'తక్కువ సేల్స్ పనితీరు'],
  ['Team performance issues', 'టీమ్ పనితీరు సమస్యలు'],
  ['Business expansion', 'వ్యాపార విస్తరణ'],
  ['Referral', 'రిఫరల్'],
  ['Social media', 'సోషల్ మీడియా'],
  ['Other', 'ఇతర'],
])
q('consulting', 'investmentPlan', 'Are you planning to invest in solving this challenge?', 'ఈ సవాలు పరిష్కరించడానికి పెట్టుబడి పెట్టాలని ప్లాన్ ఉందా?', [
  ['Yes, immediately', 'అవును, వెంటనే'],
  ['Within this month', 'ఈ నెలలో'],
  ['In the next 2–3 months', 'వచ్చే 2–3 నెలల్లో'],
  ['Just exploring', 'ఇప్పుడు చూస్తున్నాను'],
])
q('consulting', 'successLooksLike', 'What would success look like after working with Rajiv Williams?', 'Rajiv Williamsతో పని చేసిన తర్వాత విజయం ఎలా ఉంటుంది?')
q('consulting', 'notes', 'Anything specific our consultants should know before the meeting?', 'మీటింగ్ ముందు మా కన్సల్టెంట్లు తెలుసుకోవాల్సిన ప్రత్యేక విషయం ఏమైనా ఉందా?')

q('realty', 'orgName', 'Please state the name of your organisation', 'మీ సంస్థ పేరు చెప్పండి')
q('realty', 'projectName', 'Please state the name of your project or venture', 'మీ ప్రాజెక్ట్ లేదా వెంచర్ పేరు చెప్పండి')
q('realty', 'location', 'Where is your project located?', 'మీ ప్రాజెక్ట్ ఎక్కడ ఉంది?', [], { ph: ['e.g. Kokapet, Hyderabad', 'ఉదా. Kokapet, Hyderabad'] })
q('realty', 'website', 'Do you have a website for your company or project?', 'మీ కంపెనీ లేదా ప్రాజెక్ట్‌కు వెబ్‌సైట్ ఉందా?', [], { ph: ['Paste the URL if you have one', 'ఉంటే URL పేస్ట్ చేయండి'] })
q('realty', 'socialLinks', 'Please share your social media profile links', 'మీ సోషల్ మీడియా ప్రొఫైల్ లింకులు పంచుకోండి', [], { ph: ['Instagram, LinkedIn, Facebook, YouTube…', 'Instagram, LinkedIn, Facebook, YouTube…'] })
q('realty', 'unitsAvailable', 'Approximately how many units are currently available for sale?', 'ఇప్పుడు అమ్మకానికి దాదాపు ఎన్ని యూనిట్లు ఉన్నాయి?', [], { ph: ['e.g. 45 units / 120 plots / 18 villas', 'ఉదా. 45 యూనిట్లు / 120 ప్లాట్లు / 18 విల్లాలు'] })
q('realty', 'objective', 'What is your primary objective for partnering with RW Realty?', 'RW Realtyతో పార్ట్‌నర్ కావడంలో మీ ప్రధాన లక్ష్యం ఏమిటి?', [
  ['Sell existing inventory', 'ఉన్న ఇన్వెంటరీ అమ్మడం'],
  ['Launch a new project', 'కొత్త ప్రాజెక్ట్ లాంచ్'],
  ['Improve sales performance', 'సేల్స్ పనితీరు మెరుగుపరచడం'],
  ['End-to-end sales mandate', 'ఎండ్-టు-ఎండ్ సేల్స్ మాండేట్'],
  ['Marketing support', 'మార్కెటింగ్ సపోర్ట్'],
  ['Other', 'ఇతర'],
])
q('realty', 'projectStage', 'What is the current stage of your project?', 'మీ ప్రాజెక్ట్ ఇప్పుడు ఏ దశలో ఉంది?', [
  ['Pre-launch', 'ప్రీ-లాంచ్'],
  ['Newly launched', 'కొత్తగా లాంచ్'],
  ['Ongoing sales', 'అమ్మకాలు సాగుతున్నాయి'],
  ['Near completion', 'పూర్తికి దగ్గర'],
  ['Ready to move', 'రెడీ టు మూవ్'],
  ['Completed inventory', 'పూర్తయిన ఇన్వెంటరీ'],
])
q('realty', 'enquirySource', 'Where do most of your enquiries currently come from?', 'మీ ఎంక్వయిరీలు ఇప్పుడు ఎక్కువగా ఎక్కడి నుంచి వస్తాయి?', [
  ['Channel partners', 'ఛానల్ పార్ట్‌నర్లు'],
  ['Meta / Facebook', 'Meta / Facebook'],
  ['Google', 'Google'],
  ['Referrals', 'రిఫరల్స్'],
  ['Walk-ins', 'వాక్-ఇన్స్'],
  ['Cold calling', 'కోల్డ్ కాలింగ్'],
  ['Other', 'ఇతర'],
])
q('realty', 'finalizeTimeline', 'When are you planning to finalise your sales / marketing partner?', 'సేల్స్ / మార్కెటింగ్ పార్ట్‌నర్‌ను ఎప్పుడు ఖరారు చేయాలనుకుంటున్నారు?', [
  ['Within 7 days', '7 రోజుల్లో'],
  ['Within 15 days', '15 రోజుల్లో'],
  ['Within 30 days', '30 రోజుల్లో'],
  ['Within 3 months', '3 నెలల్లో'],
  ['Just exploring', 'ఇప్పుడు చూస్తున్నాం'],
])
q('realty', 'decisionMaker', 'Who will be the final decision-maker for this engagement?', 'ఈ ఎంగేజ్‌మెంట్‌కు తుది నిర్ణయం ఎవరిది?', [
  ['Myself', 'నేను'],
  ['Founder / Managing Director', 'ఫౌండర్ / మేనేజింగ్ డైరెక్టర్'],
  ['Director / Partner', 'డైరెక్టర్ / పార్ట్‌నర్'],
  ['Sales Head', 'సేల్స్ హెడ్'],
  ['Marketing Head', 'మార్కెటింగ్ హెడ్'],
  ['Management team', 'మేనేజ్‌మెంట్ టీమ్'],
  ['Other', 'ఇతర'],
])
q('realty', 'reasonNow', 'Why are you looking for a sales and marketing partner now?', 'ఇప్పుడు సేల్స్, మార్కెటింగ్ పార్ట్‌నర్ ఎందుకు వెతుకుతున్నారు?', [
  ['New project launch', 'కొత్త ప్రాజెక్ట్ లాంచ్'],
  ['Sales have slowed', 'అమ్మకాలు నెమ్మదించాయి'],
  ['Inventory is not moving', 'ఇన్వెంటరీ కదలడం లేదు'],
  ['Existing agency is not delivering', 'ఉన్న ఏజెన్సీ ఫలితం ఇవ్వడం లేదు'],
  ['Expanding sales team', 'సేల్స్ టీమ్ విస్తరిస్తున్నాం'],
  ['Referral', 'రిఫరల్'],
  ['Other', 'ఇతర'],
])
q('realty', 'notes', 'Anything else you would like us to know about your project?', 'మీ ప్రాజెక్ట్ గురించి మేము తెలుసుకోవాల్సినది ఇంకేమైనా ఉందా?')

const en = {}
const te = {}
for (const [k, e, t] of rows) {
  if (en[k]) throw new Error('duplicate ' + k)
  en[k] = e
  te[k] = t
}
const emit = (obj) => 'export default ' + JSON.stringify(obj, null, 2) + '\n'
writeFileSync(join(root, 'src/i18n/partner-forms-en.js'), '/** Partner, vendor partner, and sale-form strings. */\n' + emit(en))
writeFileSync(join(root, 'src/i18n/partner-forms-te.js'), '/** Partner, vendor partner, and sale-form strings. */\n' + emit(te))
console.log('keys', Object.keys(en).length)
