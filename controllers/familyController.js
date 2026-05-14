import * as Family from '../models/familyModel.js';

// GET semua keluarga
export const getAllFamilies = async (req, res) => {
  try {
    const families = await Family.getAllFamilies();

    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data keluarga',
      data: families,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data keluarga',
      data: null,
    });
  }
};

//GET keluarga dari ID
export const getFamilyById = async (req, res) => {
  const { id } = req.params;

  try {
    const family = await Family.getFamilyById(id);

    if (!family) {
      return res.status(404).json({
        message: 'Data Keluarga tidak ditemukan',
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data keluarga',
      data: family,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data keluarga',
      data: null,
    });
  }
};

export const createFamily = async (req, res) => {
  try {
    const familyData = req.body;

    const insertId = await Family.createFamily(familyData);

    res.status(201).json({
      message: 'Data keluarga berhasil ditambahkan',
      data: { id: insertId },
    });
  } catch (error) {
    console.error(error);
    // handle duplicate no_kk
    if (error.code === 'ER_DUP_ENTRY') {
      return res
        .status(400)
        .json({ message: 'No KK sudah terdaftar' });
    }
    res.status(500).json({
      message: 'Gagal menambahkan data keluarga',
      error: error.message,
    });
  }
};

export const updateFamily = async (req, res) => {
  try {
    const familyId = req.params.id;
    const familyData = req.body;

    // cek dulu apakah data ada
    const existingFamily = await Family.getFamilyById(familyId);

    if (!existingFamily) {
      return res.status(404).json({
        success: false,
        message: 'Data keluarga tidak ditemukan',
        data: null,
      });
    }

    await Family.updateFamily(familyId, familyData);

    const updatedFamily = await Family.getFamilyById(familyId);

    res.status(200).json({
      success: true,
      message: 'Data keluarga berhasil diupdate',
      data: updatedFamily,
    });
  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'No KK sudah terdaftar',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Gagal mengupdate data keluarga',
      data: null,
    });
  }
};

export const deleteFamily = async (req, res) => {
  try {
    const familyId = req.params.id;

    const existingFamily = await Family.getFamilyById(familyId);

    if (!existingFamily) {
      return res.status(404).json({
        success: false,
        message: 'Data keluarga tidak ditemukan',
      });
    }
    await Family.deleteFamily(familyId);

    res.status(200).json({
      success: true,
      message: 'Data keluarga berhasil dihapus',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data keluarga',
    });
  }
};
