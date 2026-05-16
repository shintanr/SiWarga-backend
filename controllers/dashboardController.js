import * as Dashboard from '../models/dashboardModel.js';

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await Dashboard.getDashboardStats();
        res.status(200).json({
            success: true,
            message: 'Berhasil mengambil data statistik dashboard',
            data: stats,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data statistik dashboard',
            data: null,
        });
    }
}