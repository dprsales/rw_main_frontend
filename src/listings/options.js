export const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Plot',
  'Builder Floor',
  'Penthouse',
  'Independent House',
]

export const BHK_OPTIONS = [
  'Studio',
  '1 RK',
  '1 BHK',
  '1.5 BHK',
  '2 BHK',
  '2.5 BHK',
  '3 BHK',
  '3.5 BHK',
  '4 BHK',
  '5 BHK',
  '6 BHK',
  '6+ BHK',
]

export const ADDITIONAL_SPACE_OPTIONS = [
  'Pooja Room',
  'Servant Room',
  'Study Room',
  'Extra Room',
  'Basement',
  'Store Room',
]

export const AGE_OPTIONS = ['0-1', '2-4', '5-7', '8-10', '10+']

export const COUNT_OPTIONS = ['1', '2', '3', '4', '5', '6', '6+']
export const COUNT_OPTIONS_NA = ['N/A', '1', '2', '3', '4', '5', '6', '6+']

export const BALCONY_OPTIONS = ['Connected', 'Individual', 'Room-attached']

export const LOCATION_ADVANTAGES = [
  { key: 'officePark', label: 'Office Park', icon: '🏢' },
  { key: 'schools', label: 'Schools', icon: '🏫' },
  { key: 'college', label: 'College and University', icon: '🎓' },
  { key: 'hospital', label: 'Hospital', icon: '🏥' },
  { key: 'mall', label: 'Shopping Mall', icon: '🛍️' },
  { key: 'park', label: 'Park', icon: '🌳' },
  { key: 'hotel', label: 'Hotel', icon: '🏨' },
]

export const FLOORING_OPTIONS = [
  'Vitrified Tiles',
  'Marble',
  'Wooden',
  'Granite',
  'Ceramic Tiles',
  'Cement',
]

export const PRICE_ADVANTAGES = [
  'Affordable Price',
  'Urgent Sale',
  'Below Market Value',
  'Negotiable Price',
  'Best Price in Locality',
  'Quick Deal Preferred',
  'Distress Sale',
]

export const OWNERSHIP_TYPES = ['Free Hold', 'Leasehold', 'Power of attorney']

export const PROPERTY_HIGHLIGHTS = [
  'Pet Friendly',
  'Gated Community',
  'Smart Home',
  'Premium Location',
  'Corner Unit',
  'Vaastu Compliant',
  'Private Garden',
  'Low Density Project',
  'Quiet/Low Traffic Area',
  'Wheelchair Accessible',
  'Never Occupied',
]

export const FACING_OPTIONS = [
  'North',
  'South',
  'East',
  'West',
  'North-East',
  'North-West',
  'South-East',
  'South-West',
]

export const VIEW_OPTIONS = ['Park View', 'City View', 'Pool View', 'Garden View', 'Open View']

export const AMENITY_GROUPS = [
  { key: 'sports', label: 'Sports', icon: '🏀' },
  { key: 'convenience', label: 'Convenience', icon: '🛒' },
  { key: 'safety', label: 'Safety', icon: '🛡️' },
  { key: 'leisure', label: 'Leisure', icon: '🎉' },
  { key: 'environment', label: 'Environment', icon: '🌿' },
]

export const WIZARD_STEPS = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Basic Configuration' },
  { id: 3, label: 'Media & Highlights' },
  { id: 4, label: 'Detailed Configuration' },
  { id: 5, label: 'Description' },
]

export const AMENITY_OPTIONS = {
  sports: ['Gym', 'Swimming Pool', 'Badminton Court', 'Jogging Track', 'Cricket Pitch'],
  convenience: ['Power Backup', 'Lift', 'Water Storage', 'Grocery Shop', 'ATM'],
  safety: ['CCTV', '24x7 Security', 'Fire Safety', 'Intercom'],
  leisure: ['Clubhouse', "Kids' Play Area", 'Party Hall', 'Amphitheatre'],
  environment: ['Rainwater Harvesting', 'Garden', 'Sewage Treatment Plant'],
}

export const AREA_UNITS = ['sq.ft', 'sq.yd', 'sq.m', 'acres']

export const DISTANCE_OPTIONS = ['< 1 km', '1-3 km', '3-5 km', '5+ km']

export const BUDGET_OPTIONS = [
  { label: 'Any budget', min: '', max: '' },
  { label: 'Under ₹50 L', min: '', max: 5000000 },
  { label: '₹50 L – ₹1 Cr', min: 5000000, max: 10000000 },
  { label: '₹1 Cr – ₹2 Cr', min: 10000000, max: 20000000 },
  { label: '₹2 Cr – ₹5 Cr', min: 20000000, max: 50000000 },
  { label: 'Above ₹5 Cr', min: 50000000, max: '' },
]

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'popular', label: 'Most viewed' },
]

// ---------- dropdown option lists (wizard) ----------
export const LISTING_TYPES = ['Sale', 'Rent']
export const BUILDING_TYPES = ['Residential', 'Commercial']
export const AREA_TYPES = ['Carpet Area', 'Built-up Area', 'Super Built-up Area', 'Plot Area']
export const PRICE_TYPES = ['All Inclusive', 'Base Price']
export const POSSESSION_OPTIONS = ['Ready To Move', 'Under Construction']
export const FURNISHING_OPTIONS = ['Furnished', 'Semi-Furnished', 'Unfurnished']
export const POWER_BACKUP_OPTIONS = ['No Back-up', 'Partial', 'Full']
export const TRANSACTION_OPTIONS = ['Resale', 'New Booking']
export const ROAD_UNITS = ['Feet', 'Meter']

export const CITY_OPTIONS = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Pune', 'Chennai', 'Delhi NCR', 'Kolkata', 'Ahmedabad', 'Vijayawada', 'Visakhapatnam']

export const LOCALITIES = {
  Hyderabad: [
    'Kokapet', 'Gachibowli', 'Financial District', 'Kondapur', 'Madhapur', 'HITEC City', 'Narsingi', 'Tellapur',
    'Puppalaguda', 'Manikonda', 'Nallagandla', 'Miyapur', 'Kukatpally', 'Bachupally', 'Jubilee Hills', 'Banjara Hills',
    'Gandipet', 'Shamshabad', 'Uppal', 'Tukkuguda', 'Ghatkesar',
  ],
  Bengaluru: ['Whitefield', 'Sarjapur Road', 'Electronic City', 'Hebbal', 'Yelahanka', 'HSR Layout', 'Koramangala', 'Indiranagar', 'Devanahalli'],
  Mumbai: ['Andheri', 'Bandra', 'Powai', 'Thane', 'Navi Mumbai', 'Chembur', 'Borivali', 'Worli'],
  Pune: ['Hinjewadi', 'Baner', 'Wakad', 'Kharadi', 'Hadapsar', 'Pimple Saudagar', 'Mahalunge'],
  Chennai: ['OMR', 'Velachery', 'Adyar', 'Anna Nagar', 'Porur', 'Sholinganallur'],
}

/** Common things buyers will find out on a site visit anyway — disclosing them builds trust. */
export const NEGATIVE_HIGHLIGHTS = [
  'Main road / traffic noise',
  'Near highway or flyover',
  'Under-construction neighbourhood',
  'Water-logging in monsoon',
  'Limited parking',
  'No lift',
  'Older construction',
  'Needs minor repairs / paint',
  'Far from metro / public transport',
  'Irregular water supply',
  'Frequent power cuts',
  'Narrow approach road',
  'Near industrial area',
  'Low natural light',
  'Pending OC / registration',
]

export const NEARBY_OPTIONS = ['< 1 km', '1-3 km', '3-5 km', '5+ km']

export const TOTAL_FLOOR_OPTIONS = Array.from({ length: 80 }, (_, i) => String(i + 1))
export const floorOptions = (total) => {
  const max = Math.min(Number(total) || 80, 80)
  return [{ value: '0', label: 'Ground' }, ...Array.from({ length: max }, (_, i) => String(i + 1))]
}

export const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'].map((v, i) => ({
  value: v,
  label: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
}))
export const yearOptions = () => {
  const y = new Date().getFullYear()
  return Array.from({ length: 9 }, (_, i) => String(y + i))
}
