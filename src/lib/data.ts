export interface Product {
    id: string;
    title: string;
    category: string; // 'presets', 'ae-plugins', 'premiere-plugins'
    price: number;
    description: string;
    image: string;
    features: string[];
}

export const PRODUCTS: Product[] = [
    {
        id: '1',
        title: 'Cinematic Luts Vol. 1',
        category: 'presets',
        price: 29.99,
        description: 'Transform your footage with these Hollywood-grade color grading presets. Compatible with Premiere Pro, DaVinci Resolve, and FCPX.',
        image: 'https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&q=80',
        features: ['20 Cinematic LUTs', '.CUBE format', ' detailed installation guide', '24/7 Support']
    },
    {
        id: '2',
        title: 'Glitch Transitions Pack',
        category: 'premiere-plugins',
        price: 49.99,
        description: 'Add energy to your edits with 50+ drag-and-drop glitch transitions. No keyframes needed.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
        features: ['50+ Transitions', 'Sound Effects Included', 'Drag & Drop', '4K Ready']
    },
    {
        id: '3',
        title: 'Neon Glow Effects',
        category: 'ae-plugins',
        price: 39.99,
        description: 'Create stunning cyberpunk and sci-fi looks with this easy-to-use glow plugin for After Effects.',
        image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80',
        features: ['Real-time rendering', 'Customizable colors', 'Flicker controls', 'GPU Accelerated']
    },
    {
        id: '4',
        title: 'Vintage Film Grain',
        category: 'presets',
        price: 19.99,
        description: 'Authentic 8mm, 16mm, and 35mm film grain overlays to give your digital footage an analog soul.',
        image: 'https://images.unsplash.com/photo-1595769816263-9b910be24d5f?w=800&q=80',
        features: ['4K Resolution', 'ProRes 422', '10 Grain Styles', 'Overlay Mode Ready']
    },
    {
        id: '5',
        title: 'Text Animation Bundle',
        category: 'ae-plugins',
        price: 59.99,
        description: 'Save hours of work with this massive collection of kinetic typography presets.',
        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
        features: ['100+ Animations', 'Easy Customization', 'Responsive Time', 'In/Out Animations']
    },
    {
        id: '6',
        title: 'Smooth Zoom Transitions',
        category: 'premiere-plugins',
        price: 24.99,
        description: 'The seamless zoom transitions used by top travel vloggers and YouTubers.',
        image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
        features: ['Seamless Motion Blur', 'Target Zoom', 'Rotation Control', 'Works with any FPS']
    }
];
