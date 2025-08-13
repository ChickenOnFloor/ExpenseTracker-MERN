const Expense = require('../models/expense');

exports.addExpense = async (req, res) => {
    const { description, amount, category } = req.body;

    try {
        const expense = await Expense.create({
            user: req.user.id,
            description,
            amount,
            category
        });
        res.status(201).json(expense);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getExpenses = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const total = await Expense.countDocuments({ user: req.user.id });
        const expenses = await Expense.find({ user: req.user.id })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });

        res.json({
            expenses,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        if (expense.user.toString() !== req.user.id) 
            return res.status(401).json({ message: 'Not authorized' });

        await expense.deleteOne();
        res.json({ message: 'Expense removed' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
