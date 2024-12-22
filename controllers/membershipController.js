const MembershipService = require('../services/MembershipService.js');

const MembershipController = {

    renderMembershipsPage: async (req, res) => {
        try {
            const memberships = await MembershipService.getAllMemberships();
            memberships.forEach(membership => {
                membership.descriptionList = membership.description.split('.');
            });
            res.render('memberships', { memberships });
        } catch (err) {
            console.error(err);
            res.status(500).send('Помилка серверу при отриманні абонементів');
        }
    },

    createMembership: async (req, res) => {
        try {
            const membershipData = req.body;
            await MembershipService.createMembership(membershipData);
            res.status(200).json({success: true});
        } catch (err) {
            console.error('Помилка створення абонемента:', err);
            res.status(400).json({success: false, message: err.message});
        }
    },

    deleteMembership: async (req, res) => {
        try {
            const { id } = req.params;
            const hasActiveMemberships = await MembershipService.checkActiveMemberships(id);
            if (hasActiveMemberships) {
                return res.status(400).json({
                    success: false,
                    message: 'Цей абонемент не можна видалити, оскільки він використовується користувачами.'
                });
            }
            await MembershipService.deleteMembership(id);
            res.json({ success: true, message: 'Абонемент успішно видалено.' });
        } catch (error) {
            console.error('Помилка видалення абонемента:', error);
            res.status(500).json({ success: false, message: 'Не вдалося видалити абонемент.' });
        }
    },

    renderCreateMembershipPage: async (req, res) => {
        try {
            res.render('admin/create/create-membership');
        } catch (err) {
            console.error('Помилка відкриття форми створення абрнемента:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    renderEditMembershipPage: async (req, res) => {
        const membershipId = req.params.id;

        try {
            const membership = await MembershipService.getMembershipById(membershipId);
            res.render('admin/edit/edit-membership', { membership });
        } catch (err) {
            console.error('Помилка відкриття сторінки деталей абонемента:', err);
            res.status(500).send('Помилка сервера');
        }
    },

    updateMembership: async (req, res) => {
        const membershipId = req.params.id;
        const updatedData = req.body;
        try {
            await MembershipService.updateMembership(membershipId, updatedData);
            res.status(200).json({ success: true });
        } catch (err) {
            console.error('Помилка оновлення даних рограми:', err);
            res.status(400).json({ success: false, message: err.message });
        }
    },
};

module.exports = MembershipController;