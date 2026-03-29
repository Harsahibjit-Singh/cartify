// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#3b0909] text-white mt-8 pt-10">
      <div className="max-w-[1248px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-[12px]">
        
        {/* Links Columns */}
        <div>
          <h4 className="text-[#878787] mb-3 uppercase font-medium">About</h4>
          <ul className="space-y-2 flex flex-col">
            <a href="#" className="hover:underline">Contact Us</a>
            <a href="#" className="hover:underline">About Us</a>
            <a href="#" className="hover:underline">Careers</a>
            <a href="#" className="hover:underline">Cartify Stories</a>
          </ul>
        </div>
        
        <div>
          <h4 className="text-[#878787] mb-3 uppercase font-medium">Help</h4>
          <ul className="space-y-2 flex flex-col">
            <a href="#" className="hover:underline">Payments</a>
            <a href="#" className="hover:underline">Shipping</a>
            <a href="#" className="hover:underline">Cancellation & Returns</a>
            <a href="#" className="hover:underline">FAQ</a>
          </ul>
        </div>

        <div>
          <h4 className="text-[#878787] mb-3 uppercase font-medium">Consumer Policy</h4>
          <ul className="space-y-2 flex flex-col">
            <a href="#" className="hover:underline">Return Policy</a>
            <a href="#" className="hover:underline">Terms Of Use</a>
            <a href="#" className="hover:underline">Security</a>
            <a href="#" className="hover:underline">Privacy</a>
          </ul>
        </div>

        {/* Vertical Divider for large screens */}
        <div className="hidden lg:block border-l border-[#5c2323] h-full mx-4"></div>

        {/* Address Columns */}
        <div className="lg:col-span-1">
          <h4 className="text-[#878787] mb-3 uppercase font-medium">Mail Us:</h4>
          <p className="leading-5 text-gray-300">
            Cartify Internet Private Limited,<br />
            Buildings Alyssa, Begonia &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103,<br />
            Karnataka, India
          </p>
        </div>

        <div className="lg:col-span-1">
          <h4 className="text-[#878787] mb-3 uppercase font-medium">Registered Office Address:</h4>
          <p className="leading-5 text-gray-300">
            Cartify Internet Private Limited,<br />
            Buildings Alyssa, Begonia &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Bengaluru, 560103,<br />
            Karnataka, India <br />
            CIN : U51109KA2012PTC066107 <br />
            Telephone: <span className="text-red-400 cursor-pointer hover:underline">044-45614700</span>
          </p>
        </div>
      </div>

      {/* Bottom Footer Strip */}
      <div className="border-t border-[#5c2323] mt-10 py-6 flex flex-wrap justify-between items-center max-w-[1248px] mx-auto px-6 text-[14px]">
        <div className="flex gap-4 items-center mb-4 md:mb-0">
          <span className="flex items-center gap-2 cursor-pointer hover:underline">
            <span className="text-yellow-500">🛍️</span> Become a Seller
          </span>
          <span className="flex items-center gap-2 cursor-pointer hover:underline">
            <span className="text-yellow-500">⭐</span> Advertise
          </span>
          <span className="flex items-center gap-2 cursor-pointer hover:underline">
            <span className="text-yellow-500">🎁</span> Gift Cards
          </span>
        </div>

        {/* Dummy Payment Icons text representation */}
        <div className="flex gap-2 font-bold text-gray-400 italic">
          <span>VISA</span>
          <span>MasterCard</span>
          <span>RuPay</span>
        </div>
      </div>
    </footer>
  );
}