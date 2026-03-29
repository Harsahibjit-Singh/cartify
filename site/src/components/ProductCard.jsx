// src/components/ProductCard.jsx
import Link from 'next/link';

export default function ProductCard({ product }) {
  // Calculate discount percentage
  const discount = Math.round(
    ((product.original_price - product.price) / product.original_price) * 100
  );

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group flex flex-col bg-white p-4 w-full min-w-[180px] sm:min-w-[220px] max-w-[250px] hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.11)] transition-shadow duration-200 border border-transparent hover:border-gray-100 flex-shrink-0"
    >
      {/* Product Image */}
      <div className="w-full h-[180px] flex items-center justify-center mb-4 overflow-hidden relative">
        <img 
          src={product.images[0] || 'https://via.placeholder.com/200'} 
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {/* Fake Cartify Assured badge - Updated to Maroon */}
        <div className="absolute bottom-0 left-0 bg-[#f1f3f6] px-2 py-1 text-[9px] font-bold text-gray-500 rounded-tr-md flex items-center gap-1">
          Cartify <span className="text-[#800000]">Assured</span>
          <svg width="10" height="10" viewBox="0 0 16 16" fill="#800000"><path d="M8 0L6.5 4.5 2 3l3 3.5-3 4 4.5-1.5L8 14l1.5-5 4.5 1.5-3-4 3-3.5-4.5 1.5L8 0z"/></svg>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-grow items-center text-center">
        <h3 className="text-[14px] font-medium text-[#212121] truncate w-full group-hover:text-[#800000]">
          {product.title}
        </h3>
        
        {/* Rating Pill - Standard Flipkart Green */}
        <div className="flex items-center gap-2 mt-1">
          <div className="bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-[1px] rounded-[3px] flex items-center gap-1">
            4.2 <svg width="8" height="8" viewBox="0 0 16 16" fill="white"><path d="M8 0L6.5 4.5 2 3l3 3.5-3 4 4.5-1.5L8 14l1.5-5 4.5 1.5-3-4 3-3.5-4.5 1.5L8 0z"/></svg>
          </div>
          <span className="text-[#878787] text-[12px] font-medium">(1,240)</span>
        </div>

        <p className="text-[13px] text-[#388e3c] mt-1 font-medium capitalize">
          Min {discount}% Off
        </p>

        {/* Pricing */}
        <div className="mt-2 flex items-center justify-center gap-2 w-full">
          <span className="text-[16px] font-semibold text-[#212121]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-[12px] text-[#878787] line-through">
            ₹{product.original_price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </Link>
  );
}