import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { SOCIAL_LINKS } from "../../data/socialLinks";

const companyLinks = [
  { name: "About Us", to: "/about" },
  { name: "Become a Partner", to: "/partner" },
  { name: "Careers", to: "/careers" },
  { name: "Contact", to: "/contact" },
];

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <h3 className="text-white text-2xl font-bold mb-3">
            RoadRescue
          </h3>

          <p className="text-slate-400 text-sm leading-relaxed">
            Help is one tap away. Roadside assistance, towing, and repair,
            anytime and anywhere.
          </p>
        </div>

        {/* Services */}
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

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>

          <ul className="space-y-2 text-sm text-slate-400">
            {companyLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-primary-500 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Follow Us</h4>

          <div className="flex gap-4 text-lg">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RoadRescue on Facebook"
              className="hover:text-primary-500 transition-colors"
            >
              <FaFacebook />
            </a>

            <a
              href={SOCIAL_LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RoadRescue on Twitter"
              className="hover:text-primary-500 transition-colors"
            >
              <FaTwitter />
            </a>

            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RoadRescue on Instagram"
              className="hover:text-primary-500 transition-colors"
            >
              <FaInstagram />
            </a>

            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="RoadRescue on LinkedIn"
              className="hover:text-primary-500 transition-colors"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        Copyright {new Date().getFullYear()} RoadRescue. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;