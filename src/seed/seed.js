import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import config from '../config/config.js';
import categoryModel from '../models/category.model.js';
import productModel from '../models/product.model.js';
import userModel from '../models/user.model.js';
import cartModel from '../models/cart.model.js';

dotenv.config();

const sampleReviews = [
    {
        name: 'Samantha D.',
        rating: 5,
        comment: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As an apparel enthusiast, I value high quality and this definitely exceeded my expectations.",
        verified: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        name: 'Alex M.',
        rating: 4,
        comment: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
        verified: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
        name: 'Ethan R.',
        rating: 5,
        comment: "This t-shirt is a must-have for anyone who appreciates good design. The minimalist yet stylish pattern caught my eye immediately, and the fit is perfect.",
        verified: true,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
    {
        name: 'Olivia P.',
        rating: 4,
        comment: "As a web developer always on the lookout for stylish fashion pieces, I'm thrilled to have stumbled upon this shirt. It's clean, lightweight, and durable.",
        verified: true,
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    },
    {
        name: 'Liam K.',
        rating: 5,
        comment: "This is one of my favorite purchases. It fits true to size, pairs well with both casual jeans and tailored pants, and holds up well after multiple washes.",
        verified: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
        name: 'Ava H.',
        rating: 4,
        comment: "I'm not usually one to write reviews, but this product deserves it. Soft cotton blend, great silhouette, and prompt delivery.",
        verified: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    }
];

const standardColors = [
    { name: 'Brown', hex: '#4F4631' },
    { name: 'Forest Green', hex: '#314F4A' },
    { name: 'Navy Blue', hex: '#31344F' },
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' }
];

const standardSizes = [
    { size: 'Small', quantity: 6 },
    { size: 'Medium', quantity: 10 },
    { size: 'Large', quantity: 10 },
    { size: 'X-Large', quantity: 6 }
];

const seed = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing collections
        await categoryModel.deleteMany({});
        await productModel.deleteMany({});
        await userModel.deleteMany({});
        await cartModel.deleteMany({});

        // Seed default users
        const adminHashedPassword = await bcrypt.hash('admin123', 10);
        const customerHashedPassword = await bcrypt.hash('password123', 10);

        const adminUser = await userModel.create({
            username: 'admin',
            email: 'admin@example.com',
            password: adminHashedPassword,
            role: 'admin',
            phone: '+1 555-0199',
            address: '100 Admin Plaza, San Francisco, CA'
        });
        await cartModel.create({ user: adminUser._id, items: [] });

        const customerUser = await userModel.create({
            username: 'ankit',
            email: 'ankit@example.com',
            password: customerHashedPassword,
            role: 'user',
            phone: '+1 555-0144',
            address: '456 Fashion Avenue, New York, NY 10001'
        });
        await cartModel.create({ user: customerUser._id, items: [] });

        console.log('Users seeded: admin@example.com (admin123) and ankit@example.com (password123)');

        // Seed Categories
        const categories = await categoryModel.insertMany([
            { name: 'T-Shirts', description: 'Comfortable everyday graphic & plain t-shirts' },
            { name: 'Shirts', description: 'Smart casual, formal & checkered shirts' },
            { name: 'Jeans', description: 'Modern fit skinny & regular denim' },
            { name: 'Shorts', description: 'Casual & Bermuda shorts for warm weather' },
            { name: 'Outerwear', description: 'Layering pieces, jackets & outerwear' },
        ]);

        const catMap = Object.fromEntries(categories.map((c) => [c.name, c._id]));

        // Seed Products with exact Figma items
        const products = [
            // New Arrivals
            {
                name: 'T-shirt with Tape Details',
                description: 'A stylish everyday crewneck tee with modern woven tape details down the shoulders for a refined athletic look.',
                price: 120,
                originalPrice: null,
                discount: 0,
                rating: 4.5,
                reviewsCount: 85,
                thumbnailImage: '/images/products/arrival1.png',
                galleryImages: [
                    '/images/products/arrival1.png',
                    '/images/products/arrival4.png',
                    '/images/products/image 8.png'
                ],
                category: catMap['T-Shirts'],
                style: 'Casual',
                colors: standardColors,
                quantity: 25,
                variants: standardSizes,
                reviews: sampleReviews.slice(0, 4),
                status: 'active'
            },
            {
                name: 'Skinny Fit Jeans',
                description: 'Expertly tailored skinny fit jeans featuring high-stretch denim for all-day comfort and timeless edge.',
                price: 240,
                originalPrice: 260,
                discount: 20,
                rating: 4.5,
                reviewsCount: 120,
                thumbnailImage: '/images/products/arrival2.png',
                galleryImages: [
                    '/images/products/arrival2.png',
                    '/images/products/product4.png'
                ],
                category: catMap['Jeans'],
                style: 'Casual',
                colors: [
                    { name: 'Deep Blue', hex: '#1C2833' },
                    { name: 'Classic Indigo', hex: '#2C3E50' },
                    { name: 'Faded Black', hex: '#17202A' }
                ],
                quantity: 30,
                variants: [
                    { size: '28', quantity: 5 },
                    { size: '30', quantity: 10 },
                    { size: '32', quantity: 10 },
                    { size: '34', quantity: 5 }
                ],
                reviews: sampleReviews.slice(1, 5),
                status: 'active'
            },
            {
                name: 'Checkered Shirt',
                description: 'Classic gingham checkered button-up shirt made from 100% breathable cotton, perfect for casual outings or smart layering.',
                price: 180,
                originalPrice: null,
                discount: 0,
                rating: 4.5,
                reviewsCount: 42,
                thumbnailImage: '/images/products/Arrival3.png',
                galleryImages: [
                    '/images/products/Arrival3.png',
                    '/images/products/product1.png'
                ],
                category: catMap['Shirts'],
                style: 'Formal',
                colors: [
                    { name: 'Red Plaid', hex: '#922B21' },
                    { name: 'Navy Plaid', hex: '#1A5276' }
                ],
                quantity: 20,
                variants: standardSizes,
                reviews: sampleReviews.slice(2, 6),
                status: 'active'
            },
            {
                name: 'Sleeve Striped T-shirt',
                description: 'Retro-inspired short-sleeve tee featuring contrasting sleeve stripes and ribbed crew collar. Premium lightweight organic cotton.',
                price: 130,
                originalPrice: 160,
                discount: 30,
                rating: 4.5,
                reviewsCount: 64,
                thumbnailImage: '/images/products/arrival4.png',
                galleryImages: [
                    '/images/products/arrival4.png',
                    '/images/products/arrival1.png'
                ],
                category: catMap['T-Shirts'],
                style: 'Casual',
                colors: standardColors,
                quantity: 15,
                variants: standardSizes,
                reviews: sampleReviews.slice(0, 3),
                status: 'active'
            },

            // Top Selling
            {
                name: 'Vertical Striped Shirt',
                description: 'Effortlessly polished vertical striped button-down shirt designed with a relaxed modern silhouette and pointed collar.',
                price: 212,
                originalPrice: 232,
                discount: 20,
                rating: 5.0,
                reviewsCount: 135,
                thumbnailImage: '/images/products/product1.png',
                galleryImages: [
                    '/images/products/product1.png',
                    '/images/products/Arrival3.png'
                ],
                category: catMap['Shirts'],
                style: 'Formal',
                colors: [
                    { name: 'Sage Striped', hex: '#566573' },
                    { name: 'Sky Striped', hex: '#5DADE2' }
                ],
                quantity: 18,
                variants: standardSizes,
                reviews: sampleReviews,
                status: 'active'
            },
            {
                name: 'Courage Graphic T-shirt',
                description: 'Bold slogan graphic t-shirt crafted with an oversized silhouette and drop shoulders for street-ready style.',
                price: 145,
                originalPrice: null,
                discount: 0,
                rating: 4.0,
                reviewsCount: 78,
                thumbnailImage: '/images/products/product2.png',
                galleryImages: [
                    '/images/products/product2.png',
                    '/images/products/image 8.png'
                ],
                category: catMap['T-Shirts'],
                style: 'Casual',
                colors: standardColors,
                quantity: 22,
                variants: standardSizes,
                reviews: sampleReviews.slice(1, 4),
                status: 'active'
            },
            {
                name: 'Loose Fit Bermuda Shorts',
                description: 'Relaxed-fit twill shorts cut to sit comfortably above the knee, featuring deep slash pockets and clean back welt pockets.',
                price: 80,
                originalPrice: null,
                discount: 0,
                rating: 3.5,
                reviewsCount: 30,
                thumbnailImage: '/images/products/product3.png',
                galleryImages: [
                    '/images/products/product3.png'
                ],
                category: catMap['Shorts'],
                style: 'Casual',
                colors: [
                    { name: 'Stone Denim', hex: '#5499C7' },
                    { name: 'Khaki', hex: '#D4AC0D' },
                    { name: 'Black', hex: '#1C1C1C' }
                ],
                quantity: 12,
                variants: [
                    { size: 'Small', quantity: 3 },
                    { size: 'Medium', quantity: 5 },
                    { size: 'Large', quantity: 4 }
                ],
                reviews: sampleReviews.slice(2, 5),
                status: 'active'
            },
            {
                name: 'Faded Skinny Jeans',
                description: 'Vintage-washed denim jeans with subtle whiskering at the hips and clean taper from knee to hem. (Low Stock: only 4 left!)',
                price: 210,
                originalPrice: null,
                discount: 0,
                rating: 4.5,
                reviewsCount: 95,
                thumbnailImage: '/images/products/product4.png',
                galleryImages: [
                    '/images/products/product4.png',
                    '/images/products/arrival2.png'
                ],
                category: catMap['Jeans'],
                style: 'Casual',
                colors: [
                    { name: 'Washed Grey', hex: '#424949' },
                    { name: 'Dark Indigo', hex: '#1B2631' }
                ],
                quantity: 4, // Low stock <= 5
                variants: [
                    { size: '30', quantity: 2 },
                    { size: '32', quantity: 2 }
                ],
                reviews: sampleReviews.slice(0, 4),
                status: 'active'
            },

            // You Might Also Like & Other Styles
            {
                name: 'One Life Graphic T-shirt',
                description: 'The iconic signature SHOP.CO statement tee. Made from heavyweight 240 GSM organic combed cotton with custom typographic chest graphic.',
                price: 260,
                originalPrice: 300,
                discount: 40,
                rating: 4.5,
                reviewsCount: 450,
                thumbnailImage: '/images/products/Rectangle 2.png',
                galleryImages: [
                    '/images/products/Rectangle 2.png',
                    '/images/products/arrival1.png',
                    '/images/products/arrival4.png'
                ],
                category: catMap['T-Shirts'],
                style: 'Casual',
                colors: [
                    { name: 'Olive Green', hex: '#4F4631' },
                    { name: 'Forest', hex: '#314F4A' },
                    { name: 'Midnight', hex: '#31344F' }
                ],
                quantity: 16,
                variants: standardSizes,
                reviews: sampleReviews,
                status: 'active'
            },
            {
                name: 'Polo with Contrast Trims',
                description: 'Sharp pique polo shirt with fine contrast stripes across the ribbed collar and sleeve cuffs. Elevated resort styling for party or brunch.',
                price: 212,
                originalPrice: 242,
                discount: 20,
                rating: 4.5,
                reviewsCount: 55,
                thumbnailImage: '/images/products/image 7.png',
                galleryImages: [
                    '/images/products/image 7.png',
                    '/images/products/image 9.png'
                ],
                category: catMap['Shirts'],
                style: 'Party',
                colors: [
                    { name: 'Royal Blue', hex: '#2471A3' },
                    { name: 'Crisp White', hex: '#FDFEFE' }
                ],
                quantity: 14,
                variants: standardSizes,
                reviews: sampleReviews.slice(1, 5),
                status: 'active'
            },
            {
                name: 'Gradient Graphic T-shirt',
                description: 'Modern artistic gradient artwork printed across ultra-soft combed cotton. Engineered for contemporary casual street styling.',
                price: 145,
                originalPrice: null,
                discount: 0,
                rating: 4.0,
                reviewsCount: 68,
                thumbnailImage: '/images/products/image 8.png',
                galleryImages: [
                    '/images/products/image 8.png',
                    '/images/products/product2.png'
                ],
                category: catMap['T-Shirts'],
                style: 'Casual',
                colors: standardColors,
                quantity: 28,
                variants: standardSizes,
                reviews: sampleReviews.slice(0, 3),
                status: 'active'
            },
            {
                name: 'Polo with Tipping Details',
                description: 'Tailored slim-fit pique polo with two-button placket and understated tipping on collar. (Low Stock: only 3 left!)',
                price: 180,
                originalPrice: null,
                discount: 0,
                rating: 4.5,
                reviewsCount: 90,
                thumbnailImage: '/images/products/image 9.png',
                galleryImages: [
                    '/images/products/image 9.png',
                    '/images/products/image 7.png'
                ],
                category: catMap['Shirts'],
                style: 'Party',
                colors: [
                    { name: 'Burgundy', hex: '#78281F' },
                    { name: 'Black', hex: '#17202A' }
                ],
                quantity: 3, // Low stock <= 5
                variants: [
                    { size: 'Medium', quantity: 2 },
                    { size: 'Large', quantity: 1 }
                ],
                reviews: sampleReviews.slice(2, 6),
                status: 'active'
            },
            {
                name: 'Black Striped T-shirt',
                description: 'Sporty horizontal striped athletic tee with moisture-wicking weave and split hem. (Currently OUT OF STOCK for testing!)',
                price: 120,
                originalPrice: 150,
                discount: 30,
                rating: 5.0,
                reviewsCount: 110,
                thumbnailImage: '/images/products/image 10.png',
                galleryImages: [
                    '/images/products/image 10.png'
                ],
                category: catMap['T-Shirts'],
                style: 'Gym',
                colors: [
                    { name: 'Monochrome Black', hex: '#1B1C1D' },
                    { name: 'Grey Marl', hex: '#7B7D7D' }
                ],
                quantity: 0, // Out of stock!
                variants: [
                    { size: 'Small', quantity: 0 },
                    { size: 'Medium', quantity: 0 },
                    { size: 'Large', quantity: 0 }
                ],
                reviews: sampleReviews.slice(0, 4),
                status: 'active'
            },
            {
                name: 'Classic Bomber Jacket',
                description: 'Sleek satin-finish bomber jacket featuring heavy-duty zip hardware, ribbed trims, and warm diamond-quilted lining.',
                price: 320,
                originalPrice: null,
                discount: 0,
                rating: 4.8,
                reviewsCount: 34,
                thumbnailImage: '/images/products/image 13.png',
                galleryImages: [
                    '/images/products/image 13.png',
                    '/images/products/image 12.png'
                ],
                category: catMap['Outerwear'],
                style: 'Party',
                colors: [
                    { name: 'Olive Green', hex: '#4A5B43' },
                    { name: 'Jet Black', hex: '#111111' }
                ],
                quantity: 8,
                variants: standardSizes,
                reviews: sampleReviews.slice(1, 4),
                status: 'active'
            },
            {
                name: 'Athletic Gym Performance Tee',
                description: 'Lightweight four-way stretch athletic t-shirt with targeted ventilation panels to keep you dry and comfortable through high-intensity workouts. (Low Stock: only 2 left!)',
                price: 95,
                originalPrice: null,
                discount: 0,
                rating: 4.6,
                reviewsCount: 45,
                thumbnailImage: '/images/products/image 14.png',
                galleryImages: [
                    '/images/products/image 14.png'
                ],
                category: catMap['T-Shirts'],
                style: 'Gym',
                colors: [
                    { name: 'Charcoal', hex: '#2C3E50' },
                    { name: 'Slate Blue', hex: '#2980B9' }
                ],
                quantity: 2, // Low stock <= 5
                variants: [
                    { size: 'Medium', quantity: 1 },
                    { size: 'Large', quantity: 1 }
                ],
                reviews: sampleReviews.slice(2, 5),
                status: 'active'
            }
        ];

        await productModel.insertMany(products);

        console.log(`Successfully seeded ${products.length} products and ${categories.length} categories!`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seed();
