import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-white text-2xl font-bold mb-3">RoadRescue</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Help is one tap away. Roadside assistance, towing, and repair — anytime, anywhere.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Breakdown Repair</li>
            <li>Towing</li>
            <li>Battery Jump-Start</li>
            <li>Flat Tyre Repair</li>
            <li>Fuel Delivery</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>About Us</li>
            <li>Become a Partner</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>
          <div className="flex gap-4 text-lg">
            <FaFacebook className="hover:text-primary-500 cursor-pointer" />
            <FaTwitter className="hover:text-primary-500 cursor-pointer" />
            <FaInstagram className="hover:text-primary-500 cursor-pointer" />
            <FaLinkedin className="hover:text-primary-500 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} RoadRescue. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;