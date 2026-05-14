import * as Family from '../models/familyModel.js';

// GET semua keluarga
export const getAllFamilies = async (req, res) => {
    try {

        const families = await Family.getAllFamilies();

        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data keluarga",
            data: families
        })
    } catch (error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data keluarga",
            data: null
        })
    }
}

//GET keluarga dari ID
export const getFamilyById = async (req, res) => {
    const { id } = req.params;

    try {
        const family = await Family.getFamilyById(id);

        if(!family) { 
            return res.status(404).json({
                message: "Keluarga tidak ditemukan",
                data: null
            })
        }
        res.status(200).json({
            success: true,
            message: "Berhasil mengambil data keluarga",
            data: family
        })
           
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data keluarga",
            data: null
        })
    }
}