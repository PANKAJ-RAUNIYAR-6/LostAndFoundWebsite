
import bcrypt from 'bcryptjs';
import dbService from '../services/dbService.js';
import { generateToken } from '../middleware/auth.js';
import { sendOTPEmail } from '../services/emailService.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    // Admin email cannot be registered as a normal user.
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (adminEmail && normalizedEmail === adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'This email is reserved for the administrator.'
      });
    }

    const existingUser = await dbService.findUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await dbService.createUser({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      rewardPoints: 10
    });

    const otpCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await dbService.saveOTP(normalizedEmail, otpCode, 15);
    await sendOTPEmail(normalizedEmail, otpCode);

    await dbService.createActivityLog({
      user: user._id,
      action: 'USER_REGISTERED',
      details: `New user registration for ${normalizedEmail}`,
      ip: req.ip
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Verification OTP sent to your email.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        rewardPoints: user.rewardPoints
      },
      // Kept to preserve your existing development/testing behavior.
      devOtp: otpCode
    });
  } catch (error) {
    console.error('Register error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.'
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    let user = await dbService.findUserByEmail(email);

    // Admin credentials are read only from the backend environment.
    if (adminEmail && email === adminEmail) {
      if (!adminPassword || password !== adminPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (user?.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended by an administrator.'
        });
      }

      if (!user) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        user = await dbService.createUser({
          name: process.env.ADMIN_NAME || 'Administrator',
          email: adminEmail,
          phone: '',
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
          rewardPoints: 0,
          isBlocked: false
        });
      } else if (user.role !== 'admin' || !user.isVerified) {
        user = await dbService.updateUser(user._id, {
          role: 'admin',
          isVerified: true
        });
      }

      if (!user) {
        return res.status(500).json({
          success: false,
          message: 'Unable to load administrator account.'
        });
      }
    } else {
      // An old database admin account cannot log in as a normal user.
      if (!user || user.role === 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: 'Your account has been suspended by an administrator.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }
    }

    const token = generateToken(user._id, user.role);

    await dbService.createActivityLog({
      user: user._id,
      action: 'USER_LOGIN',
      details: `Successful login for ${email}`,
      ip: req.ip
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        profileImage: user.profileImage,
        rewardPoints: user.rewardPoints
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const email = req.body.email || req.user?.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const otpCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await dbService.saveOTP(normalizedEmail, otpCode, 15);
    await sendOTPEmail(normalizedEmail, otpCode);

    return res.json({
      success: true,
      message: `OTP sent to ${normalizedEmail}`,
      devOtp: otpCode
    });
  } catch (error) {
    console.error('Send OTP error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP.'
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, code } = req.body;
    const targetEmail = (email || req.user?.email)?.trim().toLowerCase();

    if (!targetEmail || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP code are required.'
      });
    }

    const isValid = await dbService.verifyOTP(targetEmail, code);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code.'
      });
    }

    const user = await dbService.findUserByEmail(targetEmail);

    if (user) {
      await dbService.updateUser(user._id, { isVerified: true });
    }

    return res.json({
      success: true,
      message: 'Email address successfully verified!'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to verify OTP.'
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your account email.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await dbService.findUserByEmail(normalizedEmail);

    // Do not reveal whether the account exists.
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists, a reset code was sent.'
      });
    }

    const otpCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await dbService.saveOTP(normalizedEmail, otpCode, 15);
    await sendOTPEmail(normalizedEmail, otpCode);

    return res.json({
      success: true,
      message: 'Password reset code sent to your email.',
      devOtp: otpCode
    });
  } catch (error) {
    console.error('Forgot password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error processing password reset request.'
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP code, and new password.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Do not allow password reset to change the .env admin password.
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (adminEmail && normalizedEmail === adminEmail) {
      return res.status(403).json({
        success: false,
        message: 'Administrator password must be changed in the backend environment.'
      });
    }

    const isValid = await dbService.verifyOTP(normalizedEmail, code);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP code.'
      });
    }

    const user = await dbService.findUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await dbService.updateUser(user._id, {
      password: hashedPassword
    });

    return res.json({
      success: true,
      message: 'Password has been successfully reset! You can now log in.'
    });
  } catch (error) {
    console.error('Reset password error:', error);

    return res.status(500).json({
      success: false,
      message: 'Error resetting password.'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await dbService.findUserById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Get profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;

    const updated = await dbService.updateUser(req.user._id, {
      ...(name ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(profileImage ? { profileImage } : {})
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated
    });
  } catch (error) {
    console.error('Update profile error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.'
    });
  }
};
