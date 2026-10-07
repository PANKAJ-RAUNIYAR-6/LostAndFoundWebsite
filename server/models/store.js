import bcrypt from 'bcryptjs';

// Initial pre-seeded categories
export const defaultCategories = [
  { _id: 'cat_1', name: 'Electronics & Gadgets', icon: 'Smartphone', description: 'Phones, laptops, tablets, chargers, headphones' },
  { _id: 'cat_2', name: 'Wallets, Cards & IDs', icon: 'CreditCard', description: 'Passports, driving licenses, student IDs, credit cards' },
  { _id: 'cat_3', name: 'Keys & Keychains', icon: 'Key', description: 'Car keys, house keys, locker keys' },
  { _id: 'cat_4', name: 'Bags & Luggage', icon: 'Briefcase', description: 'Backpacks, handbags, suitcases, gym bags' },
  { _id: 'cat_5', name: 'Documents & Books', icon: 'FileText', description: 'Notebooks, textbooks, certificates, files' },
  { _id: 'cat_6', name: 'Jewelry & Watches', icon: 'Watch', description: 'Rings, necklaces, smartwatches, bracelets' },
  { _id: 'cat_7', name: 'Clothing & Accessories', icon: 'Shirt', description: 'Jackets, sunglasses, hats, umbrellas' },
  { _id: 'cat_8', name: 'Pets & Animals', icon: 'PawPrint', description: 'Lost dogs, cats, pet collars' },
  { _id: 'cat_9', name: 'Others', icon: 'HelpCircle', description: 'Other miscellaneous belongings' }
];

// Seed Admin & Demo User
const hashedAdminPass = bcrypt.hashSync('Admin@123', 10);
const hashedUserPass = bcrypt.hashSync('User@123', 10);

export const defaultUsers = [
  {
    _id: 'usr_admin',
    name: 'Portal Administrator',
    email: 'admin@findit.org',
    phone: '+1 555-019-2834',
    password: hashedAdminPass,
    role: 'admin',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    rewardPoints: 500,
    isBlocked: false,
    createdAt: new Date('2026-01-01').toISOString()
  },
  {
    _id: 'usr_john',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 555-014-9821',
    password: hashedUserPass,
    role: 'user',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    rewardPoints: 120,
    isBlocked: false,
    createdAt: new Date('2026-02-15').toISOString()
  },
  {
    _id: 'usr_sarah',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    phone: '+1 555-018-7734',
    password: hashedUserPass,
    role: 'user',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    isVerified: true,
    rewardPoints: 80,
    isBlocked: false,
    createdAt: new Date('2026-03-01').toISOString()
  }
];

export const defaultItems = [
  {
    _id: 'item_1',
    type: 'LOST',
    title: 'Blue Leather Wallet with College ID',
    description: 'Lost near Central Library main steps. Contains driver license and student ID card with initials J.D. Reward offered for return!',
    category: 'Wallets, Cards & IDs',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80'],
    date: '2026-03-28',
    location: 'University Central Library, West Entrance',
    coordinates: { latitude: 28.6139, longitude: 77.2090 },
    user: 'usr_john',
    status: 'OPEN',
    contactPhone: '+1 555-014-9821',
    contactEmail: 'john@example.com',
    tags: ['wallet', 'leather', 'blue', 'cards'],
    createdAt: new Date('2026-03-28T14:30:00Z').toISOString()
  },
  {
    _id: 'item_2',
    type: 'FOUND',
    title: 'Silver Apple MacBook Air (M2 13-inch)',
    description: 'Found on desk 4B in the Engineering Computer Lab. In a black sleeve with stickers. Handed over to department front desk.',
    category: 'Electronics & Gadgets',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'],
    date: '2026-03-29',
    location: 'Engineering Building Lab 4B',
    coordinates: { latitude: 28.6145, longitude: 77.2105 },
    user: 'usr_sarah',
    status: 'OPEN',
    contactPhone: '+1 555-018-7734',
    contactEmail: 'sarah@example.com',
    tags: ['macbook', 'apple', 'laptop', 'silver'],
    createdAt: new Date('2026-03-29T10:15:00Z').toISOString()
  },
  {
    _id: 'item_3',
    type: 'LOST',
    title: 'Noise-Cancelling Sony WH-1000XM5 Headphones',
    description: 'Midnight black color in standard zip case. Forgotten on the cafeteria table during lunch hour.',
    category: 'Electronics & Gadgets',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
    date: '2026-03-27',
    location: 'Campus Dining Hall / Cafeteria',
    coordinates: { latitude: 28.6120, longitude: 77.2080 },
    user: 'usr_sarah',
    status: 'OPEN',
    contactPhone: '+1 555-018-7734',
    contactEmail: 'sarah@example.com',
    tags: ['sony', 'headphones', 'audio', 'black'],
    createdAt: new Date('2026-03-27T16:00:00Z').toISOString()
  },
  {
    _id: 'item_4',
    type: 'FOUND',
    title: 'Set of 3 House Keys with Red Swiss Army Knife',
    description: 'Found on grass lawn near the Sports Complex running track. Has red lanyard attached.',
    category: 'Keys & Keychains',
    images: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80'],
    date: '2026-03-26',
    location: 'Sports Complex Track, East Bleachers',
    coordinates: { latitude: 28.6160, longitude: 77.2070 },
    user: 'usr_john',
    status: 'RESOLVED',
    contactPhone: '+1 555-014-9821',
    contactEmail: 'john@example.com',
    tags: ['keys', 'lanyard', 'swiss army knife'],
    createdAt: new Date('2026-03-26T09:00:00Z').toISOString()
  }
];

export const defaultClaims = [
  {
    _id: 'claim_1',
    item: 'item_4',
    claimant: 'usr_sarah',
    owner: 'usr_john',
    proofDescription: 'Matches my spare house keys and the Swiss knife has my initial S engraved on the side.',
    proofImages: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80'],
    status: 'ACCEPTED',
    adminNotes: 'Verified with claimant proof of residence.',
    createdAt: new Date('2026-03-26T11:00:00Z').toISOString()
  }
];

export const defaultConversations = [
  {
    _id: 'conv_1',
    participants: ['usr_john', 'usr_sarah'],
    item: 'item_2',
    lastMessage: 'Hi Sarah, I think this might be my laptop! Where can we meet?',
    lastMessageAt: new Date('2026-03-29T11:20:00Z').toISOString(),
    createdAt: new Date('2026-03-29T11:00:00Z').toISOString()
  }
];

export const defaultMessages = [
  {
    _id: 'msg_1',
    conversation: 'conv_1',
    sender: 'usr_john',
    text: 'Hi Sarah, I saw your found post for the MacBook Air in Lab 4B!',
    readBy: ['usr_john', 'usr_sarah'],
    createdAt: new Date('2026-03-29T11:02:00Z').toISOString()
  },
  {
    _id: 'msg_2',
    conversation: 'conv_1',
    sender: 'usr_sarah',
    text: 'Hello John! Yes, I handed it to Mr. Miller at the engineering department office for safety.',
    readBy: ['usr_john', 'usr_sarah'],
    createdAt: new Date('2026-03-29T11:10:00Z').toISOString()
  },
  {
    _id: 'msg_3',
    conversation: 'conv_1',
    sender: 'usr_john',
    text: 'Hi Sarah, I think this might be my laptop! Where can we meet?',
    readBy: ['usr_john'],
    createdAt: new Date('2026-03-29T11:20:00Z').toISOString()
  }
];

export const defaultNotifications = [
  {
    _id: 'notif_1',
    user: 'usr_sarah',
    title: 'Claim Accepted!',
    message: 'Your claim for "Set of 3 House Keys" has been approved and marked as resolved.',
    type: 'CLAIM',
    link: '/claims',
    isRead: false,
    createdAt: new Date('2026-03-26T12:00:00Z').toISOString()
  },
  {
    _id: 'notif_2',
    user: 'usr_john',
    title: 'New Message',
    message: 'Sarah Connor replied to your query regarding the MacBook Air.',
    type: 'CHAT',
    link: '/chat',
    isRead: true,
    createdAt: new Date('2026-03-29T11:10:00Z').toISOString()
  }
];

export const defaultFeedbacks = [
  {
    _id: 'fb_1',
    user: 'usr_sarah',
    rating: 5,
    comment: 'Recovered my lost house keys within 2 hours of posting! Fantastic community platform.',
    targetType: 'PLATFORM',
    createdAt: new Date('2026-03-26T15:00:00Z').toISOString()
  },
  {
    _id: 'fb_2',
    user: 'usr_john',
    rating: 5,
    comment: 'The Mapbox location picker made pinpointing the exact bench where I left my items super simple.',
    targetType: 'PLATFORM',
    createdAt: new Date('2026-03-28T18:00:00Z').toISOString()
  }
];

export const defaultRewards = [
  {
    _id: 'rew_1',
    user: 'usr_john',
    points: 100,
    reason: 'Helped recover and return lost keys to rightful owner',
    item: 'item_4',
    createdAt: new Date('2026-03-26T12:05:00Z').toISOString()
  },
  {
    _id: 'rew_2',
    user: 'usr_john',
    points: 20,
    reason: 'First verified item report bonus',
    createdAt: new Date('2026-03-25T09:00:00Z').toISOString()
  }
];

export const defaultAbuseReports = [
  {
    _id: 'rep_1',
    reporter: 'usr_sarah',
    item: 'item_1',
    reason: 'Suspected duplicate listing',
    details: 'This item appears to have been posted twice earlier today.',
    status: 'REVIEWED',
    createdAt: new Date('2026-03-28T16:00:00Z').toISOString()
  }
];

export const defaultActivityLogs = [
  {
    _id: 'act_1',
    user: 'usr_john',
    action: 'ITEM_REPORTED',
    details: 'Reported lost item: Blue Leather Wallet',
    ip: '127.0.0.1',
    createdAt: new Date('2026-03-28T14:30:00Z').toISOString()
  },
  {
    _id: 'act_2',
    user: 'usr_sarah',
    action: 'CLAIM_SUBMITTED',
    details: 'Submitted claim for Set of 3 House Keys',
    ip: '127.0.0.1',
    createdAt: new Date('2026-03-26T11:00:00Z').toISOString()
  }
];

// Unified In-Memory Store
export const store = {
  users: [...defaultUsers],
  items: [...defaultItems],
  claims: [...defaultClaims],
  conversations: [...defaultConversations],
  messages: [...defaultMessages],
  notifications: [...defaultNotifications],
  otps: [],
  feedbacks: [...defaultFeedbacks],
  rewards: [...defaultRewards],
  abuseReports: [...defaultAbuseReports],
  categories: [...defaultCategories],
  activityLogs: [...defaultActivityLogs]
};
