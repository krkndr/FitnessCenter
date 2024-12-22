const UserService = require("../services/userService");
const { formatToDDMMYYYY } = require('../utils/dateFormatter');
const MembershipService = require('../services/MembershipService');

const DashboardController = {
    renderDashboard: async (req, res) => {
        try {
            const userId = req.session.user?.id;
            const user = await UserService.getUserById(userId);
            const membership = await UserService.getUserMembership(userId);

            if (membership && membership.end_date) {
                membership.end_date = formatToDDMMYYYY(membership.end_date);
            }
            const memberships = await MembershipService.getAllMemberships();
            const SingleUser = user[0];
            res.render('dashboard/dashboard', { user: SingleUser, membership, memberships});
        } catch (err) {
            console.error('Помилка при завантаженні даних для dashboard:', err);
            res.status(500).send('Помилка сервера');
        }
    }
};

module.exports = DashboardController;
