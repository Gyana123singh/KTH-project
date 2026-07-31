// Mock Dataset for Kitchen Talent Hub (KTH) Admin Dashboard

export const MOCK_ADMIN_USER = {
  id: 'adm-001',
  name: 'Chef Marcus Vance',
  email: 'admin@kitchentalenthub.com',
  role: 'Super Administrator',
  avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=250&q=80',
  phone: '+1 (555) 234-5678',
  department: 'Operations & Verification',
  joinedDate: '2023-01-15',
  notificationsCount: 5,
};

export const DEPARTMENTS = [
  'Culinary Arts',
  'Pastry & Bakery',
  'Beverage & Mixology',
  'Front of House',
  'Kitchen Operations',
  'Quality Control',
  'Catering & Events',
];

export const POSITIONS = [
  'Executive Chef',
  'Head Chef',
  'Sous Chef',
  'Chef de Partie',
  'Commis Chef',
  'Pastry Chef',
  'Head Sommelier',
  'Restaurant Manager',
  'Line Cook',
  'Sushi Master',
];

export const LOCATIONS = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Miami, FL',
  'Austin, TX',
  'San Francisco, CA',
  'Seattle, WA',
  'Las Vegas, NV',
  'London, UK',
  'Dubai, UAE',
];

export const LANGUAGES_LIST = ['English', 'Spanish', 'French', 'Italian', 'Japanese', 'Mandarin', 'German', 'Hindi', 'Arabic'];

// Generates 50 dummy employees
export const MOCK_EMPLOYEES = Array.from({ length: 50 }, (_, i) => {
  const id = `EMP-${1000 + i + 1}`;
  const names = [
    'Alexander Wright', 'Elena Rostova', 'Chef Mateo Rossi', 'Samantha Chen', 'David Kim',
    'Jean-Luc Picard', 'Isabella Garcia', 'Hiroshi Tanaka', 'Marcus Johnson', 'Chloe Dubois',
    'Carlos Mendoza', 'Aaliyah Khan', 'Lukas Weber', 'Sofia Martinez', 'Gabriel Thorne',
    'Nadia Benali', 'Liam O\'Connor', 'Fatima Al-Mansoor', 'Benjamin Hayes', 'Amara Okafor',
    'Viktor Orlov', 'Hannah Miller', 'Andre Laurent', 'Mei-Ling Zhou', 'Rafael Silva'
  ];
  const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : '');
  const department = DEPARTMENTS[i % DEPARTMENTS.length];
  const position = POSITIONS[i % POSITIONS.length];
  const experienceYears = (2 + (i * 3) % 18);
  const status = i % 7 === 0 ? 'Pending Verification' : i % 11 === 0 ? 'Inactive' : 'Active';
  const avatar = `https://images.unsplash.com/photo-${1500000000000 + (i * 987654) % 1000000000}?auto=format&fit=crop&w=200&q=80`;
  
  return {
    id,
    name,
    photo: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@kitchenhub.io`,
    phone: `+1 (${300 + (i * 7) % 700}) ${100 + (i * 13) % 900}-${1000 + (i * 29) % 9000}`,
    currentPosition: position,
    department,
    experience: `${experienceYears} Years`,
    experienceYears,
    location: LOCATIONS[i % LOCATIONS.length],
    status,
    rating: (4.0 + (i % 10) * 0.1).toFixed(1),
    createdDate: new Date(2024, (i % 12), (i % 28) + 1).toISOString().split('T')[0],
    publicViews: 120 + i * 43,
    hasVoiceProfile: i % 3 !== 0,
    voiceProfileUrl: i % 3 !== 0 ? 'https://example.com/audio/sample-voice.mp3' : null,
    languages: [LANGUAGES_LIST[i % LANGUAGES_LIST.length], LANGUAGES_LIST[(i + 3) % LANGUAGES_LIST.length]],
    about: `${name} is a passionate ${position} with over ${experienceYears} years of high-volume kitchen leadership, specializing in modern gastronomy, team training, and precision inventory control. Known for maintaining Michelin-star operational standards and inspiring culinary teams.`,
    workHistoryCount: 2 + (i % 4),
    references: [
      {
        name: 'Chef Antoine Laurent',
        restaurant: 'Le Petit Bistro',
        phone: '+1 (555) 987-6543',
        status: 'Verified',
        comment: 'Exceptional attention to detail and outstanding leadership during dinner rushes.'
      },
      {
        name: 'Maria Santos',
        restaurant: 'Gourmet Haven',
        phone: '+1 (555) 345-6789',
        status: 'Verified',
        comment: 'Highly reliable, great kitchen speed, and pristine hygiene management.'
      }
    ]
  };
});

// Generates 20 dummy employers (Restaurants / Hospitality groups)
export const MOCK_EMPLOYERS = Array.from({ length: 20 }, (_, i) => {
  const restaurantNames = [
    'Le Bernardin Group', 'Alinea Culinary Studio', 'Eleven Madison Partners', 'Osteria Mozza',
    'Nobu Hospitality', 'Noma Americas', 'Per Se Kitchens', 'Gramercy Tavern',
    'Momofuku Noodle Bar', 'Blue Hill Farm', 'Catch Steak NYC', 'Spago Beverly Hills',
    'Zuma Restaurant Group', 'Duck & Waffle', 'Dishoom Hospitality', 'French Laundry Corp',
    'Hawksmoor Steakhouse', 'L\'Atelier de Joël Robuchon', 'Balthazar Dining', 'SingleThread Farm'
  ];
  const owners = [
    'Chef Eric Ripert', 'Grant Achatz', 'Daniel Humm', 'Nancy Silverton',
    'Matsuhisa Nobu', 'René Redzepi', 'Thomas Keller', 'Danny Meyer',
    'David Chang', 'Dan Barber', 'Eugene Remm', 'Wolfgang Puck',
    'Rainer Becker', 'Shamil Thakrar', 'Kaviraj Thakrar', 'Joël Robuchon Estate',
    'Will Beckett', 'Keith McNally', 'Kyle Connaughton', 'Dominique Crenn'
  ];
  const name = restaurantNames[i % restaurantNames.length];
  
  return {
    id: `EMP-GRP-${200 + i + 1}`,
    restaurant: name,
    owner: owners[i % owners.length],
    poc: `Alex ${['Rivera', 'Vargas', 'Vance', 'Sterling', 'Mercer'][i % 5]}`,
    phone: `+1 (${800 + i * 3}) ${555 + i}-${1000 + i * 11}`,
    designation: ['Executive Vice President', 'General Manager', 'Culinary Director', 'HR Partner', 'Operations Head'][i % 5],
    location: LOCATIONS[i % LOCATIONS.length],
    outletCount: 1 + (i % 8) * 3,
    status: i % 6 === 0 ? 'Pending Audit' : 'Active Partner',
    rating: (4.5 + (i % 5) * 0.1).toFixed(1),
    activeListings: 2 + (i % 6),
    createdDate: new Date(2023, i % 12, (i * 2) % 28 + 1).toISOString().split('T')[0],
    banner: `https://images.unsplash.com/photo-${1517248135467 + (i * 12345) % 10000000}?auto=format&fit=crop&w=1200&q=80`
  };
});

// Generates 100 Work History records linked to employees
export const MOCK_WORK_HISTORIES = Array.from({ length: 100 }, (_, i) => {
  const emp = MOCK_EMPLOYEES[i % MOCK_EMPLOYEES.length];
  const empEmployer = MOCK_EMPLOYERS[i % MOCK_EMPLOYERS.length];
  
  const startYear = 2015 + (i % 7);
  const endYear = startYear + 1 + (i % 3);

  return {
    id: `WH-${5000 + i + 1}`,
    employeeId: emp.id,
    employeeName: emp.name,
    employeePhoto: emp.photo,
    restaurant: empEmployer.restaurant,
    position: POSITIONS[i % POSITIONS.length],
    startDate: `${startYear}-03-15`,
    endDate: i % 4 === 0 ? 'Present' : `${endYear}-08-30`,
    referenceName: `Manager ${['John Smith', 'Sarah Jenkins', 'Robert Vance', 'Carla Rossi'][i % 4]}`,
    referencePhone: `+1 (555) ${100 + i * 3}-${2000 + i * 7}`,
    status: i % 5 === 0 ? 'Pending Verification' : i % 9 === 0 ? 'Disputed' : 'Verified',
    notes: `Demonstrated high efficiency during dinner services. Managed line cooks and food inventory standard compliance.`
  };
});

// Corrections Queue items
export const MOCK_CORRECTIONS = [
  {
    id: 'CORR-101',
    employeeId: 'EMP-1002',
    employeeName: 'Elena Rostova',
    employeePhoto: 'https://i.pravatar.cc/150?img=2',
    fieldName: 'Current Position',
    oldValue: 'Sous Chef',
    newValue: 'Head Pastry Chef',
    requestedBy: 'Elena Rostova (Self)',
    requestedDate: '2026-07-28',
    status: 'Pending',
    reason: 'Promoted to Head Pastry Chef at Le Bernardin in June 2026 with verified employment letter.'
  },
  {
    id: 'CORR-102',
    employeeId: 'EMP-1005',
    employeeName: 'David Kim',
    employeePhoto: 'https://i.pravatar.cc/150?img=5',
    fieldName: 'Experience Years',
    oldValue: '4 Years',
    newValue: '7 Years',
    requestedBy: 'Alinea Culinary Studio HR',
    requestedDate: '2026-07-29',
    status: 'Pending',
    reason: 'Updated background verification includes 3 additional years at Tokyo Sushi Institute.'
  },
  {
    id: 'CORR-103',
    employeeId: 'EMP-1012',
    employeeName: 'Aaliyah Khan',
    employeePhoto: 'https://i.pravatar.cc/150?img=12',
    fieldName: 'Voice Profile Audio',
    oldValue: 'No Audio Attached',
    newValue: 'New Audio Profile (aaliyah_intro_v2.mp3)',
    requestedBy: 'Aaliyah Khan',
    requestedDate: '2026-07-30',
    status: 'Pending',
    reason: 'Uploaded updated professional kitchen introduction in English and Arabic.'
  },
  {
    id: 'CORR-104',
    employeeId: 'EMP-1018',
    employeeName: 'Fatima Al-Mansoor',
    employeePhoto: 'https://i.pravatar.cc/150?img=18',
    fieldName: 'Work History Period',
    oldValue: 'Osteria Mozza (2021 - 2023)',
    newValue: 'Osteria Mozza (2020 - 2024)',
    requestedBy: 'Osteria Mozza Management',
    requestedDate: '2026-07-31',
    status: 'Pending',
    reason: 'Correcting official contract start date following HR audit.'
  }
];

// Dashboard Statistics Data
export const DASHBOARD_STATS = {
  totalEmployees: 1482,
  totalEmployers: 312,
  totalProfiles: 1794,
  pendingCorrections: 14,
  totalPublicViews: '284.5K',
  voiceProfiles: 968,
  monthlyRegistrations: [
    { month: 'Jan', employees: 85, employers: 12 },
    { month: 'Feb', employees: 92, employers: 18 },
    { month: 'Mar', employees: 110, employers: 24 },
    { month: 'Apr', employees: 140, employers: 20 },
    { month: 'May', employees: 175, employers: 30 },
    { month: 'Jun', employees: 210, employers: 38 },
    { month: 'Jul', employees: 245, employers: 45 },
  ],
  viewsTrend: [
    { day: 'Mon', views: 3200, searches: 1450 },
    { day: 'Tue', views: 4100, searches: 1820 },
    { day: 'Wed', views: 3900, searches: 1640 },
    { day: 'Thu', views: 5200, searches: 2100 },
    { day: 'Fri', views: 6800, searches: 2950 },
    { day: 'Sat', views: 7400, searches: 3400 },
    { day: 'Sun', views: 5900, searches: 2600 },
  ],
  languageDistribution: [
    { name: 'English', value: 45, color: '#0F766E' },
    { name: 'Spanish', value: 25, color: '#14B8A6' },
    { name: 'French', value: 15, color: '#F59E0B' },
    { name: 'Italian', value: 10, color: '#10B981' },
    { name: 'Others', value: 5, color: '#6366F1' },
  ],
  recentActivity: [
    { id: 1, type: 'registration', text: 'Chef Mateo Rossi created a new Voice Profile', time: '10 mins ago', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: 2, type: 'verification', text: 'Work History verified for Elena Rostova at Le Bernardin', time: '35 mins ago', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 3, type: 'employer', text: 'Catch Steak NYC joined as new Partner Employer', time: '2 hours ago', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: 4, type: 'correction', text: 'Correction request submitted for EMP-1018', time: '4 hours ago', avatar: 'https://i.pravatar.cc/150?img=18' },
  ]
};

// Analytics Specific Data
export const ANALYTICS_DATA = {
  searchUsage: [
    { category: 'Executive Chefs', count: 4200 },
    { category: 'Sous Chefs', count: 3800 },
    { category: 'Pastry Chefs', count: 2900 },
    { category: 'Sommeliers', count: 1800 },
    { category: 'Line Cooks', count: 5100 },
  ],
  voiceUsageData: [
    { month: 'Jan', listened: 1200 },
    { month: 'Feb', listened: 1900 },
    { month: 'Mar', listened: 2800 },
    { month: 'Apr', listened: 3400 },
    { month: 'May', listened: 4900 },
    { month: 'Jun', listened: 6200 },
    { month: 'Jul', listened: 7800 },
  ],
  metrics: {
    profileCompletionRate: '94.2%',
    correctionApprovalRate: '98.5%',
    avgSearchResponseMs: '140ms',
    voiceSamplePlaybacks: '48.2K'
  }
};
