require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Service = require('./models/Service');
const connectDB = require('./config/db');

const seedData = async () => {
    try {
        await connectDB();

        console.log('Cleaning up existing data...');
        // Clear existing data to be idempotent (or at least avoid duplicates if we want)
        // However, to be safe, let's just delete everything for a clean seed
        await Service.deleteMany({});
        await User.deleteMany({ email: 'admin@venturemond.com' }); // Only delete the admin we are about to create, or delete all users? Request says "Delete existing duplicates".

        // Actually, "Delete existing duplicates" suggests we might just want to ensure clean state.
        // Let's clear Services completely as they are static data here.
        // users: let's clear the specific admin user to re-create it.

        console.log('Seeding Services...');
        const services = [
            // Studio Services
            {
                title: 'Basic MVP',
                description: 'Essential MVP development package.',
                price: { usd: 15000, inr: 1250000, period: 'one-time' },
                features: ['Product strategy & roadmap', 'UI/UX design', 'Full-stack development', 'Cloud deployment', '3 months support'],
                badge: 'Popular',
                category: 'studio',
                tier: 'Tier 1'
            },
            {
                title: 'Pro MVP',
                description: 'Advanced MVP with scalable architecture.',
                price: { usd: 25000, inr: 2100000, period: 'one-time' },
                features: ['Everything in Basic', 'Advanced Interactions', 'Scalable Architecture', 'Admin Dashboard', '6 months support'],
                badge: null,
                category: 'studio',
                tier: 'Tier 2'
            },
            {
                title: 'Enterprise MVP',
                description: 'Full-scale enterprise solution.',
                price: { usd: 40000, inr: 3350000, period: 'one-time' },
                features: ['Everything in Pro', 'Microservices', 'Multi-tenant setup', 'High availability', '12 months support'],
                badge: null,
                category: 'studio',
                tier: 'Tier 3'
            },
            {
                title: 'Tech Strategy',
                description: 'Deep dive technology assessment.',
                price: { usd: 3500, inr: 290000, period: 'per engagement' },
                features: ['Technology audit', 'Architecture review', 'Scalability planning', 'Security assessment', 'Recommendations report'],
                category: 'studio'
            },
            {
                title: 'Product Roadmap',
                description: 'Strategic product planning.',
                price: { usd: 2500, inr: 210000, period: 'per project' },
                features: ['Feature discovery', 'User story mapping', 'Priority matrix', 'Timeline estimation', 'Resource planning'],
                category: 'studio'
            },
            {
                title: 'Growth & GTM',
                description: 'Go-to-market and growth strategy.',
                price: { usd: 4000, inr: 335000, period: 'monthly' },
                features: ['Market analysis', 'Growth strategy', 'Marketing automation', 'Analytics setup', 'Monthly reporting'],
                category: 'studio'
            },

            // Workspace Plans
            {
                title: 'Starter',
                description: 'Essential tools for small teams.',
                price: { usd: 15, inr: 1200, period: 'user/month' },
                features: ['File storage (100GB)', 'Task management', 'Basic Access controls', 'Standard Integrations'],
                category: 'plan',
                badge: null
            },
            {
                title: 'Pro',
                description: 'Advanced tools for growing teams.',
                price: { usd: 30, inr: 2500, period: 'user/month' },
                features: ['File storage (1TB)', 'Advanced Task management', 'Granular Access controls', 'Premium Integrations', 'Priority Support'],
                category: 'plan',
                badge: 'Best Value'
            },

            // Add-ons
            {
                title: 'Priority Support',
                description: '24/7 dedicated support.',
                price: { usd: 100, inr: 8000, period: 'month' },
                features: ['24/7 Response', 'Dedicated Slack Channel'],
                category: 'addon'
            },
            {
                title: 'SSO Setup',
                description: 'Enterprise identity integration.',
                price: { usd: 300, inr: 25000, period: 'one-time' },
                features: ['SAML/OIDC Integration', 'Identity Provider Setup'],
                category: 'addon'
            },
            {
                title: 'White-label Branding',
                description: 'Custom branding for your dashboard.',
                price: { usd: 500, inr: 40000, period: 'one-time' },
                features: ['Custom Domain', 'Custom Email', 'Brand Colors/Logo'],
                category: 'addon'
            },
            {
                title: 'Dedicated Instance',
                description: 'Fully isolated infrastructure.',
                price: { usd: 1800, inr: 150000, period: 'month' },
                features: ['Isolated Environment', 'Custom VPC', 'VPN Access'],
                category: 'addon'
            }
        ];

        await Service.insertMany(services);

        console.log('Seeding Admin User...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('Admin@123', salt);

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@venturemond.com',
            passwordHash: passwordHash,
            role: 'admin',
        });

        await adminUser.save();

        console.log('Seed completed');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
