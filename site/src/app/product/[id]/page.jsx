// // src/app/product/[id]/page.jsx
// "use client";

// import { useState, useEffect } from 'react';
// import { useParams, useRouter } from 'next/navigation';

// export default function ProductDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { id } = params;

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeImage, setActiveImage] = useState('');
//   const [addingToCart, setAddingToCart] = useState(false);

//   // Fetch product details on load
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`/api/products/${id}`);
//         const json = await res.json();
//         if (json.success) {
//           setProduct(json.data);
//           setActiveImage(json.data.images[0]); // Set first image as default
//         } else {
//           throw new Error(json.error);
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchProduct();
//   }, [id]);

//   // Handle Add to Cart button click
//   const handleAddToCart = async () => {
//     setAddingToCart(true);
//     try {
//       const res = await fetch('/api/cart', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productId: product.id, quantity: 1 }),
//       });
//       const json = await res.json();
      
//       if (json.success) {
//         // Redirect user to cart page after successfully adding
//         router.push('/cart');
//       } else {
//         alert('Failed to add to cart');
//       }
//     } catch (error) {
//       console.error('Error adding to cart:', error);
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[60vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
//       </div>
//     );
//   }

//   if (error || !product) {
//     return <div className="text-center py-20 text-red-500">Error: {error || 'Product not found'}</div>;
//   }

//   // Calculate discount
//   const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

//   return (
//     <div className="flex flex-col md:flex-row gap-4 max-w-[1248px] mx-auto bg-[#f1f3f6] md:bg-transparent pb-10">
      
//       {/* LEFT COLUMN: Images & Action Buttons */}
//       <div className="w-full md:w-[40%] flex flex-col gap-2">
//         <div className="bg-white p-4 border border-gray-200 sticky top-[70px]">
          
//           {/* Image Carousel Area */}
//           <div className="flex gap-4 h-[350px] sm:h-[450px]">
//             {/* Thumbnails (Vertical list) */}
//             <div className="flex flex-col gap-2 overflow-y-auto hide-scrollbar w-[64px]">
//               {product.images.map((img, index) => (
//                 <div 
//                   key={index} 
//                   onMouseEnter={() => setActiveImage(img)}
//                   className={`w-16 h-16 border p-1 cursor-pointer flex items-center justify-center ${activeImage === img ? 'border-[#2874f0]' : 'border-gray-200'}`}
//                 >
//                   <img src={img} alt="thumbnail" className="max-h-full max-w-full object-contain" />
//                 </div>
//               ))}
//             </div>

//             {/* Main Image */}
//             <div className="flex-1 flex items-center justify-center relative border border-gray-100 p-4">
//               <img src={activeImage} alt={product.title} className="max-h-full max-w-full object-contain" />
//             </div>
//           </div>

//           {/* Action Buttons (The classic Flipkart Yellow & Orange) */}
//           <div className="flex gap-2 mt-6">
//             <button 
//               onClick={handleAddToCart}
//               disabled={addingToCart}
//               className="flex-1 bg-[#ff9f00] text-white py-4 px-2 rounded-sm font-semibold text-[16px] shadow flex items-center justify-center gap-2 hover:bg-[#f39800] transition"
//             >
//               <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
//                 <path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" />
//               </svg>
//               {addingToCart ? 'ADDING...' : 'ADD TO CART'}
//             </button>
//             <button className="flex-1 bg-[#fb641b] text-white py-4 px-2 rounded-sm font-semibold text-[16px] shadow flex items-center justify-center gap-2 hover:bg-[#f05c13] transition">
//               <svg width="14" height="18" viewBox="0 0 14 18" fill="white">
//                 <path d="M7 0C3.134 0 0 3.134 0 7c0 5.25 7 11 7 11s7-5.75 7-11c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
//               </svg>
//               BUY NOW
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT COLUMN: Product Details */}
//       <div className="w-full md:w-[60%] bg-white p-4 sm:p-6 border border-gray-200">
        
//         {/* Breadcrumbs */}
//         <div className="text-[12px] text-[#878787] flex gap-2 items-center mb-2">
//           <span>Home</span>
//           <svg width="5" height="8" viewBox="0 0 5 8" fill="none"><path d="M1 1l3 3-3 3" stroke="#878787" strokeLinecap="round"/></svg>
//           <span className="capitalize">{product.category}</span>
//           <svg width="5" height="8" viewBox="0 0 5 8" fill="none"><path d="M1 1l3 3-3 3" stroke="#878787" strokeLinecap="round"/></svg>
//           <span className="truncate w-32">{product.title}</span>
//         </div>

//         {/* Title & Ratings */}
//         <h1 className="text-[18px] text-[#212121] font-medium leading-relaxed">
//           {product.title}
//         </h1>
//         <div className="flex items-center gap-2 mt-2">
//           <div className="bg-[#388e3c] text-white text-[12px] font-bold px-2 py-[2px] rounded-sm flex items-center gap-1">
//             4.4 ★
//           </div>
//           <span className="text-[#878787] text-[14px] font-medium">
//             15,483 Ratings & 1,402 Reviews
//           </span>
//           <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="assured" className="h-5 ml-2" />
//         </div>

//         {/* Pricing */}
//         <div className="mt-4 flex items-end gap-3">
//           <span className="text-[28px] font-medium text-[#212121]">
//             ₹{product.price.toLocaleString('en-IN')}
//           </span>
//           <span className="text-[16px] text-[#878787] line-through mb-1">
//             ₹{product.original_price.toLocaleString('en-IN')}
//           </span>
//           <span className="text-[16px] font-medium text-[#388e3c] mb-1">
//             {discount}% off
//           </span>
//         </div>
//         <p className="text-[14px] font-medium text-[#212121] mt-1">Free Delivery</p>

//         {/* Available Offers */}
//         <div className="mt-6">
//           <h3 className="text-[16px] font-medium text-[#212121] mb-2">Available offers</h3>
//           <ul className="space-y-2 text-[14px] text-[#212121]">
//             <li className="flex gap-2">
//               <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-[2px]" />
//               <span><span className="font-bold">Bank Offer</span> 5% Cashback on Cartify Axis Bank Card <span className="text-[#2874f0] font-medium cursor-pointer">T&C</span></span>
//             </li>
//             <li className="flex gap-2">
//               <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-[2px]" />
//               <span><span className="font-bold">Special Price</span> Get extra 10% off (price inclusive of cashback/coupon) <span className="text-[#2874f0] font-medium cursor-pointer">T&C</span></span>
//             </li>
//           </ul>
//         </div>

//         {/* Description Section */}
//         <div className="border-t border-gray-200 mt-6 pt-6 flex">
//           <div className="w-[110px] text-[#878787] text-[14px]">Description</div>
//           <div className="flex-1 text-[14px] text-[#212121] leading-relaxed">
//             {product.description}
//           </div>
//         </div>
        
//         {/* Specifications/Highlights */}
//         <div className="border-t border-gray-200 mt-6 pt-6 flex">
//           <div className="w-[110px] text-[#878787] text-[14px]">Highlights</div>
//           <div className="flex-1 text-[14px] text-[#212121]">
//              <ul className="list-disc pl-4 space-y-2">
//                <li>Brand new, original product</li>
//                <li>Comes with standard manufacturer warranty</li>
//                <li>Cash on Delivery available</li>
//                <li>10 days Return Policy</li>
//              </ul>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


// src/app/product/[id]/page.jsx
// src/app/product/[id]/page.jsx
// src/app/product/[id]/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  
  // Track separate loading states for the two buttons
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Fetch product details on load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const json = await res.json();
        if (json.success) {
          setProduct(json.data);
          setActiveImage(json.data.images[0]); // Set first image as default
        } else {
          throw new Error(json.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // FETCH WISHLIST DATA TO CHECK IF ITEM IS LIKED
  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/wishlist');
      if (res.status === 401) return []; // Not logged in
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data || [];
    },
  });

  const isInWishlist = wishlistItems.some(item => item.product_id === product?.id);

  // WISHLIST MUTATION (Toggles between Add and Remove)
  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      const method = isInWishlist ? 'DELETE' : 'POST';
      const res = await fetch('/api/wishlist', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      
      if (res.status === 401) throw new Error('Unauthorized');
      
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      // Instantly update the wishlist UI and Navbar badge
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
    onError: (err) => {
      if (err.message === 'Unauthorized') {
        router.push(`/login?redirect=/product/${product.id}`);
      } else {
        alert('Failed to update wishlist');
      }
    }
  });

  // Handle Add to Cart (Redirects to /cart)
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to add to cart');
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push('/cart');
    },
    onError: (err) => {
      alert(err.message);
      setAddingToCart(false);
    }
  });

  // Handle Buy Now (Redirects to /checkout)
  const buyNowMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to process');
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      router.push('/checkout'); // CRITICAL: Skips cart and goes to checkout!
    },
    onError: (err) => {
      alert(err.message);
      setBuyingNow(false);
    }
  });

  const handleAddToCart = () => {
    setAddingToCart(true);
    addToCartMutation.mutate();
  };

  const handleBuyNow = () => {
    setBuyingNow(true);
    buyNowMutation.mutate();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000]"></div>
      </div>
    );
  }

if (error || !product) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white min-h-[60vh] m-4 shadow-sm rounded-sm border border-gray-100">
      <img 
        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" 
        alt="Not Available" 
        className="w-48 mb-6 opacity-60"
      />
      <h2 className="text-[20px] font-medium text-[#212121]">Product Not Available</h2>
      <p className="text-[#878787] text-[14px] mt-2 mb-6">
        The item you are looking for might have been removed or is temporarily unavailable.
      </p>
      <button 
        onClick={() => router.push('/')}
        className="bg-[#800000] text-white px-10 py-2.5 rounded-sm font-medium shadow-sm hover:bg-[#a30000] transition-colors uppercase text-[14px]"
      >
        Go to Home
      </button>
    </div>
  );
}

  // Calculate discount
  const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-[1248px] mx-auto bg-[#f1f3f6] md:bg-transparent pb-10 mt-4 px-2 sm:px-0">
      
      {/* LEFT COLUMN: Images & Action Buttons */}
      <div className="w-full md:w-[40%] flex flex-col gap-2">
        <div className="bg-white p-4 border border-gray-200 sticky top-[70px]">
          
          {/* Image Carousel Area */}
          <div className="flex gap-4 h-[350px] sm:h-[450px]">
            {/* Thumbnails (Vertical list) */}
            <div className="flex flex-col gap-2 overflow-y-auto hide-scrollbar w-[64px]">
              {product.images.map((img, index) => (
                <div 
                  key={index} 
                  onMouseEnter={() => setActiveImage(img)}
                  className={`w-16 h-16 border p-1 cursor-pointer flex items-center justify-center ${activeImage === img ? 'border-[#800000]' : 'border-gray-200'}`}
                >
                  <img src={img} alt="thumbnail" className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>

            {/* Main Image Area with WISHLIST HEART ICON */}
            <div className="flex-1 flex items-center justify-center relative border border-gray-100 p-4">
              <img src={activeImage} alt={product.title} className="max-h-full max-w-full object-contain" />
              
              {/* Flipkart Style Wishlist Button */}
              <button 
                onClick={() => toggleWishlistMutation.mutate()}
                disabled={toggleWishlistMutation.isPending}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:shadow transition disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isInWishlist ? "#ff4343" : "none"} stroke={isInWishlist ? "#ff4343" : "#c2c2c2"} strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons (The classic Flipkart Yellow & Orange) */}
          <div className="flex gap-2 mt-6">
            <button 
              onClick={handleAddToCart}
              disabled={addingToCart || buyingNow}
              className="flex-1 bg-[#ff9f00] text-white py-4 px-2 rounded-sm font-semibold text-[16px] shadow flex items-center justify-center gap-2 hover:bg-[#f39800] transition disabled:opacity-70"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M15.32 2.405H4.887C3 2.405 2.46.805 2.46.805L2.257.21C2.208.085 2.083 0 1.946 0H.336C.1 0-.064.24.024.46l.644 1.945L3.11 9.767c.047.137.175.23.32.23h8.418l-.493 1.958H3.768l.002.003c-.017 0-.033-.003-.05-.003-1.06 0-1.92.86-1.92 1.92s.86 1.92 1.92 1.92c.99 0 1.805-.75 1.91-1.712l5.55.076c.12.922.91 1.636 1.867 1.636 1.04 0 1.885-.844 1.885-1.885 0-.866-.584-1.593-1.38-1.814l2.423-8.832c.12-.433-.206-.86-.655-.86" />
              </svg>
              {addingToCart ? 'ADDING...' : 'ADD TO CART'}
            </button>
            
            <button 
              onClick={handleBuyNow}
              disabled={buyingNow || addingToCart}
              className="flex-1 bg-[#fb641b] text-white py-4 px-2 rounded-sm font-semibold text-[16px] shadow flex items-center justify-center gap-2 hover:bg-[#f05c13] transition disabled:opacity-70"
            >
              <svg width="14" height="18" viewBox="0 0 14 18" fill="white">
                <path d="M7 0C3.134 0 0 3.134 0 7c0 5.25 7 11 7 11s7-5.75 7-11c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
              </svg>
              {buyingNow ? 'PROCESSING...' : 'BUY NOW'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Product Details */}
      <div className="w-full md:w-[60%] bg-white p-4 sm:p-6 border border-gray-200">
        
        {/* Breadcrumbs */}
        <div className="text-[12px] text-[#878787] flex gap-2 items-center mb-4">
          <Link href="/" className="hover:text-[#800000] cursor-pointer">Home</Link>
          <svg width="5" height="8" viewBox="0 0 5 8" fill="none"><path d="M1 1l3 3-3 3" stroke="#878787" strokeLinecap="round"/></svg>
          <span className="capitalize">{product.category}</span>
          <svg width="5" height="8" viewBox="0 0 5 8" fill="none"><path d="M1 1l3 3-3 3" stroke="#878787" strokeLinecap="round"/></svg>
          <span className="truncate w-32">{product.title}</span>
        </div>

        {/* Title & Ratings */}
        <h1 className="text-[18px] text-[#212121] font-medium leading-relaxed">
          {product.title}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="bg-[#388e3c] text-white text-[12px] font-bold px-2 py-[2px] rounded-sm flex items-center gap-1">
            4.4 ★
          </div>
          <span className="text-[#878787] text-[14px] font-medium">
            15,483 Ratings & 1,402 Reviews
          </span>
          <div className="ml-2 flex items-center gap-1 text-[10px] font-bold italic text-gray-500">
            Cartify<span className="text-[#800000]">Assured</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-4 flex items-end gap-3">
          <span className="text-[28px] font-medium text-[#212121]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[16px] text-[#878787] line-through mb-1">
            ₹{product.original_price.toLocaleString('en-IN')}
          </span>
          <span className="text-[16px] font-medium text-[#388e3c] mb-1">
            {discount}% off
          </span>
        </div>
        <p className="text-[14px] font-medium text-[#212121] mt-1">Free Delivery</p>

        {/* Available Offers */}
        <div className="mt-6">
          <h3 className="text-[16px] font-medium text-[#212121] mb-2">Available offers</h3>
          <ul className="space-y-2 text-[14px] text-[#212121]">
            <li className="flex gap-2">
              <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-[2px]" />
              <span><span className="font-bold">Bank Offer</span> 5% Cashback on Cartify Axis Bank Card <span className="text-[#800000] font-medium cursor-pointer">T&C</span></span>
            </li>
            <li className="flex gap-2">
              <img src="https://rukminim1.flixcart.com/www/36/36/promos/06/09/2016/c22c9fc4-0555-4460-8401-bf5c28d7ba29.png?q=90" className="w-4 h-4 mt-[2px]" />
              <span><span className="font-bold">Special Price</span> Get extra 10% off (price inclusive of cashback/coupon) <span className="text-[#800000] font-medium cursor-pointer">T&C</span></span>
            </li>
          </ul>
        </div>

        {/* Description Section */}
        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row gap-2 md:gap-0">
          <div className="w-[110px] text-[#878787] text-[14px] font-medium">Description</div>
          <div className="flex-1 text-[14px] text-[#212121] leading-relaxed">
            {product.description}
          </div>
        </div>
        
        {/* Specifications/Highlights */}
        <div className="border-t border-gray-200 mt-6 pt-6 flex flex-col md:flex-row gap-2 md:gap-0">
          <div className="w-[110px] text-[#878787] text-[14px] font-medium">Highlights</div>
          <div className="flex-1 text-[14px] text-[#212121]">
             <ul className="list-disc pl-4 space-y-2">
               <li>Brand new, original product</li>
               <li>Comes with standard manufacturer warranty</li>
               <li>Cash on Delivery available</li>
               <li>10 days Return Policy</li>
             </ul>
          </div>
        </div>

      </div>
    </div>
  );
}