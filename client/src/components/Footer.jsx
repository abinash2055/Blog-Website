// import React from "react";

// const Footer = () => {
//   return (
//     <div className="text-sm text-center bg-gray-50 py-4">
//       © Copyright 2025 | Blog App Designed and Developed :{" "}
//       <a
//         href="https://www.youtube.com/channel/UCRsODlZoJvC2BmMLmDM7k_Q"
//         className="font-bold"
//       >
//         Personal Signature. |
//       </a>
//       | All rights reserved.. |
//       <a
//         href="https://3-d-portfolio-theta-nine.vercel.app/"
//         className="font-bold"
//       >
//         | Personal Website
//       </a>
//     </div>
//   );
// };

// export default Footer;

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0 text-center md:text-left">
        {/* Copyright */}
        <p className="text-sm md:text-base">
          © 2025 | Blog App Designed and Developed by{" "}
          <a
            href="https://www.youtube.com/channel/UCRsODlZoJvC2BmMLmDM7k_Q"
            className="font-bold underline hover:text-yellow-400 transition-colors"
          >
            Personal Signature
          </a>
          .
        </p>

        {/* All Rights */}
        <p className="text-sm md:text-base">| All rights reserved</p>

        {/* Personal Website */}
        <a
          href="https://3-d-portfolio-theta-nine.vercel.app/"
          className="text-sm md:text-base font-bold underline hover:text-yellow-400 transition-colors"
        >
          Personal Website
        </a>
      </div>
    </footer>
  );
};

export default Footer;
