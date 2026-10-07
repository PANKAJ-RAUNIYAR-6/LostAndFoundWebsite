import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const seedDefaultUsers = async () => {
  try {
    const users = [
      {
        name: 'Portal Administrator',
        email: 'admin@findit.org',
        phone: '+1 555-019-2834',
        password: 'Admin@123',
        role: 'admin',
        profileImage:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        isVerified: true,
        rewardPoints: 500,
        isBlocked: false
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 555-014-9821',
        password: 'User@123',
        role: 'user',
        profileImage:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        isVerified: true,
        rewardPoints: 120,
        isBlocked: false
      },
      {
        name: 'Sarah Connor',
        email: 'sarah@example.com',
        phone: '+1 555-018-7734',
        password: 'User@123',
        role: 'user',
        profileImage:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
        isVerified: true,
        rewardPoints: 80,
        isBlocked: false
      }
    ];

    for (const userData of users) {
      const email = userData.email.toLowerCase();

      const existingUser = await User.findOne({ email });

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      if (existingUser) {
        existingUser.name = userData.name;
        existingUser.phone = userData.phone;
        existingUser.password = hashedPassword;
        existingUser.role = userData.role;
        existingUser.profileImage = userData.profileImage;
        existingUser.isVerified = userData.isVerified;
        existingUser.rewardPoints = userData.rewardPoints;
        existingUser.isBlocked = userData.isBlocked;

        await existingUser.save();

        console.log(`[Seed] User updated: ${email}`);
      } else {
        await User.create({
          name: userData.name,
          email,
          phone: userData.phone,
          password: hashedPassword,
          role: userData.role,
          profileImage: userData.profileImage,
          isVerified: userData.isVerified,
          rewardPoints: userData.rewardPoints,
          isBlocked: userData.isBlocked
        });

        console.log(`[Seed] User created: ${email}`);
      }
    }

    console.log('[Seed] Default users sync completed.');
  } catch (error) {
    console.error('[Seed] Failed to seed default users:', error);
  }
};