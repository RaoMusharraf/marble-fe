// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { AuthModal } from './AuthModal';

// export function AuthNav() {
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);

//   // Load auth state from localStorage on component mount
//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
//     setIsVerified(!!accessToken);
//   }, []);

//   const handleVerificationSuccess = (accessToken: string) => {
//     console.log('Access token received:', accessToken);
//     localStorage.setItem('accessToken', accessToken);
//     setIsVerified(true);
//     setIsAuthModalOpen(false);
//   };

//   const handleLogout = () => {
//     setIsVerified(false);
//     localStorage.removeItem('accessToken');
//   };

//   return (
//     <div className="flex items-center gap-4">
//       {!isVerified ? (
//         <Button
//           onClick={() => setIsAuthModalOpen(true)}
//           className="bg-purple-600 hover:bg-purple-700 text-white"
//         >
//           Get Started
//         </Button>
//       ) : (
//         <div className="flex items-center gap-4">
//           <Button
//             onClick={() => {/* Handle wallet opening */ }}
//             className="bg-purple-600 hover:bg-purple-700 text-white"
//           >
//             Open Wallet
//           </Button>
//           <Button
//             onClick={handleLogout}
//             variant="outline"
//             className="text-white border-white hover:bg-white/10"
//           >
//             Logout
//           </Button>
//         </div>
//       )}

//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => setIsAuthModalOpen(false)}
//         onVerificationSuccess={handleVerificationSuccess}
//       />
//     </div>
//   );
// } 