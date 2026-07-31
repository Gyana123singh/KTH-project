const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Profile = require('../models/Profile');
const WorkExperience = require('../models/WorkExperience');
const Employer = require('../models/Employer');
const Correction = require('../models/Correction');

const DEPARTMENTS = [
  'Culinary Arts',
  'Pastry & Bakery',
  'Beverage & Mixology',
  'Front of House',
  'Kitchen Operations',
  'Quality Control',
  'Catering & Events',
];

const POSITIONS = [
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

const LOCATIONS = [
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

const seedDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kth_db';
    console.log(`Connecting to MongoDB for seeding: ${connStr}`);
    await mongoose.connect(connStr);

    console.log('Clearing existing database collections...');
    await User.deleteMany({});
    await Profile.deleteMany({});
    await WorkExperience.deleteMany({});
    await Employer.deleteMany({});
    await Correction.deleteMany({});

    console.log('1. Seeding Admin User...');
    const adminUser = await User.create({
      name: 'Chef Marcus Vance',
      email: 'admin@kitchentalenthub.com',
      password: User.hashPassword('admin123'),
      phone: '+1 (555) 234-5678',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=250&q=80',
    });

    console.log('2. Seeding Employers...');
    const employerNames = [
      'Le Bernardin Group', 'Alinea Culinary Studio', 'Eleven Madison Partners', 'Osteria Mozza',
      'Nobu Hospitality', 'Noma Americas', 'Per Se Kitchens', 'Gramercy Tavern',
      'Momofuku Noodle Bar', 'Blue Hill Farm'
    ];
    const owners = [
      'Chef Eric Ripert', 'Grant Achatz', 'Daniel Humm', 'Nancy Silverton',
      'Matsuhisa Nobu', 'René Redzepi', 'Thomas Keller', 'Danny Meyer',
      'David Chang', 'Dan Barber'
    ];

    const createdEmployers = [];
    for (let i = 0; i < employerNames.length; i++) {
      const empUser = await User.create({
        name: owners[i],
        email: `contact@${employerNames[i].toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        password: User.hashPassword('employer123'),
        phone: `+1 (${800 + i * 3}) ${555 + i}-${1000 + i * 11}`,
        role: 'employer',
      });

      const employerDoc = await Employer.create({
        userId: empUser._id,
        employerId: `EMP-GRP-${200 + i + 1}`,
        restaurant: employerNames[i],
        owner: owners[i],
        poc: `Alex ${['Rivera', 'Vargas', 'Vance', 'Sterling', 'Mercer'][i % 5]}`,
        phone: empUser.phone,
        email: empUser.email,
        designation: ['Executive Vice President', 'General Manager', 'Culinary Director', 'HR Partner', 'Operations Head'][i % 5],
        hqArea: 'Downtown',
        hqCity: LOCATIONS[i % LOCATIONS.length].split(',')[0],
        hqState: 'NY',
        hqCountry: 'USA',
        location: LOCATIONS[i % LOCATIONS.length],
        outletCount: 1 + (i % 8) * 3,
        status: i % 6 === 0 ? 'Pending Audit' : 'Active Partner',
        rating: (4.5 + (i % 5) * 0.1).toFixed(1),
        activeListings: 2 + (i % 6),
        banner: `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80`,
      });
      createdEmployers.push(employerDoc);
    }

    console.log('3. Seeding Employee Profiles & Work Histories...');
    const employeeNames = [
      'Alexander Wright', 'Elena Rostova', 'Chef Mateo Rossi', 'Samantha Chen', 'David Kim',
      'Jean-Luc Picard', 'Isabella Garcia', 'Hiroshi Tanaka', 'Marcus Johnson', 'Chloe Dubois',
      'Carlos Mendoza', 'Aaliyah Khan', 'Lukas Weber', 'Sofia Martinez', 'Gabriel Thorne',
      'Nadia Benali', 'Liam O\'Connor', 'Fatima Al-Mansoor', 'Benjamin Hayes', 'Amara Okafor'
    ];

    for (let i = 0; i < employeeNames.length; i++) {
      const name = employeeNames[i];
      const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@kitchenhub.io`;
      const empUser = await User.create({
        name,
        email,
        password: User.hashPassword('talent123'),
        phone: `+1 (${300 + (i * 7) % 700}) ${100 + (i * 13) % 900}-${1000 + (i * 29) % 9000}`,
        role: 'employee',
        avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      });

      const expYears = 2 + (i * 3) % 18;
      const dept = DEPARTMENTS[i % DEPARTMENTS.length];
      const pos = POSITIONS[i % POSITIONS.length];
      const publicId = `EMP-${1000 + i + 1}`;

      const profileDoc = await Profile.create({
        userId: empUser._id,
        publicId,
        name,
        photo: empUser.avatar,
        phone: empUser.phone,
        email: empUser.email,
        about: `${name} is a passionate ${pos} with over ${expYears} years of high-volume kitchen leadership, specializing in modern gastronomy, team training, and inventory control.`,
        currentPosition: pos,
        currentDepartment: dept,
        experienceYears: expYears,
        experience: `${expYears} Years`,
        location: LOCATIONS[i % LOCATIONS.length],
        cuisineType: ['French', 'Italian', 'Modern American', 'Japanese'][i % 4],
        languages: ['English', 'Spanish', 'Hindi'][i % 3] ? ['English', ['Spanish', 'Hindi'][i % 2]] : ['English'],
        status: i % 7 === 0 ? 'Pending Verification' : i % 11 === 0 ? 'Inactive' : 'Active',
        rating: Number((4.0 + (i % 10) * 0.1).toFixed(1)),
        publicViews: 120 + i * 43,
        hasVoiceProfile: i % 3 !== 0,
        voiceProfileUrl: i % 3 !== 0 ? 'https://example.com/audio/sample-voice.mp3' : null,
      });

      // Add 2 work histories per employee
      for (let w = 0; w < 2; w++) {
        const startYear = 2017 + w * 3;
        const endYear = startYear + 2;
        const empEmployer = createdEmployers[(i + w) % createdEmployers.length];

        await WorkExperience.create({
          profileId: profileDoc._id,
          employeeId: publicId,
          employeeName: name,
          restaurant: empEmployer.restaurant,
          position: POSITIONS[(i + w * 2) % POSITIONS.length],
          startDate: `${startYear}-03-15`,
          endDate: w === 1 && i % 2 === 0 ? 'Present' : `${endYear}-08-30`,
          referenceName: `Chef ${['John Smith', 'Sarah Jenkins', 'Robert Vance', 'Carla Rossi'][ (i + w) % 4]}`,
          referencePhone: `+1 (555) ${100 + i * 3}-${2000 + w * 7}`,
          status: (i + w) % 5 === 0 ? 'Pending Verification' : (i + w) % 9 === 0 ? 'Disputed' : 'Verified',
          notes: `Demonstrated high kitchen efficiency, managed prep station and food hygiene compliance.`,
        });
      }
    }

    console.log('4. Seeding Admin Corrections Queue...');
    await Correction.create([
      {
        correctionId: 'CORR-101',
        employeeId: 'EMP-1002',
        employeeName: 'Elena Rostova',
        employeePhoto: 'https://i.pravatar.cc/150?img=2',
        fieldName: 'Current Position',
        oldValue: 'Sous Chef',
        newValue: 'Head Pastry Chef',
        requestedBy: 'Elena Rostova (Self)',
        reason: 'Promoted to Head Pastry Chef at Le Bernardin in June 2026 with verified employment letter.',
        status: 'Pending',
      },
      {
        correctionId: 'CORR-102',
        employeeId: 'EMP-1005',
        employeeName: 'David Kim',
        employeePhoto: 'https://i.pravatar.cc/150?img=5',
        fieldName: 'Experience Years',
        oldValue: '4 Years',
        newValue: '7 Years',
        requestedBy: 'Alinea Culinary Studio HR',
        reason: 'Updated background verification includes 3 additional years at Tokyo Sushi Institute.',
        status: 'Pending',
      },
      {
        correctionId: 'CORR-103',
        employeeId: 'EMP-1012',
        employeeName: 'Aaliyah Khan',
        employeePhoto: 'https://i.pravatar.cc/150?img=12',
        fieldName: 'Voice Profile Audio',
        oldValue: 'No Audio Attached',
        newValue: 'New Audio Profile (aaliyah_intro_v2.mp3)',
        requestedBy: 'Aaliyah Khan',
        reason: 'Uploaded updated professional kitchen introduction in English and Hindi.',
        status: 'Pending',
      },
    ]);

    console.log('✅ Database seeded successfully with initial KTH dataset!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
