import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const footerLinks = [
    {
      title: "Portal",
      links: [
        { name: "Report Lost", href: "/report-lost" },
        { name: "Report Found", href: "/report-found" },
        { name: "Browse Items", href: "/items-feed" },
        { name: "How it Works", href: "#how-it-works" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/support" },
        { name: "Contact Us", href: "/#contact" },
        { name: "Privacy Policy", href: "/legal" },
        { name: "Terms of Use", href: "/legal" },
      ],
    },
    {
      title: "Campus",
      links: [
        { name: "Admin Portal", href: "/admin-info" },
        { name: "Student Login", href: "/login" },
        { name: "Register", href: "/register" },
        { name: "FAQ", href: "/support" },
      ],
    },
  ];

  return (
    <footer className="bg-black pt-[120px] pb-10 text-white">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12"
        >
          {/* Column 1: Brand */}
          <motion.div variants={itemVariants} className="flex flex-col">
            <a href="#home" className="flex items-center gap-2 w-fit mb-8">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-black" />
              </div>
              <span className="text-[24px] font-[800] tracking-tight">
                Lost<span className="font-medium">&</span>Found
              </span>
            </a>
            <p className="text-white/50 text-[16px] leading-[1.8] max-w-[280px] mb-10">
              The official campus-wide infrastructure for item recovery and community coordination.
            </p>
            <div className="flex items-center gap-6">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.2, opacity: 1, color: "#ffffff" }}
                  className="text-white/40 transition-all"
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Columns 2-4: Links */}
          {footerLinks.map((section, idx) => (
            <motion.div key={idx} variants={itemVariants} className="flex flex-col">
              <h4 className="text-[14px] font-[800] uppercase tracking-[0.2em] mb-8 text-white/90">
                {section.title}
              </h4>
              <ul className="space-y-5">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-[15px] text-white/50 hover:text-white transition-all font-medium"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-[15px] text-white/50 hover:text-white transition-all font-medium"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-[1px] w-full bg-white/10 mt-[100px] mb-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-white/40 text-[14px] font-medium">
          <div>
            © 2024 Lost & Found Portal. Built for excellence.
          </div>
          <div className="flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" /> by University Student Tech
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
