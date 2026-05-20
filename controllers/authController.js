import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/userModel.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nama, email, dan password wajib diisi',
        data: null,
      });
    }

    const existingUser = await User.findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar',
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.createUser({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: { id: userId },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Gagal registrasi',
      data: null,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi',
        data: null,
      });
    }

    const user = await User.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah',
        data: null,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Gagal login',
      data: null,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id);

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data user',
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data user',
      data: null,
    });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout berhasil',
    data: null,
  });
};