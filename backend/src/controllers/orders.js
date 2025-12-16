const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const PaymentAttempt = require('../models/PaymentAttempt');
const Project = require('../models/Project');
const Subscription = require('../models/Subscription');

// Create a new order and generate an invoice
exports.createOrder = async (req, res) => {
    try {
        // 4. Add console logs so dev can see incoming payloads
        if (true) { // Force logging for debug
            console.info("createOrder payload:", JSON.stringify(req.body, null, 2));
            console.info("createOrder user:", req.user);
        }

        const { items, currency, paymentMethod, billingDetails, userId: bodyUserId, metadata } = req.body;

        // 1. Resolve User ID
        // REQUIRE authenticated user
        const userId = req.user ? req.user.id || req.user._id : null;

        if (!userId) {
            return res.status(401).json({ msg: 'Unauthenticated. Please log in.' });
        }

        // Validate Items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ msg: 'Order must contain at least one item' });
        }

        // 2. Idempotency Check (Optional but recommended)
        if (metadata && metadata.clientRequestId) {
            const existingOrder = await Order.findOne({ 'metadata.clientRequestId': metadata.clientRequestId });
            if (existingOrder) {
                const existingInvoice = await Invoice.findById(existingOrder.invoiceId);
                return res.status(200).json({ order: existingOrder, invoice: existingInvoice });
            }
        }

        // 3. Calculate Totals Backend-Side
        let calculatedSubtotal = 0;

        items.forEach(item => {
            const qty = item.quantity || 1;
            calculatedSubtotal += (item.price * qty);
        });

        // Tax Calculation: 18% of subtotal
        const tax = Math.round(calculatedSubtotal * 0.18);
        const calculatedTotal = calculatedSubtotal + tax;

        // 4. Create Order Object
        const newOrder = new Order({
            userId: userId || undefined,
            items,
            subtotal: calculatedSubtotal,
            tax,
            total: calculatedTotal,
            currency: currency || 'INR',
            status: 'pending',
            metadata: { billingDetails, paymentMethod, ...metadata }
        });

        const savedOrder = await newOrder.save();

        // 5. Generate and Link Invoice
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;

        const newInvoice = new Invoice({
            orderId: savedOrder._id,
            invoiceNumber,
            issuedAt: new Date(),
            items,
            subtotal: calculatedSubtotal,
            tax,
            total: calculatedTotal,
            currency: currency || 'INR',
            paid: false
        });

        const savedInvoice = await newInvoice.save();

        // Link invoice back to order
        savedOrder.invoiceId = savedInvoice._id;
        await savedOrder.save();

        // [AUTO] Create Project
        const newProject = new Project({
            userId: userId,
            orderId: savedOrder._id,
            name: items[0].title || `Project #${savedOrder._id.toString().slice(-4)}`,
            description: items[0].period ? `${items[0].period} engagement` : 'New Project',
            status: 'planning'
        });
        await newProject.save();

        // [AUTO] Create Subscription if recurring
        for (const item of items) {
            if (item.period && item.period !== 'one-time') {
                // Determine billing period
                let billingPeriod = 'monthly';
                if (item.period.toLowerCase().includes('year')) billingPeriod = 'yearly';

                // Calc next billing
                const startDate = new Date();
                const nextBilling = new Date(startDate);
                if (billingPeriod === 'monthly') nextBilling.setMonth(nextBilling.getMonth() + 1);
                else nextBilling.setFullYear(nextBilling.getFullYear() + 1);

                const newSub = new Subscription({
                    userId: userId,
                    orderId: savedOrder._id,
                    planName: item.title,
                    status: 'active', // or 'trial'
                    startDate: startDate,
                    nextBillingDate: nextBilling,
                    billingPeriod
                });
                await newSub.save();
            }
        }

        // 6. Return Response
        res.status(201).json({ order: savedOrder, invoice: savedInvoice });
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ msg: 'Server Error: ' + err.message, error: err.message });
    }
};

// GET /api/orders
exports.listOrders = async (req, res) => {
    try {
        const userId = req.user?.id || req.user?._id;

        // If no user, return empty or 401 (depending on strictness, but let's be safe and return empty list or error)
        if (!userId) {
            return res.status(401).json({ msg: 'Unauthenticated' });
        }

        const filter = { userId };

        if (process.env.NODE_ENV !== 'production') {
            console.info(`Listing orders for userId: ${userId} with filter:`, filter);
        }

        const orders = await Order.find(filter).sort({ createdAt: -1 }).populate('invoiceId');
        return res.json({ orders });
    } catch (err) {
        console.error('listOrders error', err);
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// Get a single order by ID
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('invoiceId');

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Optional: Check ownership if not admin
        // if (req.user && order.userId && order.userId.toString() !== req.user._id.toString()) { ... }

        res.json(order);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(500).send('Server Error');
    }
};

// List orders for a user - Keeping specific route if needed, but listOrders handles general case
exports.listOrdersForUser = async (req, res) => {
    try {
        // Determine target User ID: param :userId or authenticated req.user._id
        const targetUserId = req.params.userId || (req.user ? req.user._id : null);

        if (!targetUserId) {
            return res.status(400).json({ msg: 'User ID required' });
        }

        const orders = await Order.find({ userId: targetUserId })
            .sort({ createdAt: -1 })
            .populate('invoiceId'); // Populate invoice for quick list view details

        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Record a payment attempt (provider callback or manual entry)
exports.recordPaymentAttempt = async (req, res) => {
    try {
        const { orderId, provider, providerPaymentId, amount, currency, status, response } = req.body;

        // Create Attempt Record
        const attempt = new PaymentAttempt({
            orderId,
            provider,
            providerPaymentId,
            status, // 'initiated', 'succeeded', 'failed'
            amount,
            currency,
            response
        });

        await attempt.save();

        // If payment succeeded, update Order and Invoice status
        if (status === 'succeeded') {
            const order = await Order.findById(orderId);
            if (order) {
                order.status = 'paid';
                await order.save();

                if (order.invoiceId) {
                    const invoice = await Invoice.findById(order.invoiceId);
                    if (invoice) {
                        invoice.paid = true;
                        invoice.paidAt = new Date();
                        await invoice.save();
                    }
                }
            }
        }

        res.json({ ok: true, attempt });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
