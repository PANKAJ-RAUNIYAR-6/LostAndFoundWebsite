import { getDbStatus } from '../config/db.js';
import { store } from '../models/store.js';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import OTP from '../models/OTP.js';
import Feedback from '../models/Feedback.js';
import Reward from '../models/Reward.js';
import AbuseReport from '../models/AbuseReport.js';
import Category from '../models/Category.js';
import ActivityLog from '../models/ActivityLog.js';

const genId = (prefix = 'id') => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export const dbService = {
  // USERS
  async findUserByEmail(email) {
    if (getDbStatus().connected) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (getDbStatus().connected) {
      return await User.findById(id).select('-password');
    }
    const u = store.users.find(usr => String(usr._id) === String(id));
    if (!u) return null;
    const { password, ...safeUser } = u;
    return safeUser;
  },

  async createUser(userData) {
    if (getDbStatus().connected) {
      return await User.create(userData);
    }
    const newUser = {
      _id: genId('usr'),
      ...userData,
      isVerified: userData.isVerified ?? false,
      rewardPoints: userData.rewardPoints ?? 0,
      isBlocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.users.push(newUser);
    return newUser;
  },

  async updateUser(id, updateData) {
    if (getDbStatus().connected) {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    const idx = store.users.findIndex(u => String(u._id) === String(id));
    if (idx === -1) return null;
    store.users[idx] = {
      ...store.users[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    const { password, ...safeUser } = store.users[idx];
    return safeUser;
  },

  async getAllUsers() {
    if (getDbStatus().connected) {
      return await User.find().select('-password').sort({ createdAt: -1 });
    }
    return store.users.map(({ password, ...u }) => u);
  },

  async deleteUser(id) {
    if (getDbStatus().connected) {
      return await User.findByIdAndDelete(id);
    }
    const idx = store.users.findIndex(u => String(u._id) === String(id));
    if (idx !== -1) {
      const removed = store.users.splice(idx, 1);
      return removed[0];
    }
    return null;
  },

  // ITEMS
  async findItems(filters = {}, options = { page: 1, limit: 12, sort: { createdAt: -1 } }) {
    if (getDbStatus().connected) {
      const query = {};
      if (filters.type) query.type = filters.type;
      if (filters.category && filters.category !== 'All') query.category = filters.category;
      if (filters.status && filters.status !== 'All') query.status = filters.status;
      if (filters.user) query.user = filters.user;
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { location: { $regex: filters.search, $options: 'i' } }
        ];
      }
      const skip = (options.page - 1) * options.limit;
      const total = await Item.countDocuments(query);
      const items = await Item.find(query)
        .populate('user', 'name email profileImage')
        .sort(options.sort)
        .skip(skip)
        .limit(options.limit);
      return { items, total, totalPages: Math.ceil(total / options.limit), currentPage: options.page };
    }

    let items = [...store.items];
    if (filters.type) items = items.filter(it => it.type === filters.type);
    if (filters.category && filters.category !== 'All') items = items.filter(it => it.category === filters.category);
    if (filters.status && filters.status !== 'All') items = items.filter(it => it.status === filters.status);
    if (filters.user) items = items.filter(it => String(it.user) === String(filters.user));
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(it =>
        it.title?.toLowerCase().includes(q) ||
        it.description?.toLowerCase().includes(q) ||
        it.location?.toLowerCase().includes(q)
      );
    }
    if (filters.date) {
      items = items.filter(it => it.date === filters.date);
    }

    // Sort
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = items.length;
    const skip = (options.page - 1) * options.limit;
    const paged = items.slice(skip, skip + options.limit).map(it => {
      const u = store.users.find(user => String(user._id) === String(it.user));
      return {
        ...it,
        user: u ? { _id: u._id, name: u.name, email: u.email, profileImage: u.profileImage } : it.user
      };
    });

    return {
      items: paged,
      total,
      totalPages: Math.ceil(total / options.limit) || 1,
      currentPage: options.page
    };
  },

  async findItemById(id) {
    if (getDbStatus().connected) {
      return await Item.findById(id).populate('user', 'name email phone profileImage');
    }
    const it = store.items.find(item => String(item._id) === String(id));
    if (!it) return null;
    const u = store.users.find(user => String(user._id) === String(it.user));
    return {
      ...it,
      user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone, profileImage: u.profileImage } : it.user
    };
  },

  async createItem(itemData) {
    if (getDbStatus().connected) {
      return await Item.create(itemData);
    }
    const newItem = {
      _id: genId('item'),
      ...itemData,
      status: itemData.status || 'OPEN',
      images: itemData.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.items.unshift(newItem);
    return newItem;
  },

  async updateItem(id, updateData) {
    if (getDbStatus().connected) {
      return await Item.findByIdAndUpdate(id, updateData, { new: true }).populate('user', 'name email profileImage');
    }
    const idx = store.items.findIndex(it => String(it._id) === String(id));
    if (idx === -1) return null;
    store.items[idx] = {
      ...store.items[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return store.items[idx];
  },

  async deleteItem(id) {
    if (getDbStatus().connected) {
      return await Item.findByIdAndDelete(id);
    }
    const idx = store.items.findIndex(it => String(it._id) === String(id));
    if (idx !== -1) {
      return store.items.splice(idx, 1)[0];
    }
    return null;
  },

  // CLAIMS
  async createClaim(claimData) {
    if (getDbStatus().connected) {
      return await Claim.create(claimData);
    }
    const newClaim = {
      _id: genId('claim'),
      ...claimData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.claims.unshift(newClaim);
    return newClaim;
  },

  async findClaims(query = {}) {
    if (getDbStatus().connected) {
      return await Claim.find(query)
        .populate('item')
        .populate('claimant', 'name email profileImage phone')
        .populate('owner', 'name email profileImage phone')
        .sort({ createdAt: -1 });
    }
    let claims = [...store.claims];
    if (query.item) claims = claims.filter(c => String(c.item) === String(query.item));
    if (query.claimant) claims = claims.filter(c => String(c.claimant) === String(query.claimant));
    if (query.owner) claims = claims.filter(c => String(c.owner) === String(query.owner));

    return claims.map(c => {
      const it = store.items.find(item => String(item._id) === String(c.item));
      const claimant = store.users.find(u => String(u._id) === String(c.claimant));
      const owner = store.users.find(u => String(u._id) === String(c.owner));
      return {
        ...c,
        item: it || c.item,
        claimant: claimant ? { _id: claimant._id, name: claimant.name, email: claimant.email, profileImage: claimant.profileImage } : c.claimant,
        owner: owner ? { _id: owner._id, name: owner.name, email: owner.email } : c.owner
      };
    });
  },

  async findClaimById(id) {
    if (getDbStatus().connected) {
      return await Claim.findById(id).populate('item').populate('claimant').populate('owner');
    }
    const c = store.claims.find(claim => String(claim._id) === String(id));
    if (!c) return null;
    const it = store.items.find(item => String(item._id) === String(c.item));
    const claimant = store.users.find(u => String(u._id) === String(c.claimant));
    const owner = store.users.find(u => String(u._id) === String(c.owner));
    return {
      ...c,
      item: it || c.item,
      claimant: claimant || c.claimant,
      owner: owner || c.owner
    };
  },

  async updateClaim(id, updateData) {
    if (getDbStatus().connected) {
      return await Claim.findByIdAndUpdate(id, updateData, { new: true });
    }
    const idx = store.claims.findIndex(c => String(c._id) === String(id));
    if (idx === -1) return null;
    store.claims[idx] = {
      ...store.claims[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return store.claims[idx];
  },

  // CHAT / CONVERSATIONS
  async findConversationsForUser(userId) {
    if (getDbStatus().connected) {
      return await Conversation.find({ participants: userId })
        .populate('participants', 'name email profileImage')
        .populate('item', 'title images type status')
        .sort({ lastMessageAt: -1 });
    }
    const convs = store.conversations.filter(c => c.participants.map(String).includes(String(userId)));
    return convs.map(c => {
      const parts = c.participants.map(pid => {
        const u = store.users.find(user => String(user._id) === String(pid));
        return u ? { _id: u._id, name: u.name, email: u.email, profileImage: u.profileImage } : { _id: pid };
      });
      const it = c.item ? store.items.find(item => String(item._id) === String(c.item)) : null;
      return {
        ...c,
        participants: parts,
        item: it ? { _id: it._id, title: it.title, images: it.images, type: it.type, status: it.status } : null
      };
    }).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  },

  async findConversationById(id) {
    if (getDbStatus().connected) {
      return await Conversation.findById(id).populate('participants', 'name email profileImage').populate('item');
    }
    const c = store.conversations.find(conv => String(conv._id) === String(id));
    if (!c) return null;
    const parts = c.participants.map(pid => {
      const u = store.users.find(user => String(user._id) === String(pid));
      return u ? { _id: u._id, name: u.name, email: u.email, profileImage: u.profileImage } : { _id: pid };
    });
    const it = c.item ? store.items.find(item => String(item._id) === String(c.item)) : null;
    return { ...c, participants: parts, item: it };
  },

  async createOrGetConversation(user1, user2, itemId = null) {
    if (getDbStatus().connected) {
      let conv = await Conversation.findOne({
        participants: { $all: [user1, user2] },
        ...(itemId ? { item: itemId } : {})
      });
      if (!conv) {
        conv = await Conversation.create({
          participants: [user1, user2],
          item: itemId,
          lastMessage: '',
          lastMessageAt: new Date()
        });
      }
      return conv;
    }

    let existing = store.conversations.find(c =>
      c.participants.map(String).includes(String(user1)) &&
      c.participants.map(String).includes(String(user2)) &&
      (!itemId || String(c.item) === String(itemId))
    );
    if (existing) return existing;

    const newConv = {
      _id: genId('conv'),
      participants: [String(user1), String(user2)],
      item: itemId ? String(itemId) : null,
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    store.conversations.unshift(newConv);
    return newConv;
  },

  async getMessages(conversationId) {
    if (getDbStatus().connected) {
      return await Message.find({ conversation: conversationId }).populate('sender', 'name profileImage').sort({ createdAt: 1 });
    }
    const msgs = store.messages.filter(m => String(m.conversation) === String(conversationId));
    return msgs.map(m => {
      const sender = store.users.find(u => String(u._id) === String(m.sender));
      return {
        ...m,
        sender: sender ? { _id: sender._id, name: sender.name, profileImage: sender.profileImage } : m.sender
      };
    }).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },

  async createMessage(messageData) {
    if (getDbStatus().connected) {
      const msg = await Message.create(messageData);
      await Conversation.findByIdAndUpdate(messageData.conversation, {
        lastMessage: messageData.text,
        lastMessageAt: new Date()
      });
      return msg;
    }
    const newMsg = {
      _id: genId('msg'),
      ...messageData,
      readBy: [String(messageData.sender)],
      createdAt: new Date().toISOString()
    };
    store.messages.push(newMsg);
    // update conv
    const convIdx = store.conversations.findIndex(c => String(c._id) === String(messageData.conversation));
    if (convIdx !== -1) {
      store.conversations[convIdx].lastMessage = messageData.text;
      store.conversations[convIdx].lastMessageAt = newMsg.createdAt;
    }
    const sender = store.users.find(u => String(u._id) === String(newMsg.sender));
    return {
      ...newMsg,
      sender: sender ? { _id: sender._id, name: sender.name, profileImage: sender.profileImage } : newMsg.sender
    };
  },

  // NOTIFICATIONS
  async findNotifications(userId) {
    if (getDbStatus().connected) {
      return await Notification.find({ user: userId }).sort({ createdAt: -1 });
    }
    return store.notifications
      .filter(n => String(n.user) === String(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async createNotification(notifData) {
    if (getDbStatus().connected) {
      return await Notification.create(notifData);
    }
    const newNotif = {
      _id: genId('notif'),
      ...notifData,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    store.notifications.unshift(newNotif);
    return newNotif;
  },

  async markNotificationRead(id) {
    if (getDbStatus().connected) {
      return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }
    const n = store.notifications.find(notif => String(notif._id) === String(id));
    if (n) n.isRead = true;
    return n;
  },

  async markAllNotificationsRead(userId) {
    if (getDbStatus().connected) {
      return await Notification.updateMany({ user: userId }, { isRead: true });
    }
    store.notifications.forEach(n => {
      if (String(n.user) === String(userId)) n.isRead = true;
    });
    return true;
  },

  // OTP
  async saveOTP(email, code, expiryMinutes = 10) {
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    if (getDbStatus().connected) {
      await OTP.deleteMany({ email: email.toLowerCase() });
      return await OTP.create({ email: email.toLowerCase(), code, expiresAt });
    }
    store.otps = store.otps.filter(o => o.email.toLowerCase() !== email.toLowerCase());
    const newOtp = { _id: genId('otp'), email: email.toLowerCase(), code, expiresAt };
    store.otps.push(newOtp);
    return newOtp;
  },

  async verifyOTP(email, code) {
    const now = new Date();
    if (getDbStatus().connected) {
      const record = await OTP.findOne({ email: email.toLowerCase(), code, expiresAt: { $gt: now } });
      if (record) {
        await OTP.deleteOne({ _id: record._id });
        return true;
      }
      return false;
    }
    const idx = store.otps.findIndex(o =>
      o.email.toLowerCase() === email.toLowerCase() &&
      String(o.code) === String(code) &&
      new Date(o.expiresAt) > now
    );
    if (idx !== -1) {
      store.otps.splice(idx, 1);
      return true;
    }
    return false;
  },

  // FEEDBACK
  async createFeedback(fbData) {
    if (getDbStatus().connected) {
      return await Feedback.create(fbData);
    }
    const newFb = {
      _id: genId('fb'),
      ...fbData,
      createdAt: new Date().toISOString()
    };
    store.feedbacks.unshift(newFb);
    return newFb;
  },

  async getAllFeedbacks() {
    if (getDbStatus().connected) {
      return await Feedback.find().populate('user', 'name profileImage').sort({ createdAt: -1 });
    }
    return store.feedbacks.map(fb => {
      const u = store.users.find(user => String(user._id) === String(fb.user));
      return {
        ...fb,
        user: u ? { _id: u._id, name: u.name, profileImage: u.profileImage } : fb.user
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // REWARDS
  async createReward(rewardData) {
    if (getDbStatus().connected) {
      const rew = await Reward.create(rewardData);
      await User.findByIdAndUpdate(rewardData.user, { $inc: { rewardPoints: rewardData.points } });
      return rew;
    }
    const newRew = {
      _id: genId('rew'),
      ...rewardData,
      createdAt: new Date().toISOString()
    };
    store.rewards.unshift(newRew);
    const u = store.users.find(user => String(user._id) === String(rewardData.user));
    if (u) u.rewardPoints = (u.rewardPoints || 0) + Number(rewardData.points);
    return newRew;
  },

  async getRewardsForUser(userId) {
    if (getDbStatus().connected) {
      return await Reward.find({ user: userId }).sort({ createdAt: -1 });
    }
    return store.rewards
      .filter(r => String(r.user) === String(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAllRewards() {
    if (getDbStatus().connected) {
      return await Reward.find().populate('user', 'name email').sort({ createdAt: -1 });
    }
    return store.rewards.map(r => {
      const u = store.users.find(user => String(user._id) === String(r.user));
      return { ...r, user: u ? { _id: u._id, name: u.name, email: u.email } : r.user };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // ABUSE REPORTS
  async createAbuseReport(reportData) {
    if (getDbStatus().connected) {
      return await AbuseReport.create(reportData);
    }
    const newReport = {
      _id: genId('rep'),
      ...reportData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    store.abuseReports.unshift(newReport);
    return newReport;
  },

  async getAllAbuseReports() {
    if (getDbStatus().connected) {
      return await AbuseReport.find()
        .populate('reporter', 'name email')
        .populate('item', 'title type status')
        .sort({ createdAt: -1 });
    }
    return store.abuseReports.map(rep => {
      const reporter = store.users.find(u => String(u._id) === String(rep.reporter));
      const it = rep.item ? store.items.find(item => String(item._id) === String(rep.item)) : null;
      return {
        ...rep,
        reporter: reporter ? { _id: reporter._id, name: reporter.name, email: reporter.email } : rep.reporter,
        item: it ? { _id: it._id, title: it.title, type: it.type, status: it.status } : rep.item
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async updateAbuseReportStatus(id, status) {
    if (getDbStatus().connected) {
      return await AbuseReport.findByIdAndUpdate(id, { status }, { new: true });
    }
    const idx = store.abuseReports.findIndex(r => String(r._id) === String(id));
    if (idx !== -1) {
      store.abuseReports[idx].status = status;
      store.abuseReports[idx].updatedAt = new Date().toISOString();
      return store.abuseReports[idx];
    }
    return null;
  },

  // CATEGORIES
  async getAllCategories() {
    if (getDbStatus().connected) {
      const cats = await Category.find().sort({ name: 1 });
      if (cats.length > 0) return cats;
    }
    return store.categories;
  },

  async createCategory(catData) {
    if (getDbStatus().connected) {
      return await Category.create(catData);
    }
    const newCat = {
      _id: genId('cat'),
      ...catData,
      createdAt: new Date().toISOString()
    };
    store.categories.push(newCat);
    return newCat;
  },

  async deleteCategory(id) {
    if (getDbStatus().connected) {
      return await Category.findByIdAndDelete(id);
    }
    const idx = store.categories.findIndex(c => String(c._id) === String(id));
    if (idx !== -1) {
      return store.categories.splice(idx, 1)[0];
    }
    return null;
  },

  // ACTIVITY LOGS
  async createActivityLog(logData) {
    if (getDbStatus().connected) {
      return await ActivityLog.create(logData);
    }
    const newLog = {
      _id: genId('act'),
      ...logData,
      createdAt: new Date().toISOString()
    };
    store.activityLogs.unshift(newLog);
    return newLog;
  },

  async getActivityLogs(limit = 20) {
    if (getDbStatus().connected) {
      return await ActivityLog.find().populate('user', 'name email role').sort({ createdAt: -1 }).limit(limit);
    }
    return store.activityLogs.slice(0, limit).map(l => {
      const u = store.users.find(user => String(user._id) === String(l.user));
      return {
        ...l,
        user: u ? { _id: u._id, name: u.name, email: u.email, role: u.role } : l.user
      };
    });
  },

  // SYSTEM STATS (for Admin Analytics)
//   async getStats() {
//     let usersCount, lostCount, foundCount, resolvedCount, claimsCount, pendingAbuseCount;

//     if (getDbStatus().connected) {
//       [usersCount, lostCount, foundCount, resolvedCount, claimsCount, pendingAbuseCount] = await Promise.all([
//         User.countDocuments(),
//         Item.countDocuments({ type: 'LOST' }),
//         Item.countDocuments({ type: 'FOUND' }),
//         Item.countDocuments({ status: 'RESOLVED' }),
//         Claim.countDocuments(),
//         AbuseReport.countDocuments({ status: 'PENDING' })
//       ]);
//     } else {
//       usersCount = store.users.length;
//       lostCount = store.items.filter(it => it.type === 'LOST').length;
//       foundCount = store.items.filter(it => it.type === 'FOUND').length;
//       resolvedCount = store.items.filter(it => it.status === 'RESOLVED').length;
//       claimsCount = store.claims.length;
//       pendingAbuseCount = store.abuseReports.filter(r => r.status === 'PENDING').length;
//     }

//     return {
//       totalUsers: usersCount,
//       totalLost: lostCount,
//       totalFound: foundCount,
//       totalResolved: resolvedCount,
//       activeClaims: claimsCount,
//       pendingReports: pendingAbuseCount,
//       dbStatus: getDbStatus()
//     };
//   }

// SYSTEM STATS (for Admin Analytics)
async getStats() {
  let usersCount, lostCount, foundCount, resolvedCount, claimsCount, pendingAbuseCount;

  if (getDbStatus().connected) {
    [usersCount, lostCount, foundCount, resolvedCount, claimsCount, pendingAbuseCount] =
      await Promise.all([
        // Only non-blocked users are considered active community users
        User.countDocuments({ isBlocked: { $ne: true } }),

        // Total lost items reported
        Item.countDocuments({ type: 'LOST' }),

        // Total found items registered
        Item.countDocuments({ type: 'FOUND' }),

        // Items successfully returned/resolved
        Item.countDocuments({ status: 'RESOLVED' }),

        // Total claims
        Claim.countDocuments(),

        // Pending abuse reports
        AbuseReport.countDocuments({ status: 'PENDING' })
      ]);
  } else {
    // Active / non-blocked users
    usersCount = store.users.filter(user => user.isBlocked !== true).length;

    // Total lost items
    lostCount = store.items.filter(item => item.type === 'LOST').length;

    // Total found items
    foundCount = store.items.filter(item => item.type === 'FOUND').length;

    // Successfully returned/resolved items
    resolvedCount = store.items.filter(item => item.status === 'RESOLVED').length;

    // Total claims
    claimsCount = store.claims.length;

    // Pending abuse reports
    pendingAbuseCount = store.abuseReports.filter(
      report => report.status === 'PENDING'
    ).length;
  }

  return {
    totalUsers: usersCount,
    totalLost: lostCount,
    totalFound: foundCount,
    totalResolved: resolvedCount,
    activeClaims: claimsCount,
    pendingReports: pendingAbuseCount,
    dbStatus: getDbStatus()
  };
}

};


export default dbService;
