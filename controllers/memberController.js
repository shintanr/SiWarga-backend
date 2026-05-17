import * as Member from '../models/memberModel.js';
import * as Family from '../models/familyModel.js';

// Get semua anggota
export const getAllMembers = async (req, res) => {
  try {
    const search = req.query.search || '';

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Number(req.query.limit) || 10;

    const sortBy = req.query.sortBy || 'created_at';
    const order = (req.query.order || 'desc').toLowerCase();

    const allowedLimits = [10, 25, 50, 100];

    if (!allowedLimits.includes(limit)) {
      return res.status(400).json({
        success: false,
        message: `Limit harus salah satu dari ${allowedLimits.join(', ')}`,
        data: null,
      });
    }

    const result = await Member.getAllMembers(
      search,
      page,
      limit,
      sortBy,
      order,
    );

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data semua warga',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data semua warga',
      data: null,
    });
  }
};

// Get Semua anggota by Family_id
export const getMembersByFamilyId = async (req, res) => {
  try {
    const familyId = req.params.familyId;

    const family = await Family.getFamilyById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Data keluarga tidak ditemukan',
        data: null,
      });
    }

    const members = await Member.getMembersByFamilyId(familyId);

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data anggota keluarga',
      data: members,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data anggota keluarga',
      data: null,
    });
  }
};

// Get satu member by id
export const getMemberById = async (req, res) => {
  try {
    const memberId = req.params.id;

    const member = await Member.getMemberById(memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Data anggota keluarga tidak ditemukan',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data anggota keluarga',
      data: member,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data anggota',
      data: null,
    });
  }
};

// create member baru
export const createMember = async (req, res) => {
  try {
    const familyId = req.params.familyId;

    // cek ada ngga keluarga deengan id itu
    const family = await Family.getFamilyById(familyId);

    if (!family.id) {
      return res.status(404).json({
        success: false,
        message: 'Data keluarga tidak ditemukan',
        data: null,
      });
    }

    // cek apakah sudah ada kepala keluarganya
    if (req.body.hubungan === 'Kepala Keluarga') {
      const existingMembers =
        await Member.getMembersByFamilyId(familyId);

      const alreadyHasKepalaKeluarga = existingMembers.some(
        (m) => m.hubungan === 'Kepala Keluarga',
      );

      if (alreadyHasKepalaKeluarga) {
        return res.status(400).json({
          success: false,
          message: 'Keluarga sudah memiliki Kepala Keluarga',
          data: null,
        });
      }
    }

    const insertId = await Member.createMember(familyId, req.body);
    res.status(201).json({
      success: true,
      message: 'Berhasil membuat anggota keluarga baru',
      data: { id: insertId },
    });
  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'NIK sudah terdaftar',
        data: null,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal membuat anggota keluarga baru',
      data: null,
    });
  }
};

// update member by id
export const updateMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    // cek dulu apakah membernya ada
    const existingMember = await Member.getMemberById(memberId);
    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: 'Data anggota keluarga tidak ditemukan',
        data: null,
      });
    }

    await Member.updateMember(memberId, req.body);

    const updatedMember = await Member.getMemberById(memberId);

    res.status(200).json({
      success: true,
      message: 'Berhasil memperbarui data anggota keluarga',
      data: updatedMember,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'NIK sudah terdaftar',
        data: null,
      });
    }
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data anggota keluarga',
      data: null,
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;

    // cek dulu apakah member ada
    const existingMember = await Member.getMemberById(memberId);
    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: 'Data anggota keluarga tidak ditemukan',
        data: null,
      });
    }

    await Member.deleteMember(memberId);

    res.status(200).json({
      success: true,
      message: 'Berhasil menghapus data anggota keluarga',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data anggota keluarga',
      data: null,
    });
  }
};
