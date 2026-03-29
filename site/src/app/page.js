// src/app/page.jsx
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';

// Dummy Data
const CATEGORIES = [
  { name: "All Products", img: "https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100" },
  { name: "Electronics", img: "https://rukminim1.flixcart.com/flap/128/128/image/69c6589653afdb9a.png?q=100" },
  { name: "Appliances", img: "https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100" },
  { name: "Fashion", img: "https://rukminim1.flixcart.com/flap/128/128/image/82b3ca5fb2301045.png?q=100" },
  { name: "Beauty", img: "https://rukminim1.flixcart.com/flap/128/128/image/dff3f7adcf3a90c6.png?q=100" },
  { name: "Home", img: "https://rukminim1.flixcart.com/flap/128/128/image/ab7e2b022a4587dd.jpg?q=100" },
  { name: "Footwear", img: "https://rukminim1.flixcart.com/flap/128/128/image/71050627a56b4693.png?q=100" }
];

const BANNERS = [
  "https://static.vecteezy.com/system/resources/thumbnails/007/047/807/small/easter-sale-poster-or-banner-template-with-easter-bunny-over-on-product-podium-scene-greetings-and-presents-for-easter-day-promotion-and-shopping-template-for-easter-vector.jpg",
  "https://www.shutterstock.com/image-vector/black-friday-sale-banner-shopping-260nw-2545954505.jpg",
  "https://cdn.vectorstock.com/i/500p/91/98/online-shopping-discount-banner-vector-47519198.jpg"
];

function HomeContent() {
  const searchParams = useSearchParams();
  const urlSearchTerm = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Search & Filter State
  const [localSearchTerm, setLocalSearchTerm] = useState(urlSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sync URL search param to local state
  useEffect(() => {
    setLocalSearchTerm(urlSearchTerm);
  }, [urlSearchTerm]);

  // Fetch API Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        } else {
          throw new Error(json.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Auto-slide Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // FILTER LOGIC
  const filteredProducts = products.filter(product => {
    const searchString = localSearchTerm.toLowerCase();
    const matchesSearch = product.title.toLowerCase().includes(searchString) || 
                          (product.description && product.description.toLowerCase().includes(searchString));
    
    const matchesCategory = selectedCategory && selectedCategory !== 'All Products'
      ? product.category.toLowerCase().includes(selectedCategory.toLowerCase().replace('s', '')) 
      : true;

    return matchesSearch && matchesCategory;
  });

  const isFiltering = localSearchTerm.length > 0 || (selectedCategory !== '' && selectedCategory !== 'All Products');

  const renderProductSlider = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="bg-white shadow-sm mt-4 pb-4">
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-[20px] font-medium text-[#212121]">{title}</h2>
          <button className="bg-[#800000] text-white px-6 py-2 rounded-sm shadow text-[13px] font-medium hover:bg-[#a30000] transition">
            VIEW ALL
          </button>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar pt-2">
          {items.map((product) => (
            <div key={product.id} className="min-w-[200px] sm:min-w-[250px]">
              <ProductCard product={product} />
            </div>
          ))}
          {/* Duplicate for visual length in slider */}
          {items.map((product) => (
            <div key={`dup-${product.id}`} className="min-w-[200px] sm:min-w-[250px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
    </div>
  );

  if (error) return <div className="text-center text-red-500 py-20 font-medium">Failed to load: {error}</div>;

  const mobiles = products.filter(p => p.category.toLowerCase().includes('mobile'));
  const electronics = products.filter(p => p.category.toLowerCase().includes('electronic') || p.category.toLowerCase().includes('headphone'));
  const fashion = products.filter(p => p.category.toLowerCase().includes('fashion') || p.category.toLowerCase().includes('shoe'));

  return (
    <div className="bg-[#f1f3f6] min-h-screen pb-8">
      <div className="flex flex-col w-full max-w-[1600px] mx-auto pt-2 px-2 sm:px-4">
        
        {/* CATEGORY STRIP */}
        <div className="bg-white shadow-sm mb-2 p-4 flex justify-between overflow-x-auto hide-scrollbar md:justify-center gap-6 sm:gap-10 rounded-sm">
          {CATEGORIES.map((cat, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedCategory(cat.name === selectedCategory ? '' : cat.name)}
              className={`flex flex-col items-center gap-2 cursor-pointer group min-w-[64px] p-2 rounded-sm transition ${selectedCategory === cat.name ? 'border-b-2 border-[#800000] bg-red-50/50' : 'border-b-2 border-transparent'}`}
            >
              <img src={cat.img} alt={cat.name} className="w-16 h-16 object-contain group-hover:scale-105 transition-transform" />
              <span className={`text-[14px] font-medium whitespace-nowrap ${selectedCategory === cat.name ? 'text-[#800000]' : 'text-[#212121] group-hover:text-[#800000]'}`}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {isFiltering ? (
          /* GRID LAYOUT (Search / Filter Results View) */
          <div className="flex gap-4 mt-2">
            <div className="hidden md:block w-[280px] shrink-0 bg-white shadow-sm rounded-sm p-4 h-fit sticky top-[70px]">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
                <h2 className="text-[18px] font-medium text-[#212121]">Filters</h2>
                <button onClick={() => { setLocalSearchTerm(''); setSelectedCategory(''); }} className="text-[12px] font-medium text-[#800000] uppercase tracking-wide hover:underline">
                  Clear All
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-[13px] font-medium text-[#212121] uppercase mb-2">Search</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    placeholder="Search within results..." 
                    className="w-full border-b border-gray-300 py-1 text-[14px] outline-none focus:border-[#800000] bg-transparent text-[#212121]"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[13px] font-medium text-[#212121] uppercase mb-3">Categories</h3>
                <div className="flex flex-col gap-3">
                  {CATEGORIES.map(cat => (
                    <label key={cat.name} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedCategory === cat.name}
                        onChange={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                        className="w-4 h-4 accent-[#800000] cursor-pointer" 
                      />
                      <span className={`text-[14px] group-hover:text-[#800000] ${selectedCategory === cat.name ? 'font-medium text-[#800000]' : 'text-[#212121]'}`}>
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white shadow-sm rounded-sm p-4 sm:p-6 min-h-[500px]">
              <div className="border-b border-gray-100 pb-4 mb-6">
                <h1 className="text-[16px] font-medium text-[#212121]">
                  {localSearchTerm ? `Search results for "${localSearchTerm}"` : `${selectedCategory || 'All'} Products`}
                  <span className="text-[#878787] font-normal text-[14px] ml-2">
                    (Showing {filteredProducts.length} items)
                  </span>
                </h1>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="No Results" className="w-[250px] mb-6" />
                  <h2 className="text-[18px] font-medium text-[#212121] mb-2">Sorry, no results found!</h2>
                  <p className="text-[14px] text-[#878787]">Please check the spelling or try searching for something else</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-gray-100">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="border-b border-r border-gray-100 hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.11)] transition-shadow duration-300">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* DASHBOARD LAYOUT (Default Home View) */
          <>
            <div className="w-full relative overflow-hidden bg-white shadow-sm rounded-sm h-[150px] sm:h-[200px] md:h-[270px]">
              <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                {BANNERS.map((banner, index) => (
                  <img key={index} src={banner} alt={`Banner ${index + 1}`} className="w-full h-full object-cover sm:object-fill flex-shrink-0 cursor-pointer" />
                ))}
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {BANNERS.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${currentBanner === index ? 'bg-white' : 'bg-white/50'}`} onClick={() => setCurrentBanner(index)} />
                ))}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mt-4">
              <div className="flex-grow overflow-hidden shadow-sm rounded-sm">
                {renderProductSlider("Best of Electronics", electronics.length > 0 ? electronics : products)}
              </div>
              <div className="hidden lg:block w-[230px] flex-shrink-0 bg-white shadow-sm cursor-pointer p-2 rounded-sm mt-4 lg:mt-0 hover:shadow-md transition">
                <img src="https://img.freepik.com/free-vector/gradient-sale-poster-with-photo_23-2149065321.jpg?semt=ais_incoming&w=740&q=80" alt="Promo" className="w-full h-full object-cover rounded-sm" />
              </div>
            </div>

            {renderProductSlider("Top Deals on Mobiles", mobiles.length > 0 ? mobiles : products)}
            {renderProductSlider("Trending In Fashion", fashion.length > 0 ? fashion : products)}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <img src="https://rukminim2.flixcart.com/fk-p-flap/700/340/image/a63fa259927cbded.png?q=60" alt="Promo 1" className="w-full h-48 object-cover cursor-pointer shadow-sm hover:shadow-md transition rounded-sm" />
              <img src="https://rukminim2.flixcart.com/fk-p-flap/700/340/image/69b208e6abd44683.png?q=60" alt="Promo 2" className="w-full h-48 object-cover cursor-pointer shadow-sm hover:shadow-md transition rounded-sm" />
              <img src="https://rukminim2.flixcart.com/fk-p-flap/700/340/image/bce87b1f863dab9c.png?q=60" alt="Promo 3" className="w-full h-48 object-cover cursor-pointer shadow-sm hover:shadow-md transition rounded-sm" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <Suspense fallback={
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
        </div>
      }>
        <HomeContent />
      </Suspense>
    </>
  );
}